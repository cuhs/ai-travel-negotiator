import { MockCity } from "@/types";

export const MOCK_CITIES: MockCity[] = [
  {
    name: "New York",
    code: "NYC",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    priceRange: [120, 600],
  },
  {
    name: "Tokyo",
    code: "TYO",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    priceRange: [80, 400],
  },
  {
    name: "Paris",
    code: "PAR",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    priceRange: [90, 500],
  },
  {
    name: "London",
    code: "LON",
    country: "United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
    priceRange: [100, 550],
  },
  {
    name: "Barcelona",
    code: "BCN",
    country: "Spain",
    lat: 41.3874,
    lng: 2.1686,
    priceRange: [70, 350],
  },
  {
    name: "Sydney",
    code: "SYD",
    country: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    priceRange: [90, 450],
  },
];

interface MockHotelTemplate {
  name: string;
  address: string;
  starRating: number;
  rating: number;
  phone: string;
  description: string;
  amenities: string[];
  priceMultiplier: number;
}

const HOTEL_TEMPLATES: Record<string, MockHotelTemplate[]> = {
  NYC: [
    {
      name: "The Manhattan Grand",
      address: "350 5th Ave, New York, NY 10118",
      starRating: 5,
      rating: 4.7,
      phone: "+1-212-555-0101",
      description: "Luxury hotel in the heart of Midtown Manhattan with stunning skyline views.",
      amenities: ["WiFi", "Gym", "Spa", "Rooftop Bar", "Concierge", "Room Service"],
      priceMultiplier: 1.0,
    },
    {
      name: "Brooklyn Bridge Hotel",
      address: "189 Bridge St, Brooklyn, NY 11201",
      starRating: 4,
      rating: 4.4,
      phone: "+1-718-555-0202",
      description: "Modern boutique hotel with views of the Brooklyn Bridge and Manhattan skyline.",
      amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Laundry"],
      priceMultiplier: 0.7,
    },
    {
      name: "Times Square Inn",
      address: "560 7th Ave, New York, NY 10018",
      starRating: 3,
      rating: 3.9,
      phone: "+1-212-555-0303",
      description: "Affordable stay right in the heart of Times Square. Steps from Broadway.",
      amenities: ["WiFi", "Restaurant", "24hr Front Desk"],
      priceMultiplier: 0.45,
    },
    {
      name: "Central Park Suites",
      address: "25 Central Park West, New York, NY 10023",
      starRating: 5,
      rating: 4.8,
      phone: "+1-212-555-0404",
      description: "Premium suites overlooking Central Park. World-class dining and spa.",
      amenities: ["WiFi", "Gym", "Spa", "Restaurant", "Bar", "Valet Parking", "Concierge", "Room Service"],
      priceMultiplier: 1.3,
    },
    {
      name: "SoHo Loft Hotel",
      address: "112 Greene St, New York, NY 10012",
      starRating: 4,
      rating: 4.5,
      phone: "+1-212-555-0505",
      description: "Trendy boutique hotel in SoHo with loft-style rooms and art gallery.",
      amenities: ["WiFi", "Restaurant", "Bar", "Gallery", "Laundry"],
      priceMultiplier: 0.8,
    },
    {
      name: "Chelsea Garden Hotel",
      address: "220 W 23rd St, New York, NY 10011",
      starRating: 3,
      rating: 4.1,
      phone: "+1-212-555-0606",
      description: "Charming hotel in Chelsea with a courtyard garden and easy subway access.",
      amenities: ["WiFi", "Garden", "Restaurant", "Laundry"],
      priceMultiplier: 0.5,
    },
    {
      name: "Wall Street Residence",
      address: "88 Greenwich St, New York, NY 10006",
      starRating: 4,
      rating: 4.3,
      phone: "+1-212-555-0707",
      description: "Elegant hotel in the Financial District with classic architecture.",
      amenities: ["WiFi", "Gym", "Business Center", "Restaurant", "Bar"],
      priceMultiplier: 0.75,
    },
    {
      name: "Harlem Heritage Inn",
      address: "246 W 138th St, New York, NY 10030",
      starRating: 2,
      rating: 3.6,
      phone: "+1-212-555-0808",
      description: "Budget-friendly inn celebrating Harlem's rich cultural heritage.",
      amenities: ["WiFi", "Breakfast"],
      priceMultiplier: 0.25,
    },
    {
      name: "Midtown East Suites",
      address: "440 Lexington Ave, New York, NY 10017",
      starRating: 3,
      rating: 4.0,
      phone: "+1-212-555-0909",
      description: "Comfortable suites near Grand Central Terminal. Great for business travelers.",
      amenities: ["WiFi", "Gym", "Business Center", "Laundry"],
      priceMultiplier: 0.55,
    },
    {
      name: "The Plaza",
      address: "768 5th Ave, New York, NY 10019",
      starRating: 5,
      rating: 4.9,
      phone: "+1-212-555-1010",
      description: "Iconic landmark hotel at the corner of Central Park. Legendary luxury.",
      amenities: ["WiFi", "Gym", "Spa", "Restaurant", "Bar", "Valet Parking", "Concierge", "Room Service", "Pool"],
      priceMultiplier: 1.6,
    },
    {
      name: "East Village Lodge",
      address: "98 St Marks Pl, New York, NY 10009",
      starRating: 2,
      rating: 3.7,
      phone: "+1-212-555-1111",
      description: "Quirky budget lodge in the vibrant East Village. Walkable to nightlife.",
      amenities: ["WiFi", "Shared Kitchen"],
      priceMultiplier: 0.2,
    },
    {
      name: "Hudson Yards Hotel",
      address: "455 W 30th St, New York, NY 10001",
      starRating: 4,
      rating: 4.6,
      phone: "+1-212-555-1212",
      description: "Sleek modern hotel in the new Hudson Yards development. Near the Vessel.",
      amenities: ["WiFi", "Gym", "Rooftop Bar", "Restaurant", "Spa"],
      priceMultiplier: 0.85,
    },
  ],
  TYO: [
    {
      name: "Shinjuku Imperial Hotel",
      address: "1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo",
      starRating: 5,
      rating: 4.7,
      phone: "+81-3-5555-0101",
      description: "Premium hotel in Shinjuku with panoramic views of Mount Fuji on clear days.",
      amenities: ["WiFi", "Onsen", "Restaurant", "Bar", "Concierge"],
      priceMultiplier: 1.0,
    },
    {
      name: "Shibuya Stream Hotel",
      address: "3-21-3 Shibuya, Shibuya-ku, Tokyo",
      starRating: 4,
      rating: 4.4,
      phone: "+81-3-5555-0202",
      description: "Modern hotel overlooking the famous Shibuya Crossing.",
      amenities: ["WiFi", "Gym", "Restaurant", "Bar"],
      priceMultiplier: 0.7,
    },
    {
      name: "Asakusa Traditional Ryokan",
      address: "2-8-1 Asakusa, Taito-ku, Tokyo",
      starRating: 3,
      rating: 4.5,
      phone: "+81-3-5555-0303",
      description: "Traditional Japanese inn near Senso-ji temple. Tatami rooms and kaiseki dining.",
      amenities: ["WiFi", "Onsen", "Traditional Breakfast"],
      priceMultiplier: 0.55,
    },
    {
      name: "Ginza Luxury Suites",
      address: "5-2-1 Ginza, Chuo-ku, Tokyo",
      starRating: 5,
      rating: 4.8,
      phone: "+81-3-5555-0404",
      description: "Five-star luxury in Tokyo's upscale shopping district.",
      amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Concierge", "Room Service"],
      priceMultiplier: 1.2,
    },
    {
      name: "Akihabara Tech Hotel",
      address: "1-12-5 Sotokanda, Chiyoda-ku, Tokyo",
      starRating: 3,
      rating: 4.0,
      phone: "+81-3-5555-0505",
      description: "Tech-themed hotel in the heart of Akihabara's electronics district.",
      amenities: ["WiFi", "Gaming Lounge", "Restaurant"],
      priceMultiplier: 0.4,
    },
    {
      name: "Roppongi Hills Residence",
      address: "6-10-1 Roppongi, Minato-ku, Tokyo",
      starRating: 4,
      rating: 4.3,
      phone: "+81-3-5555-0606",
      description: "Upscale hotel in Roppongi Hills with art museum and city views.",
      amenities: ["WiFi", "Gym", "Pool", "Restaurant", "Bar", "Art Gallery"],
      priceMultiplier: 0.8,
    },
    {
      name: "Ueno Budget Inn",
      address: "3-18-6 Ueno, Taito-ku, Tokyo",
      starRating: 2,
      rating: 3.5,
      phone: "+81-3-5555-0707",
      description: "Affordable inn near Ueno Park and its famous cherry blossoms.",
      amenities: ["WiFi", "Shared Bath"],
      priceMultiplier: 0.2,
    },
    {
      name: "Tokyo Station Marunouchi Hotel",
      address: "1-9-1 Marunouchi, Chiyoda-ku, Tokyo",
      starRating: 4,
      rating: 4.5,
      phone: "+81-3-5555-0808",
      description: "Classic hotel adjacent to Tokyo Station with direct Shinkansen access.",
      amenities: ["WiFi", "Restaurant", "Bar", "Business Center", "Concierge"],
      priceMultiplier: 0.75,
    },
    {
      name: "Harajuku Boutique Hotel",
      address: "3-5-2 Jingumae, Shibuya-ku, Tokyo",
      starRating: 3,
      rating: 4.1,
      phone: "+81-3-5555-0909",
      description: "Fashionable boutique hotel steps from Harajuku's Takeshita Street.",
      amenities: ["WiFi", "Cafe", "Rooftop Terrace"],
      priceMultiplier: 0.5,
    },
    {
      name: "Odaiba Bay View Hotel",
      address: "2-6-1 Daiba, Minato-ku, Tokyo",
      starRating: 4,
      rating: 4.2,
      phone: "+81-3-5555-1010",
      description: "Waterfront hotel on Odaiba island with Rainbow Bridge views.",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar"],
      priceMultiplier: 0.7,
    },
  ],
  PAR: [
    {
      name: "Hotel Le Marais",
      address: "15 Rue de Rivoli, 75004 Paris",
      starRating: 4,
      rating: 4.5,
      phone: "+33-1-5555-0101",
      description: "Boutique hotel in the trendy Le Marais district, walking distance to Notre-Dame.",
      amenities: ["WiFi", "Restaurant", "Bar", "Concierge"],
      priceMultiplier: 0.8,
    },
    {
      name: "Champs-Elysees Grand",
      address: "75 Avenue des Champs-Elysees, 75008 Paris",
      starRating: 5,
      rating: 4.8,
      phone: "+33-1-5555-0202",
      description: "Palace hotel on the world-famous Champs-Elysees with Arc de Triomphe views.",
      amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Valet Parking", "Concierge", "Room Service"],
      priceMultiplier: 1.3,
    },
    {
      name: "Montmartre View Hotel",
      address: "22 Rue Lepic, 75018 Paris",
      starRating: 3,
      rating: 4.2,
      phone: "+33-1-5555-0303",
      description: "Charming hotel in Montmartre with Sacre-Coeur views and artistic heritage.",
      amenities: ["WiFi", "Breakfast", "Terrace"],
      priceMultiplier: 0.5,
    },
    {
      name: "La Defense Business Hotel",
      address: "2 Place de la Defense, 92800 Puteaux",
      starRating: 4,
      rating: 4.1,
      phone: "+33-1-5555-0404",
      description: "Modern business hotel in La Defense with direct metro to city center.",
      amenities: ["WiFi", "Gym", "Business Center", "Restaurant"],
      priceMultiplier: 0.65,
    },
    {
      name: "Latin Quarter Inn",
      address: "18 Rue Mouffetard, 75005 Paris",
      starRating: 2,
      rating: 3.8,
      phone: "+33-1-5555-0505",
      description: "Budget inn in the historic Latin Quarter near the Pantheon.",
      amenities: ["WiFi", "Breakfast"],
      priceMultiplier: 0.25,
    },
    {
      name: "Eiffel Tower Suite Hotel",
      address: "10 Avenue de Suffren, 75007 Paris",
      starRating: 5,
      rating: 4.7,
      phone: "+33-1-5555-0606",
      description: "Luxury suites with direct Eiffel Tower views. Michelin-starred restaurant.",
      amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Concierge", "Room Service"],
      priceMultiplier: 1.4,
    },
    {
      name: "Bastille Modern Hotel",
      address: "5 Rue de la Bastille, 75011 Paris",
      starRating: 3,
      rating: 4.0,
      phone: "+33-1-5555-0707",
      description: "Contemporary hotel near Place de la Bastille with vibrant nightlife nearby.",
      amenities: ["WiFi", "Bar", "Laundry"],
      priceMultiplier: 0.45,
    },
    {
      name: "Saint-Germain Boutique",
      address: "32 Rue de Seine, 75006 Paris",
      starRating: 4,
      rating: 4.4,
      phone: "+33-1-5555-0808",
      description: "Elegant boutique hotel in Saint-Germain-des-Pres, steps from the Luxembourg Gardens.",
      amenities: ["WiFi", "Restaurant", "Bar", "Courtyard Garden"],
      priceMultiplier: 0.85,
    },
    {
      name: "Louvre Prestige Hotel",
      address: "4 Rue de l'Amiral de Coligny, 75001 Paris",
      starRating: 4,
      rating: 4.6,
      phone: "+33-1-5555-0909",
      description: "Upscale hotel just steps from the Louvre Museum and Tuileries Garden.",
      amenities: ["WiFi", "Restaurant", "Bar", "Spa", "Concierge"],
      priceMultiplier: 0.95,
    },
    {
      name: "Canal Saint-Martin Lodge",
      address: "56 Quai de Valmy, 75010 Paris",
      starRating: 2,
      rating: 3.6,
      phone: "+33-1-5555-1010",
      description: "Affordable lodge along the picturesque Canal Saint-Martin.",
      amenities: ["WiFi", "Shared Kitchen"],
      priceMultiplier: 0.2,
    },
  ],
  LON: [
    {
      name: "The Westminster",
      address: "22 Westminster Bridge Rd, London SE1 7TU",
      starRating: 5,
      rating: 4.7,
      phone: "+44-20-7555-0101",
      description: "Grand hotel with views of Big Ben and the Houses of Parliament.",
      amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Concierge", "Room Service"],
      priceMultiplier: 1.2,
    },
    {
      name: "Camden Town Hotel",
      address: "15 Camden High St, London NW1 0JH",
      starRating: 3,
      rating: 4.0,
      phone: "+44-20-7555-0202",
      description: "Hip hotel in Camden Town near the famous market and music venues.",
      amenities: ["WiFi", "Bar", "Restaurant"],
      priceMultiplier: 0.45,
    },
    {
      name: "Kensington Gardens Hotel",
      address: "55 Queensborough Terrace, London W2 3SJ",
      starRating: 4,
      rating: 4.4,
      phone: "+44-20-7555-0303",
      description: "Elegant hotel near Kensington Gardens and the Royal Albert Hall.",
      amenities: ["WiFi", "Restaurant", "Bar", "Garden"],
      priceMultiplier: 0.85,
    },
    {
      name: "Tower Bridge Suites",
      address: "3 More London Riverside, London SE1 2RE",
      starRating: 4,
      rating: 4.3,
      phone: "+44-20-7555-0404",
      description: "Modern suites with Tower Bridge views and easy access to the City.",
      amenities: ["WiFi", "Gym", "Restaurant", "Business Center"],
      priceMultiplier: 0.8,
    },
    {
      name: "Notting Hill Boutique",
      address: "28 Portobello Rd, London W11 2DY",
      starRating: 3,
      rating: 4.2,
      phone: "+44-20-7555-0505",
      description: "Colorful boutique hotel on the famous Portobello Road market street.",
      amenities: ["WiFi", "Breakfast", "Courtyard"],
      priceMultiplier: 0.6,
    },
    {
      name: "City of London Club",
      address: "120 Moorgate, London EC2M 6SX",
      starRating: 4,
      rating: 4.1,
      phone: "+44-20-7555-0606",
      description: "Premium business hotel in the heart of London's financial district.",
      amenities: ["WiFi", "Gym", "Business Center", "Restaurant", "Bar"],
      priceMultiplier: 0.75,
    },
    {
      name: "Brixton Budget Stay",
      address: "45 Brixton Rd, London SW9 6BE",
      starRating: 2,
      rating: 3.5,
      phone: "+44-20-7555-0707",
      description: "Affordable stay in vibrant Brixton with great food and music scene.",
      amenities: ["WiFi", "Shared Kitchen"],
      priceMultiplier: 0.2,
    },
    {
      name: "Mayfair Luxury Hotel",
      address: "10 Half Moon St, London W1J 7BH",
      starRating: 5,
      rating: 4.9,
      phone: "+44-20-7555-0808",
      description: "Ultra-luxury hotel in Mayfair with world-class dining and spa.",
      amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Bar", "Valet", "Concierge", "Room Service"],
      priceMultiplier: 1.5,
    },
    {
      name: "Shoreditch Hip Hotel",
      address: "88 Great Eastern St, London EC2A 3HX",
      starRating: 3,
      rating: 4.1,
      phone: "+44-20-7555-0909",
      description: "Design-forward hotel in trendy Shoreditch with street art and nightlife.",
      amenities: ["WiFi", "Bar", "Rooftop Terrace"],
      priceMultiplier: 0.5,
    },
    {
      name: "South Bank View",
      address: "72 Upper Ground, London SE1 9PZ",
      starRating: 4,
      rating: 4.5,
      phone: "+44-20-7555-1010",
      description: "Riverside hotel on the South Bank near Tate Modern and the Globe Theatre.",
      amenities: ["WiFi", "Restaurant", "Bar", "River Views"],
      priceMultiplier: 0.8,
    },
  ],
  BCN: [
    {
      name: "La Rambla Grand",
      address: "La Rambla 85, 08002 Barcelona",
      starRating: 5,
      rating: 4.6,
      phone: "+34-93-555-0101",
      description: "Iconic hotel on La Rambla with rooftop pool and Mediterranean views.",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Concierge"],
      priceMultiplier: 1.0,
    },
    {
      name: "Gothic Quarter Inn",
      address: "12 Carrer del Bisbe, 08002 Barcelona",
      starRating: 3,
      rating: 4.2,
      phone: "+34-93-555-0202",
      description: "Charming inn in the medieval Gothic Quarter, steps from the cathedral.",
      amenities: ["WiFi", "Breakfast", "Terrace"],
      priceMultiplier: 0.45,
    },
    {
      name: "Barceloneta Beach Hotel",
      address: "45 Passeig Maritim, 08003 Barcelona",
      starRating: 4,
      rating: 4.4,
      phone: "+34-93-555-0303",
      description: "Beachfront hotel with sea views and direct beach access.",
      amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Beach Access"],
      priceMultiplier: 0.75,
    },
    {
      name: "Sagrada Familia View",
      address: "20 Carrer de Mallorca, 08029 Barcelona",
      starRating: 4,
      rating: 4.3,
      phone: "+34-93-555-0404",
      description: "Modern hotel with stunning views of the Sagrada Familia.",
      amenities: ["WiFi", "Gym", "Restaurant", "Rooftop Bar"],
      priceMultiplier: 0.7,
    },
    {
      name: "Gracia Boutique",
      address: "8 Carrer de Verdi, 08012 Barcelona",
      starRating: 3,
      rating: 4.0,
      phone: "+34-93-555-0505",
      description: "Bohemian boutique hotel in the artsy Gracia neighborhood.",
      amenities: ["WiFi", "Courtyard", "Breakfast"],
      priceMultiplier: 0.4,
    },
    {
      name: "Diagonal Premium Suites",
      address: "300 Avinguda Diagonal, 08009 Barcelona",
      starRating: 5,
      rating: 4.7,
      phone: "+34-93-555-0606",
      description: "Luxury suites on Avinguda Diagonal with Catalan fine dining.",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Valet", "Concierge"],
      priceMultiplier: 1.2,
    },
    {
      name: "El Raval Budget Hostal",
      address: "15 Carrer del Hospital, 08001 Barcelona",
      starRating: 2,
      rating: 3.4,
      phone: "+34-93-555-0707",
      description: "Budget hostal in El Raval with MACBA museum nearby.",
      amenities: ["WiFi", "Shared Bathroom"],
      priceMultiplier: 0.15,
    },
    {
      name: "Eixample Modernist Hotel",
      address: "55 Carrer de Pau Claris, 08010 Barcelona",
      starRating: 4,
      rating: 4.5,
      phone: "+34-93-555-0808",
      description: "Art Nouveau hotel celebrating Gaudi's modernist architecture.",
      amenities: ["WiFi", "Restaurant", "Bar", "Garden"],
      priceMultiplier: 0.8,
    },
  ],
  SYD: [
    {
      name: "Sydney Harbour View",
      address: "11 Harrington St, Sydney NSW 2000",
      starRating: 5,
      rating: 4.8,
      phone: "+61-2-5555-0101",
      description: "Harbour-front hotel with Opera House and Harbour Bridge views.",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Concierge", "Room Service"],
      priceMultiplier: 1.2,
    },
    {
      name: "Bondi Beach Hotel",
      address: "10 Campbell Parade, Bondi Beach NSW 2026",
      starRating: 4,
      rating: 4.3,
      phone: "+61-2-5555-0202",
      description: "Beachfront hotel on iconic Bondi Beach with ocean views.",
      amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Surf Hire"],
      priceMultiplier: 0.8,
    },
    {
      name: "Darling Harbour Suites",
      address: "30 Wheat Rd, Sydney NSW 2000",
      starRating: 4,
      rating: 4.4,
      phone: "+61-2-5555-0303",
      description: "Modern suites at Darling Harbour with waterfront dining.",
      amenities: ["WiFi", "Gym", "Pool", "Restaurant", "Bar"],
      priceMultiplier: 0.75,
    },
    {
      name: "The Rocks Heritage Hotel",
      address: "88 Cumberland St, The Rocks NSW 2000",
      starRating: 3,
      rating: 4.1,
      phone: "+61-2-5555-0404",
      description: "Heritage-listed hotel in The Rocks with sandstone architecture.",
      amenities: ["WiFi", "Restaurant", "Bar", "Courtyard"],
      priceMultiplier: 0.55,
    },
    {
      name: "Surry Hills Boutique",
      address: "22 Foveaux St, Surry Hills NSW 2010",
      starRating: 3,
      rating: 4.0,
      phone: "+61-2-5555-0505",
      description: "Trendy boutique hotel in Surry Hills, Sydney's creative hub.",
      amenities: ["WiFi", "Cafe", "Rooftop"],
      priceMultiplier: 0.45,
    },
    {
      name: "Circular Quay Grand",
      address: "61-69 Macquarie St, Sydney NSW 2000",
      starRating: 5,
      rating: 4.7,
      phone: "+61-2-5555-0606",
      description: "Premium hotel at Circular Quay overlooking the Opera House.",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Valet", "Concierge", "Room Service"],
      priceMultiplier: 1.4,
    },
    {
      name: "Kings Cross Budget Inn",
      address: "15 Bayswater Rd, Kings Cross NSW 2011",
      starRating: 2,
      rating: 3.3,
      phone: "+61-2-5555-0707",
      description: "Budget inn in Kings Cross with easy access to nightlife.",
      amenities: ["WiFi", "Shared Kitchen"],
      priceMultiplier: 0.2,
    },
    {
      name: "Manly Beach Lodge",
      address: "55 The Corso, Manly NSW 2095",
      starRating: 3,
      rating: 4.2,
      phone: "+61-2-5555-0808",
      description: "Relaxed beach lodge in Manly, a short ferry ride from the city.",
      amenities: ["WiFi", "Breakfast", "Beach Access"],
      priceMultiplier: 0.5,
    },
  ],
};

