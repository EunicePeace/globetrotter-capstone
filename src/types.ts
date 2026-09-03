export type Category = 
  | 'Monuments'
  | 'Museums'
  | 'Nature & Parks'
  | 'Cuisine & Markets'
  | 'Culture & Heritage'
  | 'Sacred & Religion'
  | 'Nightlife & Entertainment'
  | 'Academic & Tech'
  | 'Architecture'
  | 'Sports & Leisure';

export type BudgetTier = 'Budget-friendly' | 'Moderate' | 'Luxury';

export type MeansOfTransport = 
  | 'Yellow Taxi (Depôt/Course)'
  | 'Clando Taxi (Shared)'
  | 'Moto-Taxi (Bensikin)'
  | 'VIP Bus'
  | 'Walking'
  | 'Private Car / Rental';

export interface Site {
  id: string;
  name: string;
  frenchName: string;
  category: Category;
  quarter: string; // e.g. Bastos, Omnisports, Messassi, Centre-Ville, Ngoa-Ekelle
  historicalContext: string;
  description: string;
  image: string;
  galleryImages?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedTimeMinutes: number; // Time from central Yaoundé (Post Office Square)
  meansOfTransport: MeansOfTransport[];
  routeDirections: string; // Step by step destination path to arrive there
  budgetTier: BudgetTier;
  priceEstimateXAF: number; // Transport + Entrance in FCFA
  priceEstimateUSD: number; // Approx USD equivalent
  entranceFeeXAF: number;
  entranceFeeUSD: number;
  rating: number; // e.g. 4.8
  interests: string[]; // e.g. ['culture', 'nature', 'history', 'art']
  openingHours?: string;
  recommendedDurationMinutes: number;
  insiderTip?: string;
}

export interface ItineraryItem {
  id: string;
  siteId: string;
  timeSlot: string;
  dayNumber: number;
  notes?: string;
  transportMethod?: MeansOfTransport;
  costXAF?: number;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  totalCostXAF: number;
  totalCostUSD: number;
  createdBy: string;
  isGroup: boolean;
  shareCode: string;
  groupMembers: string[];
}

export interface TravelAlert {
  id: string;
  type: 'traffic' | 'weather' | 'flight' | 'itinerary';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  timestamp: string;
  quarter?: string;
  icon?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  locationId?: string;
  locationName?: string;
  title: string;
  content: string;
  photoUrl?: string;
  voiceTranscript?: string;
  likes: number;
  commentsCount: number;
  isPublic: boolean;
  author: string;
  authorAvatar: string;
}

export interface Expense {
  id: string;
  category: 'transport' | 'entrance' | 'food' | 'souvenirs' | 'lodging';
  description: string;
  amountXAF: number;
  date: string;
  siteId?: string;
}

export interface TranslationPhrase {
  id: string;
  english: string;
  french: string;
  ewondo: string;
  camfranglais: string;
  category: 'Greetings' | 'Directions' | 'Bargaining & Money' | 'Dining' | 'Emergency' | 'Transport';
  pronunciation: string;
}

export type ArchitecturePhase = 'phase1' | 'phase2' | 'phase3' | 'phase4';

export interface PhaseDetail {
  id: ArchitecturePhase;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  architectureType: string;
  techStack: string[];
  keyOutcome: string;
  challenges: string[];
  components: { name: string; role: string; status: 'online' | 'degraded' | 'cached' }[];
}
