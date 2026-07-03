import { OfficeUser, Driver, Item, Production, Stop, Quote, DailyProduction, ReportDay, ActivityLog } from './types';

export const INITIAL_OFFICE_USERS: OfficeUser[] = [
  { email: "lee@pascal.co.za", pass: "Matimba123@", name: "Leroy Moses", role: "Owner / Admin" }
];

export const DRIVER_LOGIN = { email: "driver", pass: "driver" };

export const ROLES = ["Owner / Admin", "Plant Manager", "Sales / Admin", "Warehouse", "Production"];
export const ADD_ROLES = ["Plant Manager", "Sales / Admin", "Warehouse", "Owner / Admin", "Driver", "Production"];
export const TRUCK_SIZES = ["34t Horse & Trailer", "16t Horse & Trailer", "8t Rigid", "Bakkie / LDV"];

export const INITIAL_DRIVERS: Driver[] = [
  { name: "Samuel Nkosi", plate: "HN 23 YP GP", truck: "34t Horse & Trailer", phone: "0821112222" },
  { name: "Thabo Nkosi", plate: "FT 45 PL GP", truck: "16t Horse & Trailer", phone: "0834445555" }
];

export const INITIAL_ITEMS: Item[] = [
  { n: "Bitumen", u: "Litre", cost: 16.3, onHand: 7811.50, reorder: 5000 },
  { n: "Solvents", u: "Litre", cost: 18.5, onHand: 6980.00, reorder: 200 },
  { n: "Burner Fuel", u: "Litre", cost: 12.77, onHand: 2955.00, reorder: 1000 },
  { n: "Diesel", u: "Litre", cost: 23, onHand: 0, reorder: 500 },
  { n: "Dust", u: "Kg", cost: 0.75, onHand: 0, reorder: 500 },
  { n: "Stone 6.7", u: "Ton", cost: 140, onHand: 223.27, reorder: 30 },
  { n: "Sand", u: "Ton", cost: 304, onHand: 313.80, reorder: 40 },
  { n: "Plastic Bags (printed)", u: "Unit", cost: 6.2, onHand: 0, reorder: 3000 },
  { n: "Plastic Bags (unprinted)", u: "Unit", cost: 5.5, onHand: 1588.00, reorder: 1000 },
  { n: "Slurry Bags", u: "Unit", cost: 7, onHand: 750.00, reorder: 200 },
  { n: "SS60 Drums", u: "Litre", cost: 45, onHand: 660.00, reorder: 200 },
  { n: "SS60 25L", u: "Litre", cost: 48, onHand: 0, reorder: 100 },
  { n: "SS60 5L", u: "Litre", cost: 52, onHand: 0, reorder: 50 },
  { n: "Pallets", u: "Unit", cost: 60, onHand: 40.00, reorder: 30 },
];

export const INITIAL_PROD: Production = {
  hours: 6,
  target: 90,
  opening: 7166,
  dispatched: 1250,
  balance: 5916,
  tons: 147.9
};

export const INITIAL_DAILY_PRODUCTIONS: DailyProduction[] = [
  {
    date: "2026-06-24",
    startTime: "06:00",
    target: 90,
    produced: 320,
    opening: 13960,
    dispatched: 2733,
    balance: 11547,
    tons: 288.675,
    comments: ["Mixer burner running smoothly today.", "Operator Mathye reports excellent batch cohesion."],
    hours: 6
  },
  {
    date: "2026-06-23",
    startTime: "06:00",
    target: 90,
    produced: 480,
    opening: 13500,
    dispatched: 1800,
    balance: 13960,
    tons: 349.000,
    comments: ["Excellent run. Closed nearly on target. Bitumen levels starting to decrease.", "No equipment failure logged."],
    hours: 8
  },
  {
    date: "2026-06-22",
    startTime: "07:30",
    target: 80,
    produced: 350,
    opening: 13200,
    dispatched: 1200,
    balance: 13500,
    tons: 337.500,
    comments: ["Power fluctuation delayed start by 1.5h. Recovered well.", "Staggered shift initialized."],
    hours: 6.5
  }
];