const ROOM_TYPES = [
  { name: "Standard Room", boardType: "Room Only", multiplier: 1.0 },
  { name: "Standard Room", boardType: "Breakfast Included", multiplier: 1.15 },
  { name: "Deluxe Room", boardType: "Room Only", multiplier: 1.4 },
  { name: "Deluxe Room", boardType: "Breakfast Included", multiplier: 1.55 },
  { name: "Suite", boardType: "Room Only", multiplier: 2.0 },
  { name: "Suite", boardType: "Half Board", multiplier: 2.3 },
];

interface MockHotelResult {
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  starRating: number;
  rating: number;
  description: string;
  amenities: string[];
  photoUrl: string;
  offers: {
    roomType: string;
    boardType: string;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    cancellationPolicy: string;
    provider: string;
  }[];
}

export function getMockHotels(cityCode: string, checkIn: Date, checkOut: Date, guests: number, rooms: number): MockHotelResult[] {
  const city = MOCK_CITIES.find((c) => c.code === cityCode);
  if (!city || !HOTEL_TEMPLATES[cityCode]) return [];

  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

  const templates = HOTEL_TEMPLATES[cityCode];
  return templates.map((template) => {
    const basePrice = city.priceRange[0] + (city.priceRange[1] - city.priceRange[0]) * template.priceMultiplier;
    const guestFactor = guests > 2 ? 1 + (guests - 2) * 0.1 : 1;
    const roomFactor = rooms;

    const offers = ROOM_TYPES.map((rt) => {
      const pricePerNight = Math.round(basePrice * rt.multiplier * guestFactor * 100) / 100;
      return {
        roomType: rt.name,
        boardType: rt.boardType,
        pricePerNight,
        totalPrice: Math.round(pricePerNight * nights * roomFactor * 100) / 100,
        currency: "USD",
        cancellationPolicy: rt.multiplier < 1.5 ? "Free cancellation up to 48h before check-in" : "Non-refundable",
        provider: "amadeus",
      };
    });

    return {
      name: template.name,
      address: template.address,
      city: city.name,
      lat: city.lat + (Math.random() - 0.5) * 0.05,
      lng: city.lng + (Math.random() - 0.5) * 0.05,
      phone: template.phone,
      starRating: template.starRating,
      rating: template.rating,
      description: template.description,
      amenities: template.amenities,
      photoUrl: `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(template.name)}`,
      offers,
    };
  });
}

