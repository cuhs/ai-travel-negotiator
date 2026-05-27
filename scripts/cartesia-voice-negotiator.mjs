#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import process from "node:process";
import WebSocket from "ws";

const CARTESIA_API_VERSION = "2026-03-01";
const CARTESIA_AGENT_STREAM_VERSION = process.env.CARTESIA_AGENT_STREAM_VERSION ?? "2025-04-16";
const AGENT_INPUT_FORMAT = "pcm_44100";
const SAMPLE_RATE = "44100";

loadDotEnv();

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (args["list-audio-devices"]) {
  process.exit(await listAudioDevices());
}

const agentId = args["agent-id"] ?? process.env.CARTESIA_AGENT_ID;
if (!agentId && !args["dry-run"]) {
  throw new Error("Missing CARTESIA_AGENT_ID. Set it in .env or pass --agent-id.");
}

const session = {
  hotelName: args["hotel-name"] ?? "the hotel",
  hotelPhone: args["hotel-phone"] ?? "unknown",
  destination: args.destination ?? "the destination",
  checkIn: args["check-in"] ?? "the requested check-in date",
  checkOut: args["check-out"] ?? "the requested check-out date",
  guests: args.guests ?? "2",
  rooms: args.rooms ?? "1",
  targetRate: args["target-rate"] ?? "the lowest available rate",
  maxRate: args["max-rate"] ?? "the listed online rate",
  roomType: args["room-type"] ?? "a standard room",
  voiceId: args["voice-id"] ?? process.env.CARTESIA_VOICE_ID,
  inputDevice: args["input-device"] ?? process.env.AUDIO_INPUT_DEVICE,
};

const prompt = buildNegotiationPrompt(session);
const introduction = buildIntroduction(session);

if (args["dry-run"]) {
  console.log("Cartesia voice negotiator dry run\n");
  console.log(`Agent ID: ${agentId ?? "(missing)"}`);
  console.log(`Voice ID: ${session.voiceId ?? "(agent default)"}`);
  console.log(`Input device: ${session.inputDevice ?? defaultInputDevice()}`);
  console.log("\nIntroduction:\n");
  console.log(introduction);
  console.log("\nSystem prompt:\n");
  console.log(prompt);
  process.exit(0);
}

const apiKey = requiredEnv("CARTESIA_API_KEY");

assertCommand("ffmpeg", "ffmpeg is required for microphone capture.");
assertCommand("ffplay", "ffplay is required for speaker playback.");

const accessToken = await createAccessToken(apiKey);
const ws = new WebSocket(`wss://api.cartesia.ai/agents/stream/${agentId}`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Cartesia-Version": CARTESIA_AGENT_STREAM_VERSION,
  },
});

let streamId = randomUUID();
let micProcess;
let playerProcess = startPlayer();

ws.on("open", () => {
  console.log("Connected to Cartesia agent stream.");
  ws.send(
    JSON.stringify({
      event: "start",
      stream_id: streamId,
      config: {
        input_format: AGENT_INPUT_FORMAT,
        ...(session.voiceId ? { voice_id: session.voiceId } : {}),
      },
      agent: {
        introduction,
        system_prompt: prompt,
      },
      metadata: {
        hotel_name: session.hotelName,
        hotel_phone: session.hotelPhone,
        destination: session.destination,
        check_in: session.checkIn,
        check_out: session.checkOut,
        guests: String(session.guests),
        rooms: String(session.rooms),
        target_rate: String(session.targetRate),
        max_rate: String(session.maxRate),
        source: "ai-travel-negotiator-local-script",
      },
    })
  );
});