export const INITIAL_STOPS: Stop[] = [
  { nm: "Mogale City Roads Depot", addr: "Commissioner St, Krugersdorp", bags: 90, type: "Municipality", eta: "08:20", gps: "-26.1011, 27.7708", st: "todo", comments: ["Contact: Thabo - 082 333 4444", "Ensure delivery note signed twice."], distanceKm: 14, loads: 1, clientContact: "082 333 4444", pricePerBag: 75, assignedDriverPlate: "HN 23 YP GP", assignedDriverName: "Samuel Nkosi" },
  { nm: "Kagiso Ext 12 — pothole repair", addr: "Kagiso, Mogale City", bags: 60, type: "Public Works", eta: "09:30", gps: "-26.0822, 27.7669", st: "todo", comments: ["Offloading adjacent to main taxi rank.", "Site manager requested early arrival."], distanceKm: 22, loads: 1, clientContact: "071 555 1212", pricePerBag: 75, assignedDriverPlate: "HN 23 YP GP", assignedDriverName: "Samuel Nkosi" },
  { nm: "Munsieville rehab site", addr: "Munsieville, Krugersdorp", bags: 40, type: "Public Works", eta: "10:40", gps: "-26.0789, 27.7472", st: "todo", comments: ["Difficult muddy entrance. Driver Samuel to proceed with caution."], distanceKm: 8, loads: 1, clientContact: "083 444 8812", pricePerBag: 75, assignedDriverPlate: "FT 45 PL GP", assignedDriverName: "Thabo Nkosi" },
  { nm: "Tarlton — Bosch Civils", addr: "R500, Tarlton", bags: 30, type: "Private contractor", eta: "12:10", gps: "-26.0356, 27.6322", st: "todo", comments: ["Private contract invoice SPM2001.", "Client pays on delivery verification."], distanceKm: 31, loads: 1, clientContact: "011 956 2201", pricePerBag: 80, assignedDriverPlate: "FT 45 PL GP", assignedDriverName: "Thabo Nkosi" },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: "SPQ-204",
    clientName: "Mogale City Roads Department",
    contactNumber: "011 951 2000",
    deliveryAddress: "Commissioner St, Krugersdorp Depot",
    bags: 220,
    pricePerBag: 75,
    distanceKm: 14,
    deliveryCostPerKm: 15,
    subtotalBags: 16500,
    subtotalDelivery: 210,
    vat: 2506.5,
    total: 19216.5,
    status: "approved",
    date: "2026-06-19",
    comments: ["Approved by Director of Infrastructure.", "Order converted into stop 1 for delivery."]
  },
  {
    id: "SPQ-205",
    clientName: "Bosch Civils Pty Ltd",
    contactNumber: "082 555 8122",
    deliveryAddress: "R500 Highway Project, Tarlton Intersection",
    bags: 150,
    pricePerBag: 80,
    distanceKm: 31,
    deliveryCostPerKm: 15,
    subtotalBags: 12000,
    subtotalDelivery: 465,
    vat: 1869.75,
    total: 14334.75,
    status: "pending",
    date: "2026-06-24",
    comments: ["Emailed quote directly to Vernon Bosch.", "Client requested delivery on Wednesday."]
  },
  {
    id: "SPQ-206",
    clientName: "West Rand Asphalt Laying",
    contactNumber: "079 444 2201",
    deliveryAddress: "Featherbrooke Estate, Krugersdorp",
    bags: 80,
    pricePerBag: 85,
    distanceKm: 18,
    deliveryCostPerKm: 15,
    subtotalBags: 6800,
    subtotalDelivery: 270,
    vat: 1060.5,
    total: 8130.5,
    status: "pending",
    date: "2026-06-25",
    comments: ["Urgent pothole repair query.", "Pending confirmation of stock availability of plastic printed bags."]
  }
];