const AGENT_DIALOGUE = [
  "Hello, I'm calling on behalf of a client who's interested in booking a stay at your hotel.",
  "I understand. We're looking at dates from {checkIn} to {checkOut} for {guests} guest(s) in {rooms} room(s).",
  "I've seen your rates listed at ${originalPrice} per night. Given that we're comparing several hotels in the area, could you offer a better rate?",
  "That's appreciated. Could you go a bit lower? My client is a frequent traveler and would be a great long-term referral.",
  "That sounds reasonable. Can you confirm the final rate and any included amenities?",
  "Thank you very much. I'll pass this along to my client. Have a great day!",
];

const HOTEL_DIALOGUE = [
  "Good afternoon, thank you for calling. How can I help you today?",
  "Yes, we have availability for those dates. Our standard rate would be ${originalPrice} per night for that room type.",
  "Hmm, let me check what I can do... I could offer a {discount}% discount, bringing it to ${negotiatedPrice} per night.",
  "I appreciate you mentioning that. Let me speak with my manager... I can offer ${negotiatedPrice} per night, which includes breakfast.",
  "The rate is ${negotiatedPrice} per night, including breakfast and WiFi. This is our best available rate for those dates.",
  "You're welcome! We look forward to potentially hosting your client.",
];

const FAIL_DIALOGUE = [
  "Good afternoon, this is the front desk. How can I help?",
  "I'm sorry, our rates are fixed and we don't offer discounts for those dates. It's our peak season.",
  "I understand, but I'm not able to adjust pricing. You're welcome to book at the standard rate.",
  "I'm sorry I couldn't help. Feel free to try again closer to the dates. Goodbye.",
];