ws.on("message", (raw) => {
  const message = JSON.parse(raw.toString());

  if (message.event === "ack") {
    streamId = message.stream_id ?? streamId;
    console.log(`Cartesia stream acknowledged: ${streamId}`);
    micProcess = startMicrophone((chunk) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(
        JSON.stringify({
          event: "media_input",
          stream_id: streamId,
          media: { payload: chunk.toString("base64") },
        })
      );
    });
    console.log("Microphone streaming. Press Ctrl+C to end.");
    return;
  }

  if (message.event === "media_output" && message.media?.payload) {
    const audio = Buffer.from(message.media.payload, "base64");
    if (!playerProcess?.stdin?.destroyed) {
      playerProcess.stdin.write(audio);
    }
    return;
  }

  if (message.event === "clear") {
    restartPlayer();
    return;
  }

  if (message.event === "transfer_call") {
    console.log(`Cartesia requested call transfer: ${message.transfer?.target_phone_number ?? "unknown target"}`);
    return;
  }

  if (message.event === "error" || message.type === "error") {
    console.error("Cartesia error:", JSON.stringify(message, null, 2));
    shutdown(1);
  }
});

ws.on("close", (code, reason) => {
  console.log(`Cartesia stream closed: ${code} ${reason?.toString() ?? ""}`.trim());
  shutdown(0);
});

