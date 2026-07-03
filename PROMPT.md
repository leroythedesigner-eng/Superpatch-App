# Prompt: SuperPatch Asphalt Logistics & Manufacturing ERP Suite

Build a comprehensive, high-fidelity, and cohesive full-stack enterprise resource planning (ERP) and delivery logistics suite for an asphalt manufacturing company called **SuperPatch**. The suite consists of two major sub-systems integrated into a single responsive application: an **Office Admin & Dispatch Portal** and a **Driver Delivery Portal**.

---

## 1. Visual & Aesthetic Guidelines

*   **Theme & Palette**: Dark modern aesthetic featuring a deep neutral backdrop (Slate/Zinc `bg-zinc-950`), absolute black borders (`border-zinc-900`), translucent panels with backdrop blurring, and high-visibility industrial orange accents (`bg-orange-500`, `text-orange-400`).
*   **Typography**: Clean, high-legibility sans-serif sans UI (such as **Inter** or **Outfit**) for layouts, matched with precise monospace (such as **JetBrains Mono**) for numerical statistics, status states, and database logs.
*   **Interactions**: Fluid micro-animations for transitions, dynamic status color updates (e.g., emerald for complete, amber/yellow for active, rose for warnings/deletions), and realistic feedback on drag-and-drop or status toggles.
*   **Layout Integrity**: Elegant spacing, generous negative space, structured bento-grid layouts on desktop, and standard full-bleed responsive viewports on mobile devices.

---

## 2. Core Architecture & Shared Database State

All application state is synchronized across views using client-side reactivity and persistent local storage cache buckets (`localStorage` / `sessionStorage`), ensuring session retention on page refresh.

### 2.1 Shared Data Schemas (`types.ts`)

*   **OfficeUser**: `email`, `pass`, `name`, `role` (Admin, Plant Manager, etc.).
*   **Driver**: `name`, `plate`, `truck` (e.g. "Toyota Hilux", "7-Ton Tri-axle"), `phone`.
*   **Item (Inventory)**: `n` (name), `u` (unit), `cost`, `onHand`, `reorder`.
*   **Stop (Delivery/Dispatch)**: `nm` (client name), `addr` (delivery address), `bags`, `type` (e.g. "Quote", "Direct Delivery"), `eta`, `gps`, `st` (status: `'todo' | 'route' | 'site' | 'done'`), `comments`, `distanceKm`, `loads`, `clientContact`, `pricePerBag`, `assignedDriverPlate`, `assignedDriverName`.
*   **Quote**: `id`, `clientName`, `contactNumber`, `deliveryAddress`, `bags`, `pricePerBag`, `distanceKm`, `deliveryCostPerKm`, `subtotalBags`, `subtotalDelivery`, `vat`, `total`, `status` (`'pending' | 'approved' | 'rejected'`), `date`, `comments`.
*   **DailyProduction**: `date`, `startTime`, `target`, `produced`, `opening`, `dispatched`, `balance`, `tons`, `comments`, `hours`.
*   **ActivityLog**: `id`, `timestamp`, `type`, `itemName`, `qty`, `unit`, `ref`, `before`, `after`, `valueImpact`.

---

## 3. Login & Portal Router (`App.tsx`)

A secure entrance interface supporting two login methodologies:
1.  **Staff Sign-In**: Traditional secure form field requiring email and password inputs.
2.  **Driver Portal**: Fast authentication requiring phone number matching or immediate selection of available active driver profiles.
3.  **Active Sessions**: Retains login states in `sessionStorage` and routes drivers directly into the mobile delivery interface and staff into the bento office application.

---

## 4. Office Admin & Dispatch Portal (`OfficeApp.tsx`)

A multi-tab workspace featuring an administrative command dashboard:

### 4.1 Dashboard Hub
*   **Analytical Cards**: Floating status metrics displaying Closing Bag Stock, Current Dispatched Count, Total Live Deliveries, Approved Income Value, and Raw Material Reorder Alerts.
*   **Production Charts**: Visual metrics summarizing expected manufacturing targets vs. actual daily yields.

### 4.2 Interactive Quotation System & Estimator
*   **Pricing Calculator**: Takes inputs for client name, bag quantities, distance (km), price per bag, and delivery rates per km.
*   **Automated VAT & Ledger Math**: Computes product cost, delivery surcharges, 15% VAT, and final totals.
*   **WhatsApp Export String**: Formats estimates into a clean, copyable text block with bold bullet points for fast client dispatch via mobile chat.
*   **Quote Status Actions**: Allows plant managers to approve or reject quotes directly, auto-generating active order dispatches upon approval.

### 4.3 Material & Inventory Ledger
*   **Live Stock Management**: Listing of active components (Fine Aggregate, Bituminous Binder, Reclaiming Agent, Empty Valve Bags).
*   **Manual Adjustments**: Log material additions or consumption with immediate stock update and automatic ledger logs.
*   **Chronological Inventory Log**: Historical audit trail illustrating starting balances, ending balances, adjustment values, and the calculated financial impact.

### 4.4 Delivery & Dispatch Board
*   **Stop Management**: View all pending, ongoing, and completed orders.
*   **Truck Capacity Optimizer**: Displays visual cargo limit thresholds when matching orders to specific trucks (e.g., matching a 40-bag order to a 1-ton pickup, or a 280-bag order to a heavy tri-axle).
*   **Driver Assigner**: Quick assignment tools to allocate specific routes and loads to active drivers.

### 4.5 Daily Production Tracker
*   **Shift Logs**: Record starting shifts, targeted run metrics, actual bag output, total run hours, and shift-specific notes or comments.
*   **Automatic Calculation**: Autopopulates raw aggregate utilization levels based on actual shift counts.

### 4.6 Reporting Center
*   **Consolidated Logs**: Scrollable tables capturing date-by-date parameters: overall bags manufactured, tons completed, total delivery kilometers logged, loads, and comments.

---

## 5. Mobile Driver Delivery Portal (`DriverApp.tsx`)

A highly tactical, touch-optimized mobile layout focused on situational awareness and offline operation:

### 5.1 Connectivity Simulator
*   **Online/Offline Toggle**: A top-bar switch allowing the driver to simulate physical network disconnects.
*   **Offline Queue System**: Stores completed signatures and delivery logs locally in an offline array. Automatically flushes records to the main database store when cellular service is re-established.

### 5.2 Chronological Route Steps
*   **Sequential Stops**: A clean vertical route map representing stops assigned to the logged-in driver's plate number.
*   **Step-by-Step Stepper Controls**: Let drivers cycle each stop through chronological delivery phases:
    1.  **Start Route**: Updates the status to "Routing" and highlights destination paths.
    2.  **Arrive On Site**: Sets status to "On Site" and opens driver comment boxes.
    3.  **Complete Delivery**: Triggers the interactive POD (Proof of Delivery) sheet.

### 5.3 Digital Proof of Delivery (POD) Canvas
*   **Signature Pad**: An interactive, smooth HTML5 canvas supporting signature inputs via touch or mouse.
*   **Simulated Photo Proof**: A button to capture visual proof of delivery using simulated local media files.
*   **Comments & Sync**: Captures final receiving remarks and logs completions with timestamps, immediately updating office administrators.

---

## 6. Code Style & Compilation Requirements

*   Compile using **React 18+** with **Vite** as the bundler.
*   Use **Tailwind CSS** utility classes directly in standard React files.
*   Manage icons entirely via **Lucide React**.
*   Incorporate seamless, spring-based component enter/exit animations via **Motion** (`motion/react`).
