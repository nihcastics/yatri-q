// Mock data for YATRI-Q - Premium train booking intelligence
// This will be replaced with actual FastAPI endpoints later

export const mockTrains = [
  {
    trainNo: "12951",
    trainName: "Mumbai Rajdhani Express",
    type: "Rajdhani",
    from: { code: "NDLS", name: "New Delhi", city: "Delhi" },
    to: { code: "CSTM", name: "Mumbai CST", city: "Mumbai" },
    depTime: "16:55",
    arrTime: "08:35",
    durationMin: 935,
    classes: ["1A", "2A", "3A"],
    fares: { "1A": 4565, "2A": 2890, "3A": 2095 },
    seatPrediction: { probability: 85, band: "likely", insights: ["High confirmation rate for this route", "Book 2-3 days in advance", "3AC has better availability"] },
    tatkalPrediction: { bestWindows: [{ start: "10:00", end: "10:02" }], note: "Strong tatkal chances" },
    sentiment: { tag: "positive", reason: "Punctual service, good amenities", snippets: ["Clean coaches", "On-time arrival", "Good food quality"] },
    status: "On time",
    delayMin: 0
  },
  {
    trainNo: "12423",
    trainName: "Dibrugarh Rajdhani Express", 
    type: "Rajdhani",
    from: { code: "NDLS", name: "New Delhi", city: "Delhi" },
    to: { code: "DBRG", name: "Dibrugarh", city: "Assam" },
    depTime: "12:05",
    arrTime: "18:30",
    durationMin: 1905,
    classes: ["2A", "3A", "SL"],
    fares: { "2A": 3890, "3A": 2795, "SL": 895 },
    seatPrediction: { probability: 62, band: "uncertain", insights: ["Moderate availability", "Try flexible dates", "SL class recommended"] },
    tatkalPrediction: { bestWindows: [{ start: "10:00", end: "10:01" }], note: "Quick booking required" },
    sentiment: { tag: "mixed", reason: "Long journey, some delays reported", snippets: ["Scenic route", "Food service adequate", "Some delays in monsoon"] },
    status: "+12m",
    delayMin: 12
  },
  {
    trainNo: "22691",
    trainName: "Habibganj Rajdhani Express",
    type: "Rajdhani", 
    from: { code: "NDLS", name: "New Delhi", city: "Delhi" },
    to: { code: "HBJ", name: "Habibganj", city: "Bhopal" },
    depTime: "06:15",
    arrTime: "15:05",
    durationMin: 530,
    classes: ["1A", "2A", "3A"],
    fares: { "1A": 3765, "2A": 2390, "3A": 1895 },
    seatPrediction: { probability: 91, band: "likely", insights: ["Excellent availability", "Premium service", "Book with confidence"] },
    tatkalPrediction: { bestWindows: [{ start: "10:00", end: "10:03" }], note: "Good tatkal success rate" },
    sentiment: { tag: "positive", reason: "Modern train, excellent service", snippets: ["Very clean", "Punctual", "Great staff service"] },
    status: "On time",
    delayMin: 0
  }
];

export const mockStations = [
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "CSTM", name: "Mumbai CST", city: "Mumbai" },
  { code: "DBRG", name: "Dibrugarh", city: "Assam" },
  { code: "HBJ", name: "Habibganj", city: "Bhopal" },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal" },
  { code: "JBP", name: "Jabalpur", city: "Madhya Pradesh" },
  { code: "AGC", name: "Agra Cantt", city: "Agra" },
  { code: "GWL", name: "Gwalior", city: "Madhya Pradesh" }
];

export const mockBookings = [
  {
    pnr: "4567891234",
    trainNo: "12951",
    trainName: "Mumbai Rajdhani Express",
    from: "NDLS", 
    to: "CSTM",
    date: "2025-01-15",
    status: "Confirmed",
    class: "3A",
    coach: "B1",
    seat: "45,46"
  },
  {
    pnr: "7891234567", 
    trainNo: "22691",
    trainName: "Habibganj Rajdhani Express",
    from: "NDLS",
    to: "HBJ", 
    date: "2025-01-20",
    status: "WL/23",
    class: "2A",
    coach: "-",
    seat: "-"
  }
];

export const mockRoundTripBundles = [
  {
    id: 1,
    totalFare: 4180,
    totalDuration: 1870,
    confirmationScore: 92,
    outbound: { trainNo: "12951", depTime: "16:55", class: "3A" },
    return: { trainNo: "12952", depTime: "17:15", class: "3A" }
  },
  {
    id: 2, 
    totalFare: 3890,
    totalDuration: 1965,
    confirmationScore: 78,
    outbound: { trainNo: "22691", depTime: "06:15", class: "3A" },
    return: { trainNo: "22692", depTime: "21:40", class: "3A" }
  }
];

export const mockTrackingData = {
  trainNo: "12951",
  status: "Running",
  delayMin: 5,
  currentIndex: 2,
  path: [
    { lat: 28.6139, lng: 77.2090, eta: "16:55", stationCode: "NDLS", stationName: "New Delhi", visited: true },
    { lat: 28.4595, lng: 77.0266, eta: "17:45", stationCode: "GGN", stationName: "Gurgaon", visited: true },
    { lat: 27.1767, lng: 78.0081, eta: "20:15", stationCode: "AGC", stationName: "Agra Cantt", visited: true },
    { lat: 26.2183, lng: 78.1828, eta: "22:30", stationCode: "GWL", stationName: "Gwalior", visited: false },
    { lat: 23.1645, lng: 79.9362, eta: "02:45", stationCode: "JBP", stationName: "Jabalpur", visited: false },
    { lat: 19.0760, lng: 72.8777, eta: "08:35", stationCode: "CSTM", stationName: "Mumbai CST", visited: false }
  ]
};

export const mockChatSuggestions = [
  "Find fastest train to Mumbai tomorrow",
  "Cheapest AC option Delhi to Bangalore",
  "Round trip Delhi-Goa with 3 days stay", 
  "Track my PNR 4567891234",
  "Best time to book Rajdhani tickets"
];