// Historical reports calendar data for June 2026 (simplified, customizable)
export const INITIAL_REPORTS_DATA: ReportDay[] = [
  { date: "2026-06-15", closingStock: 12500, produced: 400, delivered: 350, ordersCompleted: 2, deliveryDistance: 45, loads: 2, manufacturingComments: ["Stable burner temperature.", "All bags within SANS 25kg spec."], orderComments: ["Delivered to Mogale Depot without delay."] },
  { date: "2026-06-16", closingStock: 12900, produced: 450, delivered: 220, ordersCompleted: 1, deliveryDistance: 30, loads: 1, manufacturingComments: ["Good dry aggregation feed.", "Shift manager Anthony optimized mix ratios."], orderComments: ["Tarlton client satisfied."] },
  { date: "2026-06-17", closingStock: 13200, produced: 420, delivered: 310, ordersCompleted: 2, deliveryDistance: 55, loads: 3, manufacturingComments: ["Solvent tank refilled safely."], orderComments: ["Kagiso ext site requested secondary quote."] },
  { date: "2026-06-18", closingStock: 13500, produced: 500, delivered: 400, ordersCompleted: 3, deliveryDistance: 68, loads: 4, manufacturingComments: ["High yield output shift.", "Jabu Mathye reports zero machinery heating issues."], orderComments: ["All 3 sites signed off successfully."] },
  { date: "2026-06-19", closingStock: 13960, produced: 550, delivered: 220, ordersCompleted: 1, deliveryDistance: 14, loads: 1, manufacturingComments: ["Peak volume. Closing stock comfortable."], orderComments: ["Mogale City Roads Depot dispatch verified."] },
  { date: "2026-06-20", closingStock: 13960, produced: 0, delivered: 0, ordersCompleted: 0, deliveryDistance: 0, loads: 0, manufacturingComments: ["Weekend plant shutdown.", "Routine mixer lubrication completed."], orderComments: [] },
  { date: "2026-06-21", closingStock: 13960, produced: 0, delivered: 0, ordersCompleted: 0, deliveryDistance: 0, loads: 0, manufacturingComments: ["Sunday closed."], orderComments: [] },
  { date: "2026-06-22", closingStock: 13500, produced: 350, delivered: 1200, ordersCompleted: 4, deliveryDistance: 110, loads: 6, manufacturingComments: ["Power fluctuation delayed start by 1.5h. Recovered well.", "Staggered shift initialized."], orderComments: ["Large bulk delivery completed for Randfontein project."] },
  { date: "2026-06-23", closingStock: 13960, produced: 480, delivered: 1800, ordersCompleted: 5, deliveryDistance: 140, loads: 8, manufacturingComments: ["Excellent run. Closed nearly on target.", "Bitumen levels starting to decrease.", "No equipment failure logged."], orderComments: ["Heavy rain caused site offloading difficulty. All loads successfully stowed."] },
  { date: "2026-06-24", closingStock: 11547, produced: 320, delivered: 2733, ordersCompleted: 4, deliveryDistance: 75, loads: 4, manufacturingComments: ["Mixer burner running smoothly today.", "Operator Mathye reports excellent batch cohesion."], orderComments: ["Mogale Depot dispatcher logged 90 bags stowed."] },
  { date: "2026-06-25", closingStock: 11847, produced: 300, delivered: 220, ordersCompleted: 1, deliveryDistance: 14, loads: 1, manufacturingComments: ["Excellent raw materials load.", "Solvents batch test approved."], orderComments: ["Standard delivery on-time."] },
  { date: "2026-06-26", closingStock: 11347, produced: 0, delivered: 500, ordersCompleted: 2, deliveryDistance: 60, loads: 2, manufacturingComments: ["Scheduled mixer service window. No hot manufacturing today.", "Plant manager Pascal oversaw maintenance."], orderComments: ["Rand West municipality order stowed."] },
  { date: "2026-06-27", closingStock: 11347, produced: 0, delivered: 0, ordersCompleted: 0, deliveryDistance: 0, loads: 0, manufacturingComments: ["Weekend shutdown."], orderComments: [] },
  { date: "2026-06-28", closingStock: 11347, produced: 0, delivered: 0, ordersCompleted: 0, deliveryDistance: 0, loads: 0, manufacturingComments: ["Weekend closed."], orderComments: [] },
  { date: "2026-06-29", closingStock: 11627, produced: 280, delivered: 220, ordersCompleted: 1, deliveryDistance: 22, loads: 1, manufacturingComments: ["Morning run initiated. Aggregate materials staged.", "No delays logged."], orderComments: ["Kagiso repair drop stowed."] },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: "act-1", timestamp: "2026-05-29", type: "Receive", itemName: "Stone 6.7", qty: 31.20, unit: "Ton", ref: "Sourced", before: 0, after: 31.20, valueImpact: 4368.00 },
  { id: "act-2", timestamp: "2026-05-29", type: "Receive", itemName: "Sand", qty: 104.06, unit: "Ton", ref: "Sourced", before: 0, after: 104.06, valueImpact: 31634.24 },
  { id: "act-3", timestamp: "2026-05-29", type: "Receive", itemName: "Burner Fuel", qty: 2000.00, unit: "Litre", ref: "Refill", before: 0, after: 2000.00, valueImpact: 25540.00 },
  { id: "act-4", timestamp: "2026-05-29", type: "Receive", itemName: "Solvents", qty: 6700.00, unit: "Litre", ref: "Refill", before: 0, after: 6700.00, valueImpact: 123950.00 },
  { id: "act-5", timestamp: "2026-05-29", type: "Despatch", itemName: "SS60 Drums", qty: 120.00, unit: "Litre", ref: "Client Delivery", before: 120.00, after: 0, valueImpact: 5400.00 },
  { id: "act-6", timestamp: "2026-06-01", type: "Adjust (+/-)", itemName: "Bitumen", qty: 1984.57, unit: "Litre", ref: "Stock Adjust", before: 0, after: 1984.57, valueImpact: 32348.49 },
  { id: "act-7", timestamp: "2026-06-01", type: "Receive", itemName: "Stone 6.7", qty: 62.92, unit: "Ton", ref: "Sourced", before: 31.20, after: 94.12, valueImpact: 8808.80 },
  { id: "act-8", timestamp: "2026-06-01", type: "Receive", itemName: "Sand", qty: 61.58, unit: "Ton", ref: "Sourced", before: 104.06, after: 165.64, valueImpact: 18720.32 },
  { id: "act-9", timestamp: "2026-06-01", type: "Use in Production", itemName: "Solvents", qty: 800.00, unit: "Litre", ref: "Batch production", before: 6700.00, after: 5900.00, valueImpact: 14800.00 },
  { id: "act-10", timestamp: "2026-06-01", type: "Use in Production", itemName: "Burner Fuel", qty: 278.25, unit: "Litre", ref: "Batch production", before: 2000.00, after: 1721.75, valueImpact: 3553.25 },
  { id: "act-11", timestamp: "2026-06-01", type: "Use in Production", itemName: "Stone 6.7", qty: 16.23, unit: "Ton", ref: "Batch production", before: 94.12, after: 77.89, valueImpact: 2272.38 },
  { id: "act-12", timestamp: "2026-06-01", type: "Use in Production", itemName: "Sand", qty: 30.14, unit: "Ton", ref: "Batch production", before: 165.64, after: 135.50, valueImpact: 9163.70 },
  { id: "act-13", timestamp: "2026-06-01", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 1855.00, unit: "Unit", ref: "Batch production", before: 0, after: -1855.00, valueImpact: 11501.00 },
  { id: "act-14", timestamp: "2026-06-01", type: "Despatch", itemName: "SS60 Drums", qty: 20.00, unit: "Litre", ref: "Client Delivery", before: 0, after: -20.00, valueImpact: 900.00 },
  { id: "act-15", timestamp: "2026-06-01", type: "Adjust (+/-)", itemName: "Plastic Bags (printed)", qty: 1500.00, unit: "Unit", ref: "A-SHAK using own plastic", before: -1855.00, after: -355.00, valueImpact: 9300.00 },
  { id: "act-16", timestamp: "2026-06-01", type: "Use in Production", itemName: "Bitumen", qty: 1994.13, unit: "Litre", ref: "Batch production", before: 1984.57, after: -9.56, valueImpact: 32504.24 },
  { id: "act-17", timestamp: "2026-06-01", type: "Use in Production", itemName: "Pallets", qty: 32.00, unit: "Unit", ref: "Batch production", before: 0, after: -32.00, valueImpact: 1920.00 },
  { id: "act-18", timestamp: "2026-06-02", type: "Use in Production", itemName: "Bitumen", qty: 2800.38, unit: "Litre", ref: "Batch production", before: -9.56, after: -2809.94, valueImpact: 45646.11 },
  { id: "act-19", timestamp: "2026-06-02", type: "Use in Production", itemName: "Solvents", qty: 1042.00, unit: "Litre", ref: "Batch production", before: 5900.00, after: 4858.00, valueImpact: 19277.00 },
  { id: "act-20", timestamp: "2026-06-02", type: "Use in Production", itemName: "Burner Fuel", qty: 390.75, unit: "Litre", ref: "Batch production", before: 1721.75, after: 1331.00, valueImpact: 4989.88 },
  { id: "act-21", timestamp: "2026-06-02", type: "Receive", itemName: "Sand", qty: 25.50, unit: "Ton", ref: "Sourced", before: 135.50, after: 161.00, valueImpact: 7752.00 },
  { id: "act-22", timestamp: "2026-06-02", type: "Receive", itemName: "Stone 6.7", qty: 24.18, unit: "Ton", ref: "Sourced", before: 77.89, after: 102.07, valueImpact: 3385.20 },
  { id: "act-23", timestamp: "2026-06-02", type: "Use in Production", itemName: "Sand", qty: 42.33, unit: "Ton", ref: "Batch production", before: 161.00, after: 118.67, valueImpact: 12868.70 },
  { id: "act-24", timestamp: "2026-06-02", type: "Use in Production", itemName: "Stone 6.7", qty: 22.79, unit: "Ton", ref: "Batch production", before: 102.07, after: 79.28, valueImpact: 3191.13 },
  { id: "act-25", timestamp: "2026-06-02", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 2605.00, unit: "Unit", ref: "Batch production", before: -355.00, after: -2960.00, valueImpact: 16151.00 },
  { id: "act-26", timestamp: "2026-06-02", type: "Use in Production", itemName: "Pallets", qty: 44.00, unit: "Unit", ref: "Batch production", before: -32.00, after: -76.00, valueImpact: 2640.00 },
  { id: "act-27", timestamp: "2026-06-03", type: "Use in Production", itemName: "Bitumen", qty: 4115.10, unit: "Litre", ref: "Batch production", before: -2809.94, after: -6925.04, valueImpact: 67076.13 },
  { id: "act-28", timestamp: "2026-06-03", type: "Use in Production", itemName: "Solvents", qty: 1531.20, unit: "Litre", ref: "Batch production", before: 4858.00, after: 3326.80, valueImpact: 28327.20 },
  { id: "act-29", timestamp: "2026-06-03", type: "Use in Production", itemName: "Burner Fuel", qty: 574.20, unit: "Litre", ref: "Batch production", before: 1331.00, after: 756.80, valueImpact: 7332.53 },
  { id: "act-30", timestamp: "2026-06-03", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 3828.00, unit: "Unit", ref: "Batch production", before: -2960.00, after: -6788.00, valueImpact: 23733.60 },
  { id: "act-31", timestamp: "2026-06-03", type: "Use in Production", itemName: "Stone 6.7", qty: 33.50, unit: "Ton", ref: "Batch production", before: 79.28, after: 45.78, valueImpact: 4689.30 },
  { id: "act-32", timestamp: "2026-06-03", type: "Use in Production", itemName: "Sand", qty: 62.21, unit: "Ton", ref: "Batch production", before: 118.67, after: 56.46, valueImpact: 18910.32 },
  { id: "act-33", timestamp: "2026-06-03", type: "Receive", itemName: "Sand", qty: 30.04, unit: "Ton", ref: "Sourced", before: 56.46, after: 86.50, valueImpact: 9132.16 },
  { id: "act-34", timestamp: "2026-06-03", type: "Receive", itemName: "Stone 6.7", qty: 51.82, unit: "Ton", ref: "Sourced", before: 45.78, after: 97.60, valueImpact: 7254.80 },
  { id: "act-35", timestamp: "2026-06-03", type: "Use in Production", itemName: "Pallets", qty: 55.00, unit: "Unit", ref: "Batch production", before: -76.00, after: -131.00, valueImpact: 3300.00 },
  { id: "act-36", timestamp: "2026-06-04", type: "Receive", itemName: "Pallets", qty: 200.00, unit: "Unit", ref: "Restock", before: -131.00, after: 69.00, valueImpact: 12000.00 },
  { id: "act-37", timestamp: "2026-06-04", type: "Use in Production", itemName: "Pallets", qty: 38.00, unit: "Unit", ref: "Batch production", before: 69.00, after: 31.00, valueImpact: 2280.00 },
  { id: "act-38", timestamp: "2026-06-04", type: "Use in Production", itemName: "Bitumen", qty: 2447.78, unit: "Litre", ref: "Batch production", before: -6925.04, after: -9372.82, valueImpact: 39898.73 },
  { id: "act-39", timestamp: "2026-06-04", type: "Use in Production", itemName: "Solvents", qty: 910.80, unit: "Litre", ref: "Batch production", before: 3326.80, after: 2416.00, valueImpact: 16849.80 },
  { id: "act-40", timestamp: "2026-06-04", type: "Use in Production", itemName: "Burner Fuel", qty: 341.55, unit: "Litre", ref: "Batch production", before: 756.80, after: 415.25, valueImpact: 4361.59 },
  { id: "act-41", timestamp: "2026-06-04", type: "Use in Production", itemName: "Stone 6.7", qty: 19.92, unit: "Ton", ref: "Batch production", before: 97.60, after: 77.68, valueImpact: 2789.22 },
  { id: "act-42", timestamp: "2026-06-04", type: "Use in Production", itemName: "Sand", qty: 37.00, unit: "Ton", ref: "Batch production", before: 86.50, after: 49.50, valueImpact: 11248.38 },
  { id: "act-43", timestamp: "2026-06-04", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 2277.00, unit: "Unit", ref: "Batch production", before: -6788.00, after: -9065.00, valueImpact: 14117.40 },
  { id: "act-44", timestamp: "2026-06-05", type: "Use in Production", itemName: "Bitumen", qty: 3881.83, unit: "Litre", ref: "Batch production", before: -9372.82, after: -13254.65, valueImpact: 63273.75 },
  { id: "act-45", timestamp: "2026-06-05", type: "Use in Production", itemName: "Solvents", qty: 1444.40, unit: "Litre", ref: "Batch production", before: 2416.00, after: 971.60, valueImpact: 26721.40 },
  { id: "act-46", timestamp: "2026-06-05", type: "Use in Production", itemName: "Burner Fuel", qty: 541.65, unit: "Litre", ref: "Batch production", before: 415.25, after: -126.40, valueImpact: 6916.87 },
  { id: "act-47", timestamp: "2026-06-05", type: "Use in Production", itemName: "Stone 6.7", qty: 31.60, unit: "Ton", ref: "Batch production", before: 77.68, after: 46.08, valueImpact: 4423.48 },
  { id: "act-48", timestamp: "2026-06-05", type: "Use in Production", itemName: "Sand", qty: 58.68, unit: "Ton", ref: "Batch production", before: 49.50, after: -9.18, valueImpact: 17838.34 },
  { id: "act-49", timestamp: "2026-06-05", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 3611.00, unit: "Unit", ref: "Batch production", before: -9065.00, after: -12676.00, valueImpact: 22388.20 },
  { id: "act-50", timestamp: "2026-06-05", type: "Use in Production", itemName: "Pallets", qty: 60.00, unit: "Unit", ref: "Batch production", before: 31.00, after: -29.00, valueImpact: 3600.00 },
  { id: "act-51", timestamp: "2026-06-06", type: "Use in Production", itemName: "Bitumen", qty: 3168.03, unit: "Litre", ref: "Batch production", before: -13254.65, after: -16422.68, valueImpact: 51638.81 },
  { id: "act-52", timestamp: "2026-06-06", type: "Use in Production", itemName: "Solvents", qty: 1178.80, unit: "Litre", ref: "Batch production", before: 971.60, after: -207.20, valueImpact: 21807.80 },
  { id: "act-53", timestamp: "2026-06-06", type: "Use in Production", itemName: "Burner Fuel", qty: 442.05, unit: "Litre", ref: "Batch production", before: -126.40, after: -568.45, valueImpact: 5644.98 },
  { id: "act-54", timestamp: "2026-06-06", type: "Use in Production", itemName: "Stone 6.7", qty: 25.79, unit: "Ton", ref: "Batch production", before: 46.08, after: 20.29, valueImpact: 3610.08 },
  { id: "act-55", timestamp: "2026-06-06", type: "Use in Production", itemName: "Sand", qty: 47.89, unit: "Ton", ref: "Batch production", before: -9.18, after: -57.07, valueImpact: 14558.18 },
  { id: "act-56", timestamp: "2026-06-06", type: "Use in Production", itemName: "Plastic Bags (printed)", qty: 2947.00, unit: "Unit", ref: "A-SHAK producing 1550 bags", before: -12676.00, after: -15623.00, valueImpact: 18271.40 },
  { id: "act-57", timestamp: "2026-06-06", type: "Use in Production", itemName: "Pallets", qty: 49.00, unit: "Unit", ref: "Batch production", before: -29.00, after: -78.00, valueImpact: 2940.00 },
  { id: "act-58", timestamp: "2026-06-08", type: "Adjust (+/-)", itemName: "Sand", qty: 80.00, unit: "Ton", ref: "Inventory Correction", before: -57.07, after: 22.93, valueImpact: 24320.00 },
  { id: "act-59", timestamp: "2026-06-08", type: "Despatch", itemName: "SS60 Drums", qty: 160.00, unit: "Litre", ref: "Client Delivery", before: -20.00, after: -180.00, valueImpact: 7200.00 },
  { id: "act-60", timestamp: "2026-06-08", type: "Adjust (+/-)", itemName: "Solvents", qty: 489.60, unit: "Litre", ref: "Inventory Correction", before: -207.20, after: 282.40, valueImpact: 9057.60 },
  { id: "act-61", timestamp: "2026-06-08", type: "Adjust (+/-)", itemName: "Burner Fuel", qty: 384.50, unit: "Litre", ref: "Inventory Correction", before: -568.45, after: -183.95, valueImpact: 4910.07 },
  { id: "act-62", timestamp: "2026-06-08", type: "Adjust (+/-)", itemName: "Bitumen", qty: 2479.23, unit: "Litre", ref: "Inventory Correction", before: -16422.68, after: -13943.45, valueImpact: 40411.45 },
  { id: "act-63", timestamp: "2026-06-08", type: "Adjust (+/-)", itemName: "Plastic Bags (printed)", qty: 362.00, unit: "Unit", ref: "Inventory Correction", before: -15623.00, after: -15261.00, valueImpact: 2244.40 },
  { id: "act-64", timestamp: "2026-06-08", type: "Use in Production", itemName: "Plastic Bags (unprinted)", qty: 362.00, unit: "Unit", ref: "Batch production", before: 1888.00, after: 1526.00, valueImpact: 1991.00 },
  { id: "act-65", timestamp: "2026-06-09", type: "Despatch", itemName: "SS60 Drums", qty: 20.00, unit: "Litre", ref: "Client Delivery", before: -180.00, after: -200.00, valueImpact: 900.00 },
  { id: "act-66", timestamp: "2026-06-19", type: "Receive", itemName: "Solvents", qty: 6500.00, unit: "Litre", ref: "Restock Delivery", before: 282.40, after: 6782.40, valueImpact: 120250.00 },
  { id: "act-67", timestamp: "2026-06-19", type: "Receive", itemName: "Burner Fuel", qty: 2000.00, unit: "Litre", ref: "Restock Delivery", before: -183.95, after: 1816.05, valueImpact: 25540.00 },
  { id: "act-68", timestamp: "2026-06-22", type: "Receive", itemName: "Stone 6.7", qty: 82.64, unit: "Ton", ref: "Restock Delivery", before: 20.29, after: 102.93, valueImpact: 11569.60 },
  { id: "act-69", timestamp: "2026-06-22", type: "Receive", itemName: "Sand", qty: 141.58, unit: "Ton", ref: "Restock Delivery", before: 22.93, after: 164.51, valueImpact: 43040.32 },
  { id: "act-70", timestamp: "2026-06-23", type: "Receive", itemName: "Sand", qty: 58.40, unit: "Ton", ref: "Restock Delivery", before: 164.51, after: 222.91, valueImpact: 17753.60 },
  { id: "act-71", timestamp: "2026-06-23", type: "Receive", itemName: "Stone 6.7", qty: 56.44, unit: "Ton", ref: "Restock Delivery", before: 102.93, after: 159.37, valueImpact: 7901.60 },
  { id: "act-72", timestamp: "2026-06-24", type: "Receive", itemName: "Stone 6.7", qty: 22.22, unit: "Ton", ref: "Restock Delivery", before: 159.37, after: 181.59, valueImpact: 3110.80 },
  { id: "act-73", timestamp: "2026-06-25", type: "Receive", itemName: "Sand", qty: 36.88, unit: "Ton", ref: "Restock Delivery", before: 222.91, after: 259.79, valueImpact: 11211.52 }
];
