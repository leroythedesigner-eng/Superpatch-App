export interface OfficeUser {
  email: string;
  pass: string;
  name: string;
  role: string;
}

export interface Driver {
  name: string;
  plate: string;
  truck: string;
  phone?: string;
}

export interface Item {
  n: string; // name
  u: string; // unit
  cost: number;
  onHand: number;
  reorder: number;
}

export interface Production {
  hours: number;
  target: number;
  opening: number;
  dispatched: number;
  balance: number;
  tons: number;
}

export interface Stop {
  nm: string; // name
  addr: string; // address
  bags: number;
  type: string;
  eta: string;
  gps: string;
  st: 'todo' | 'route' | 'site' | 'done';
  comments?: string[]; // Plant manager comment section for orders/stops
  distanceKm?: number; // Distance in KM
  loads?: number; // Loads count
  clientContact?: string;
  pricePerBag?: number;
  assignedDriverPlate?: string;
  assignedDriverName?: string;
}

export interface Quote {
  id: string;
  clientName: string;
  contactNumber: string;
  deliveryAddress: string;
  bags: number;
  pricePerBag: number;
  distanceKm: number;
  deliveryCostPerKm: number;
  subtotalBags: number;
  subtotalDelivery: number;
  vat: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  comments: string[]; // Plant manager comment section for this quote/order
}

export interface DailyProduction {
  date: string;
  startTime: string; // expected starting time, e.g., "06:00"
  target: number; // expected target, e.g., 500
  produced: number; // actual bags produced
  opening: number;
  dispatched: number;
  balance: number;
  tons: number;
  comments: string[]; // Plant manager comment section for daily manufacturing
  hours: number;
}

export interface ReportDay {
  date: string; // "YYYY-MM-DD" format
  closingStock: number; // bags
  produced: number; // bags
  delivered: number; // bags
  ordersCompleted: number;
  deliveryDistance: number; // km
  loads: number;
  manufacturingComments: string[];
  orderComments: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: string;
  itemName: string;
  qty: number;
  unit: string;
  ref: string;
  before: number;
  after: number;
  valueImpact: number;
}