ws.on("error", (error) => {
  console.error("Cartesia WebSocket error:", error.message);
  shutdown(1);
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function createAccessToken(key) {
  const response = await fetch("https://api.cartesia.ai/access-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Cartesia-Version": CARTESIA_API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grants: { agent: true },
      expires_in: 3600,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cartesia access-token request failed: ${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  if (!body.token) throw new Error("Cartesia access-token response did not include token.");
  return body.token;
}

function startMicrophone(onChunk) {
  const child = spawn("ffmpeg", inputArgs(), { stdio: ["ignore", "pipe", "inherit"] });
  child.stdout.on("data", onChunk);
  child.on("exit", (code) => {
    if (code !== null && code !== 0) console.error(`ffmpeg exited with code ${code}`);
  });
  return child;
}

function startPlayer() {
  const child = spawn(
    "ffplay",
    ["-f", "s16le", "-ar", SAMPLE_RATE, "-ac", "1", "-nodisp", "-autoexit", "-loglevel", "warning", "-"],
    { stdio: ["pipe", "ignore", "inherit"] }
  );
  child.on("exit", (code) => {
    if (code !== null && code !== 0) console.error(`ffplay exited with code ${code}`);
  });
  return child;
}

function restartPlayer() {
  playerProcess?.stdin?.end();
  playerProcess?.kill("SIGTERM");
  playerProcess = startPlayer();
}

function inputArgs() {
  const device = session.inputDevice ?? defaultInputDevice();
  if (process.platform === "darwin") {
    return ["-loglevel", "warning", "-f", "avfoundation", "-i", device, "-ac", "1", "-ar", SAMPLE_RATE, "-f", "s16le", "pipe:1"];
  }
  if (process.platform === "win32") {
    return ["-loglevel", "warning", "-f", "dshow", "-i", `audio=${device}`, "-ac", "1", "-ar", SAMPLE_RATE, "-f", "s16le", "pipe:1"];
  }
  return ["-loglevel", "warning", "-f", "alsa", "-i", device, "-ac", "1", "-ar", SAMPLE_RATE, "-f", "s16le", "pipe:1"];
}

function defaultInputDevice() {
  if (process.platform === "darwin") return ":0";
  if (process.platform === "win32") return "default";
  return "default";
}

function listAudioDevices() {
  assertCommand("ffmpeg", "ffmpeg is required to list audio devices.");
  const child = process.platform === "darwin"
    ? spawn("ffmpeg", ["-f", "avfoundation", "-list_devices", "true", "-i", ""], { stdio: "inherit" })
    : process.platform === "win32"
      ? spawn("ffmpeg", ["-list_devices", "true", "-f", "dshow", "-i", "dummy"], { stdio: "inherit" })
      : spawn("ffmpeg", ["-sources", "alsa"], { stdio: "inherit" });
  return new Promise((resolve) => child.on("exit", (code) => resolve(code ?? 0)));
}

function buildIntroduction(s) {
  return `Hello, this is an AI travel assistant calling about ${s.hotelName}. I am checking availability and trying to confirm the best rate for ${s.rooms} room(s), ${s.guests} guest(s), from ${s.checkIn} to ${s.checkOut}.`;
}

function buildNegotiationPrompt(s) {
  return [
    "### Role",
    "You are a polite but persistent voice travel negotiator calling a hotel front desk or reservations desk.",
    "",
    "### Objective",
    `Negotiate the best refundable or flexible rate for ${s.rooms} room(s), ${s.guests} guest(s), in ${s.destination}, checking in ${s.checkIn} and checking out ${s.checkOut}. Requested room type: ${s.roomType}.`,
    `The current listed rate is ${s.maxRate}. Your target rate is ${s.targetRate}.`,
    "",
    "### Conversation Strategy",
    "- Be concise and natural. This is a live voice call.",
    "- Ask for the best available direct-booking rate, then ask whether they can beat the online rate.",
    "- Mention flexibility only if useful: loyalty/member rates, prepaid rates, AAA/senior/corporate-style public rates, waived fees, breakfast, parking, upgrades, or late checkout.",
    "- Do not invent membership numbers, payment details, identities, or authority to book.",
    "- If the hotel cannot discount, ask for a value add or fee waiver.",
    "- If the hotel offers a concrete final rate, repeat the rate, currency, room type, cancellation terms, and any extras.",
    "- If the call reaches voicemail, a queue, or a wrong number, summarize that clearly and end.",
    "",
    "### Guardrails",
    "- Never provide credit card details.",
    "- Never agree to non-refundable booking unless the human user has explicitly authorized it in the live conversation.",
    "- If asked for personal data you do not have, say you can provide it after confirming the rate with the traveler.",
    "- End the call once you have a final quoted rate or the hotel refuses to improve the offer.",
    "",
    "### Output During Call",
    "Speak only to the person on the call. Do not narrate internal reasoning.",
  ].join("\n");
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "help" || key === "dry-run" || key === "list-audio-devices") {
      parsed[key] = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    parsed[key] = value;
    i += 1;
  }
  return parsed;
}

function loadDotEnv() {
  const path = ".env";
  if (!existsSync(path)) return;
  const contents = readFileSync(path, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env or export it in your shell.`);
  return value;
}

function assertCommand(command, message) {
  const check = spawnSync(process.platform === "win32" ? "where" : "which", [command], { stdio: "ignore" });
  if (check.status !== 0) {
    console.error(`${message}\nInstall FFmpeg, then rerun this script.`);
    process.exit(1);
  }
}

function shutdown(code) {
  micProcess?.kill("SIGTERM");
  playerProcess?.stdin?.end();
  playerProcess?.kill("SIGTERM");
  if (ws.readyState === WebSocket.OPEN) ws.close(1000, "session completed");
  setTimeout(() => process.exit(code), 50).unref();
}

function printHelp() {
  console.log(`
Usage:
  npm run voice:cartesia -- [options]

Required environment:
  CARTESIA_API_KEY       Cartesia API key
  CARTESIA_AGENT_ID      Cartesia agent id, unless --agent-id is passed

Audio requirements:
  ffmpeg and ffplay must be installed and available on PATH.

Options:
  --hotel-name <name>        Hotel name for prompt and metadata
  --hotel-phone <phone>      Hotel phone number for metadata
  --destination <place>      Trip destination
  --check-in <date>          Check-in date
  --check-out <date>         Check-out date
  --guests <n>               Guest count
  --rooms <n>                Room count
  --room-type <type>         Requested room type
  --target-rate <amount>     Target negotiated rate
  --max-rate <amount>        Current listed rate
  --voice-id <id>            Optional Cartesia voice override
  --input-device <device>    ffmpeg input device. macOS default is :0
  --agent-id <id>            Cartesia agent id override
  --list-audio-devices       Print ffmpeg audio devices
  --dry-run                  Print prompt/config without opening a call
  --help                     Print this help
`);
}