const NO_ANSWER_AGENT = [
  "Hello? Is anyone there?",
  "I'm calling about a potential hotel booking... I'll try again later.",
];

export function generateMockNegotiation(
  originalPrice: number,
  hotelName: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number
): { success: boolean; result: { callId: string; originalPrice: number; negotiatedPrice: number; discountPercent: number; transcript: { speaker: "agent" | "hotel"; text: string }[]; durationMs: number } } {
  const rand = Math.random();
  const callId = `call_${Math.random().toString(36).substring(2, 10)}`;

  if (rand < 0.1) {
    return {
      success: false,
      result: {
        callId,
        originalPrice,
        negotiatedPrice: originalPrice,
        discountPercent: 0,
        transcript: NO_ANSWER_AGENT.map((text) => ({
          speaker: "agent" as const,
          text: text.replace("{hotelName}", hotelName),
        })),
        durationMs: 8000 + Math.floor(Math.random() * 4000),
      },
    };
  }

  if (rand < 0.25) {
    return {
      success: false,
      result: {
        callId,
        originalPrice,
        negotiatedPrice: originalPrice,
        discountPercent: 0,
        transcript: [
          { speaker: "agent", text: AGENT_DIALOGUE[0] },
          ...FAIL_DIALOGUE.map((text) => ({
            speaker: "hotel" as const,
            text,
          })),
        ],
        durationMs: 25000 + Math.floor(Math.random() * 15000),
      },
    };
  }

  const discount = 5 + Math.floor(Math.random() * 21);
  const negotiatedPrice = Math.round(originalPrice * (1 - discount / 100) * 100) / 100;

  const transcript = [
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[0],
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[0],
    },
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[1]
        .replace("{checkIn}", checkIn)
        .replace("{checkOut}", checkOut)
        .replace("{guests}", String(guests))
        .replace("{rooms}", String(rooms)),
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[1].replace("{originalPrice}", String(originalPrice)),
    },
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[2].replace("{originalPrice}", String(originalPrice)),
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[2]
        .replace("{discount}", String(discount))
        .replace("{negotiatedPrice}", String(negotiatedPrice)),
    },
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[3],
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[3].replace("{negotiatedPrice}", String(negotiatedPrice)),
    },
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[4],
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[4].replace("{negotiatedPrice}", String(negotiatedPrice)),
    },
    {
      speaker: "agent" as const,
      text: AGENT_DIALOGUE[5],
    },
    {
      speaker: "hotel" as const,
      text: HOTEL_DIALOGUE[5],
    },
  ];

  return {
    success: true,
    result: {
      callId,
      originalPrice,
      negotiatedPrice,
      discountPercent: discount,
      transcript,
      durationMs: 45000 + Math.floor(Math.random() * 60000),
    },
  };
}
