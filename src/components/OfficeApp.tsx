import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, TrendingUp, Plus, Users, LogOut, Bell, Truck, 
  FileText, Activity, Clock, Shield, AlertTriangle, ArrowLeft, Trash2, CheckCircle,
  Edit3
} from 'lucide-react';
import { OfficeUser, Item, Driver, Production, Stop, Quote, DailyProduction, ReportDay, ActivityLog } from '../types';

interface OfficeAppProps {
  user: OfficeUser;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  production: Production;
  setProduction: React.Dispatch<React.SetStateAction<Production>>;
  officeUsers: OfficeUser[];
  setOfficeUsers: React.Dispatch<React.SetStateAction<OfficeUser[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  stops: Stop[];
  setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  dailyProductions: DailyProduction[];
  setDailyProductions: React.Dispatch<React.SetStateAction<DailyProduction[]>>;
  reportsData: ReportDay[];
  setReportsData: React.Dispatch<React.SetStateAction<ReportDay[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  addToast: (message: string, isError?: boolean) => void;
}

export default function OfficeApp({
  user,
  items,
  setItems,
  production,
  setProduction,
  officeUsers,
  setOfficeUsers,
  drivers,
  setDrivers,
  stops,
  setStops,
  quotes,
  setQuotes,
  dailyProductions,
  setDailyProductions,
  reportsData,
  setReportsData,
  activityLogs,
  setActivityLogs,
  activeTab,
  setActiveTab,
  onLogout,
  addToast
}: OfficeAppProps) {
  // Local state for forms
  const [logAct, setLogAct] = useState<string>('Receive');
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [logQty, setLogQty] = useState<string>('');
  const [logRef, setLogRef] = useState<string>('');
  
  // Create user form state
  const [newUserRole, setNewUserRole] = useState<string>('Plant Manager');
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPass, setNewUserPass] = useState<string>('');
  const [newUserPlate, setNewUserPlate] = useState<string>('');
  const [newUserTruck, setNewUserTruck] = useState<string>('34t Horse & Trailer');
  const [newUserPhone, setNewUserPhone] = useState<string>('');

  // Editing User / Driver states
  const [editingOfficeUserEmail, setEditingOfficeUserEmail] = useState<string | null>(null);
  const [editingDriverPlate, setEditingDriverPlate] = useState<string | null>(null);

  // --- New Feature Local States ---
  // Sub tab for Orders: 'quotes' | 'confirmed' | 'loaded' | 'delivered' | 'new-quote'
  const [ordersSubTab, setOrdersSubTab] = useState<'quotes' | 'confirmed' | 'loaded' | 'delivered' | 'new-quote'>('quotes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [logHistorySearch, setLogHistorySearch] = useState<string>('');
  const [logHistoryTypeFilter, setLogHistoryTypeFilter] = useState<string>('all');
  
  // Quoting form fields
  const [qClientName, setQClientName] = useState('');
  const [qContactNumber, setQContactNumber] = useState('');
  const [qAddress, setQAddress] = useState('');
  const [qBags, setQBags] = useState('100');
  const [qPricePerBag, setQPricePerBag] = useState('75');
  const [qDistance, setQDistance] = useState('15');
  const [qCostPerKm, setQCostPerKm] = useState('15');

  // Comments & selections
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [newQuoteCommentText, setNewQuoteCommentText] = useState('');
  const [selectedStopIdx, setSelectedStopIdx] = useState<number | null>(null);
  const [newStopCommentText, setNewStopCommentText] = useState('');
  
  // Daily production configurations
  const [pStartTime, setPStartTime] = useState('06:00');
  const [pTarget, setPTarget] = useState(production.target || 500);
  const [newDailyCommentText, setNewDailyCommentText] = useState('');
  const [customProdBags, setCustomProdBags] = useState('');

  // Inventory editing local state variables
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editCost, setEditCost] = useState<number>(0);
  const [editReorder, setEditReorder] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');
  const [editStepAmount, setEditStepAmount] = useState<number>(100);

  React.useEffect(() => {
    if (production.target) {
      setPTarget(production.target);
    }
  }, [production.target]);

  // Calendar selection
  const [selectedReportDate, setSelectedReportDate] = useState('2026-06-24');

  // Helper functions for item status
  const getItemStatus = (it: Item): { label: 'OUT' | 'REORDER' | 'LOW' | 'OK'; colorClass: string; bgClass: string } => {
    if (it.onHand <= 0) return { label: 'OUT', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/10 border-rose-500/20' };
    if (it.onHand <= it.reorder) return { label: 'REORDER', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10 border-amber-500/20' };
    if (it.onHand <= it.reorder * 1.25) return { label: 'LOW', colorClass: 'text-yellow-400', bgClass: 'bg-yellow-400/10 border-yellow-400/20' };
    return { label: 'OK', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const getStockValue = () => items.reduce((sum, item) => sum + item.onHand * item.cost, 0);
  
  const getReorderCount = () => items.filter(it => {
    const status = getItemStatus(it).label;
    return status === 'OUT' || status === 'REORDER';
  }).length;

  const handleSaveLog = () => {
    const q = parseFloat(logQty);
    if (!q || isNaN(q) || q <= 0) {
      addToast("Please enter a valid positive quantity", true);
      return;
    }

    const updatedItems = [...items];
    const it = updatedItems[selectedItemIdx];
    const direction = (logAct === 'Receive') ? 1 : (logAct === 'Adjust' ? 1 : -1);
    const original = it.onHand;
    const nextVal = Math.round((original + direction * q) * 100) / 100;

    it.onHand = nextVal;
    setItems(updatedItems);

    const actType = logAct === 'Adjust' ? 'Adjust (+/-)' : logAct;

    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      timestamp: new Date().toISOString().split('T')[0],
      type: actType,
      itemName: it.n,
      qty: q,
      unit: it.u,
      ref: logRef || "Logged manually",
      before: original,
      after: nextVal,
      valueImpact: Math.round(q * it.cost * 100) / 100
    };

    setActivityLogs(prev => [newLog, ...prev]);

    addToast(`Successfully logged ${logAct} for ${it.n}. Stock is now ${nextVal} ${it.u}.`);
    setLogQty('');
    setLogRef('');
  };

  const handleSaveInventoryEdit = () => {
    if (editingItemIdx === null) return;
    
    const it = items[editingItemIdx];
    if (!it) return;

    if (editQty < 0) {
      addToast("Quantity cannot be negative", true);
      return;
    }
    if (editCost < 0) {
      addToast("Unit price cannot be negative", true);
      return;
    }
    if (editReorder < 0) {
      addToast("Minimum stock level cannot be negative", true);
      return;
    }

    const oldQty = it.onHand;
    const oldCost = it.cost;
    const oldReorder = it.reorder;

    const nextQty = Math.round(editQty * 100) / 100;
    const nextCost = Math.round(editCost * 100) / 100;
    const nextReorder = Math.round(editReorder * 100) / 100;

    // If nothing changed, just close
    if (nextQty === oldQty && nextCost === oldCost && nextReorder === oldReorder) {
      setEditingItemIdx(null);
      return;
    }

    const updatedItems = [...items];
    updatedItems[editingItemIdx] = {
      ...it,
      onHand: nextQty,
      cost: nextCost,
      reorder: nextReorder
    };

    setItems(updatedItems);

    // Create Activity Log
    const qtyDiff = Math.abs(nextQty - oldQty);
    const valueImpact = Math.round(qtyDiff * nextCost * 100) / 100;
    const reference = editComment.trim() || `Adjusted by ${user.name} (${user.role})`;

    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      timestamp: new Date().toISOString().split('T')[0],
      type: 'Inventory Edit',
      itemName: it.n,
      qty: Math.round(qtyDiff * 100) / 100,
      unit: it.u,
      ref: reference,
      before: oldQty,
      after: nextQty,
      valueImpact: valueImpact
    };

    setActivityLogs(prev => [newLog, ...prev]);

    addToast(`Successfully updated ${it.n}. Stock is now ${nextQty} ${it.u}.`);
    setEditingItemIdx(null);
    setEditComment('');
  };

  const handleAddBatch = () => {
    setProduction(prev => ({
      ...prev,
      balance: prev.balance + 25,
      tons: Math.round((prev.tons + (25 * 0.025)) * 1000) / 1000
    }));
    addToast("+25 bags added to inventory (Batch batch scanned)");
  };

  const handleCreateUser = () => {
    const name = newUserName.trim();
    if (!name) {
      addToast("Full name is required", true);
      return;
    }

    if (newUserRole === 'Driver') {
      const plate = newUserPlate.trim();
      const phone = newUserPhone.trim();
      if (!plate) {
        addToast("Vehicle number plate is required", true);
        return;
      }
      if (!phone) {
        addToast("Mobile phone number is required for Driver sign-in", true);
        return;
      }
      if (editingDriverPlate !== null) {
        if (drivers.some(d => d.phone === phone && d.plate !== editingDriverPlate)) {
          addToast("A driver with this mobile number already exists", true);
          return;
        }
        setDrivers(prev => prev.map(d => d.plate === editingDriverPlate ? { ...d, name, plate, truck: newUserTruck, phone } : d));
        addToast(`Driver profile for ${name} updated successfully`);
        setEditingDriverPlate(null);
      } else {
        if (drivers.some(d => d.phone === phone)) {
          addToast("A driver with this mobile number already exists", true);
          return;
        }
        if (drivers.some(d => d.plate === plate)) {
          addToast("A driver with this plate already exists", true);
          return;
        }
        setDrivers(prev => [...prev, { name, plate, truck: newUserTruck, phone }]);
        addToast(`Driver ${name} created successfully`);
      }
      setNewUserPlate('');
      setNewUserPhone('');
    } else {
      const email = newUserEmail.trim().toLowerCase();
      const pass = newUserPass.trim();
      if (!email || !pass) {
        addToast("Email and password are required", true);
        return;
      }
      if (editingOfficeUserEmail !== null) {
        if (officeUsers.some(u => u.email === email && u.email !== editingOfficeUserEmail)) {
          addToast("This email address is already in use by another user", true);
          return;
        }
        setOfficeUsers(prev => prev.map(u => u.email === editingOfficeUserEmail ? { ...u, name, role: newUserRole, email, pass } : u));
        addToast(`Staff member ${name} updated successfully`);
        setEditingOfficeUserEmail(null);
      } else {
        if (officeUsers.some(u => u.email === email)) {
          addToast("This email address is already in use", true);
          return;
        }
        setOfficeUsers(prev => [...prev, { email, pass, name, role: newUserRole }]);
        addToast(`Staff member ${name} created as ${newUserRole}`);
      }
      setNewUserEmail('');
      setNewUserPass('');
    }

    setNewUserName('');
  };

  const handleCancelEdit = () => {
    setEditingOfficeUserEmail(null);
    setEditingDriverPlate(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPass('');
    setNewUserPlate('');
    setNewUserPhone('');
    setNewUserRole('Plant Manager');
    setNewUserTruck('34t Horse & Trailer');
    addToast("Edit mode cancelled");
  };

  const handleEditOfficeUser = (u: OfficeUser) => {
    setEditingOfficeUserEmail(u.email);
    setEditingDriverPlate(null);
    setNewUserName(u.name);
    setNewUserRole(u.role);
    setNewUserEmail(u.email);
    setNewUserPass(u.pass);
    addToast(`Editing staff member: ${u.name}`);
  };

  const handleEditDriver = (d: Driver) => {
    setEditingDriverPlate(d.plate);
    setEditingOfficeUserEmail(null);
    setNewUserName(d.name);
    setNewUserRole('Driver');
    setNewUserPlate(d.plate);
    setNewUserPhone(d.phone || '');
    setNewUserTruck(d.truck);
    addToast(`Editing driver profile: ${d.name}`);
  };

  const handleRemoveOfficeUser = (email: string) => {
    if (confirm(`Are you sure you want to remove this office staff member?`)) {
      setOfficeUsers(prev => prev.filter(u => u.email !== email));
      addToast("Staff member removed");
    }
  };

  const handleRemoveDriver = (plate: string) => {
    if (confirm(`Are you sure you want to remove this driver profile?`)) {
      setDrivers(prev => prev.filter(d => d.plate !== plate));
      addToast("Driver profile removed");
    }
  };

  // --- New Feature Handler Functions ---
  
  // Create a new client quote
  const handleCreateQuote = () => {
    const client = qClientName.trim();
    const contact = qContactNumber.trim();
    const address = qAddress.trim();
    const bagsCount = parseInt(qBags) || 0;
    const price = parseFloat(qPricePerBag) || 0;
    const dist = parseFloat(qDistance) || 0;
    const costPerKm = parseFloat(qCostPerKm) || 0;

    if (!client || !contact || !address || bagsCount <= 0 || price <= 0) {
      addToast("Please fill in client details, address, bags, and price", true);
      return;
    }

    const subBags = bagsCount * price;
    const subDeliv = dist * costPerKm;
    const vatValue = (subBags + subDeliv) * 0.15;
    const totalVal = subBags + subDeliv + vatValue;

    const newQuote: Quote = {
      id: `SPQ-${200 + quotes.length + 7}`,
      clientName: client,
      contactNumber: contact,
      deliveryAddress: address,
      bags: bagsCount,
      pricePerBag: price,
      distanceKm: dist,
      deliveryCostPerKm: costPerKm,
      subtotalBags: Math.round(subBags * 100) / 100,
      subtotalDelivery: Math.round(subDeliv * 100) / 100,
      vat: Math.round(vatValue * 100) / 100,
      total: Math.round(totalVal * 100) / 100,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      comments: ["Quote generated by sales desk."]
    };

    setQuotes(prev => [newQuote, ...prev]);
    addToast(`Quote ${newQuote.id} created for ${client}`);
    
    // Clear fields
    setQClientName('');
    setQContactNumber('');
    setQAddress('');
    setQBags('100');
    setQDistance('15');
    setOrdersSubTab('quotes');
  };

  // Approve Quote and create Active Order/Stop
  const handleApproveQuote = (id: string) => {
    const quote = quotes.find(q => q.id === id);
    if (!quote) return;

    // Update Quote status
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'approved' as const } : q));

    // Create a Stop for Drivers
    const newStop: Stop = {
      nm: quote.clientName,
      addr: quote.deliveryAddress,
      bags: quote.bags,
      type: "Private contractor",
      eta: "TBD",
      gps: "-26.1011, 27.7708", // Mock coordinate
      st: 'todo',
      comments: [`Quote ${quote.id} approved. Contact: ${quote.contactNumber}`],
      distanceKm: quote.distanceKm,
      loads: Math.ceil(quote.bags / 100), // e.g. 1 load per 100 bags
      clientContact: quote.contactNumber,
      pricePerBag: quote.pricePerBag
    };

    setStops(prev => [...prev, newStop]);
    addToast(`Quote ${quote.id} approved! Delivery stop created.`);
    setSelectedQuoteId(null);
  };

  // Delete Quote
  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    addToast(`Quote ${id} deleted successfully`);
    if (selectedQuoteId === id) {
      setSelectedQuoteId(null);
    }
  };

  // Delete Stop (order package)
  const handleDeleteStop = (idx: number) => {
    const stop = stops[idx];
    setStops(prev => prev.filter((_, i) => i !== idx));
    addToast(`Order package for ${stop?.nm || 'Client'} deleted`);
    if (selectedStopIdx === idx) {
      setSelectedStopIdx(null);
    }
  };

  // Assign Driver/Vehicle to Stop
  const handleAssignDriver = (stopIndex: number, driverPlate: string) => {
    const driver = drivers.find(d => d.plate === driverPlate);
    setStops(prev => prev.map((s, idx) => {
      if (idx === stopIndex) {
        return {
          ...s,
          assignedDriverPlate: driverPlate || undefined,
          assignedDriverName: driver ? driver.name : undefined,
          comments: [...(s.comments || []), driver ? `Assigned driver ${driver.name} with vehicle ${driver.plate} (${driver.truck}).` : "Driver assignment cleared."]
        };
      }
      return s;
    }));
    if (driver) {
      addToast(`Assigned ${driver.name} (${driver.plate}) to this package`);
    } else {
      addToast(`Cleared vehicle assignment`);
    }
  };

  // Add Comment to Quote
  const handleAddQuoteComment = (id: string) => {
    const comment = newQuoteCommentText.trim();
    if (!comment) return;

    setQuotes(prev => prev.map(q => q.id === id ? { ...q, comments: [...(q.comments || []), comment] } : q));
    setNewQuoteCommentText('');
    addToast("Plant manager quote comment added");
  };

  // Add Comment to Order/Stop
  const handleAddStopComment = (stopIndex: number) => {
    const comment = newStopCommentText.trim();
    if (!comment) return;

    setStops(prev => prev.map((s, idx) => {
      if (idx === stopIndex) {
        return {
          ...s,
          comments: [...(s.comments || []), comment]
        };
      }
      return s;
    }));
    setNewStopCommentText('');
    addToast("Order dispatch comment added");
  };

  // Add Comment to Active Daily Manufacturing Shift
  const [currentDailyComments, setCurrentDailyComments] = useState<string[]>([
    "Mixer aggregates heating cycle normal.",
    "Bags loading check cleared at 08:00."
  ]);

  const handleAddDailyComment = () => {
    const comment = newDailyCommentText.trim();
    if (!comment) return;

    setCurrentDailyComments(prev => [...prev, comment]);
    setNewDailyCommentText('');
    addToast("Daily manufacturing comment added");
  };

  // Log active production shift into history list and snapshot in reports calendar
  const handleSaveDailyShiftLog = () => {
    const totalBagsProduced = production.balance - production.opening;
    const runHours = production.hours;

    if (totalBagsProduced <= 0) {
      if (!confirm("Bags produced today is logged as 0. Do you still want to log this shift?")) {
        return;
      }
    }

    const currentShiftLog: DailyProduction = {
      date: new Date().toISOString().split('T')[0],
      startTime: pStartTime,
      target: pTarget,
      produced: totalBagsProduced < 0 ? 0 : totalBagsProduced,
      opening: production.opening,
      dispatched: production.dispatched,
      balance: production.balance,
      tons: production.tons,
      comments: [...currentDailyComments],
      hours: runHours
    };

    // Save to dailyProductions list
    setDailyProductions(prev => [currentShiftLog, ...prev]);

    // Create a calendar report entry for today
    const todayStr = new Date().toISOString().split('T')[0];
    const newReportDay: ReportDay = {
      date: todayStr,
      closingStock: production.balance,
      produced: totalBagsProduced < 0 ? 0 : totalBagsProduced,
      delivered: production.dispatched,
      ordersCompleted: stops.filter(s => s.st === 'done').length,
      deliveryDistance: stops.reduce((sum, s) => sum + (s.st === 'done' ? (s.distanceKm || 15) : 0), 0),
      loads: stops.reduce((sum, s) => sum + (s.st === 'done' ? (s.loads || 1) : 0), 0),
      manufacturingComments: [...currentDailyComments],
      orderComments: stops.filter(s => s.st === 'done').map(s => `${s.nm}: Delivered successfully.`)
    };

    // Update reportsData list
    setReportsData(prev => {
      const filtered = prev.filter(r => r.date !== todayStr);
      return [newReportDay, ...filtered];
    });

    // Reset daily count opening to balance so starting fresh tomorrow
    setProduction(prev => ({
      ...prev,
      opening: prev.balance,
      hours: 6 // Reset to standard starting shift hours
    }));

    setCurrentDailyComments(["New morning shift pre-start checks green."]);
    addToast("Completed shift recorded & reports calendar updated!");
  };

  // Add bags to today's production count
  const handleAddCustomProduction = (amount: number) => {
    setProduction(prev => ({
      ...prev,
      balance: prev.balance + amount,
      tons: Math.round((prev.tons + (amount * 0.025)) * 1000) / 1000
    }));
    addToast(`+${amount} bags added to daily count`);
  };

  // Modern donut styled breakdown using high-contrast color nodes
  const renderDonut = () => {
    const segments = items
      .map(i => ({ n: i.n, v: i.onHand * i.cost }))
      .filter(s => s.v > 0)
      .sort((a, b) => b.v - a.v);

    const top = segments.slice(0, 4);
    const otherVal = segments.slice(4).reduce((sum, current) => sum + current.v, 0);
    if (otherVal > 0) {
      top.push({ n: "Other Stock", v: otherVal });
    }

    const colors = ["#FF6B00", "#FFB347", "#00BFA5", "#00B0FF", "#444444"];
    const total = top.reduce((sum, item) => sum + item.v, 0);
    
    let currentAngle = 0;
    const conicGradientSegments = top.map((s, index) => {
      const fraction = (s.v / (total || 1)) * 100;
      const gradient = `${colors[index]} ${currentAngle}% ${currentAngle + fraction}%`;
      currentAngle += fraction;
      return gradient;
    }).join(", ");

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div 
          className="relative w-36 h-36 rounded-full flex-none flex items-center justify-center shadow-lg"
          style={{ background: conicGradientSegments ? `conic-gradient(${conicGradientSegments})` : '#222' }}
        >
          <div className="absolute inset-7 bg-zinc-900 rounded-full flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">VALUE</span>
            <span className="text-sm font-bold font-mono text-white mt-1">
              R {Math.round(getStockValue()).toLocaleString("en-ZA")}
            </span>
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          {top.map((s, idx) => (
            <div key={s.n} className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm flex-none" style={{ backgroundColor: colors[idx] }}></span>
                <span className="font-medium text-zinc-200">{s.n}</span>
              </div>
              <span className="font-mono text-zinc-400">
                R {Math.round(s.v).toLocaleString("en-ZA")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/40 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold relative overflow-hidden flex-none">
            <span className="text-sm">S</span>
            <div className="absolute inset-1.5 border border-dashed border-white/20 rounded"></div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white">SUPERPATCH</h1>
            <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest block">
              {user.name} · {user.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'Owner / Admin' && (
            <button 
              onClick={() => setActiveTab('users')} 
              className={`p-2 rounded-full border border-zinc-800 bg-zinc-900 hover:text-white transition flex items-center justify-center ${activeTab === 'users' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-zinc-400'}`}
              title="Team Management"
            >
              <Users size={16} />
            </button>
          )}

          <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 flex items-center justify-center relative">
            <Bell size={16} className={getReorderCount() > 0 ? "animate-pulse text-rose-400" : ""} />
            {getReorderCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {getReorderCount()}
              </span>
            )}
          </div>

          <button 
            onClick={onLogout}
            className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/5 transition flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase px-1">Plant Command Center</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">Asphalt Produced</span>
                    <button 
                      onClick={() => {
                        const newTargetStr = prompt("Enter new Daily Target (Tons):", production.target.toString());
                        if (newTargetStr !== null) {
                          const newTarget = parseFloat(newTargetStr) || 0;
                          if (newTarget > 0) {
                            setPTarget(newTarget);
                            setProduction(prev => ({ ...prev, target: newTarget }));
                            addToast(`Daily target updated to ${newTarget} Tons`);
                          } else {
                            addToast("Please enter a valid target greater than 0", true);
                          }
                        }
                      }}
                      className="text-[10px] text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 cursor-pointer"
                      title="Adjust target"
                    >
                      <Edit3 size={10} />
                      <span>Adjust</span>
                    </button>
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                    {Math.round(((production.balance - production.opening < 0 ? 0 : production.balance - production.opening) / 40) * 100) / 100}
                    <span className="text-xs text-zinc-500 font-normal"> / {production.target} Tons</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-zinc-950 h-2 rounded-full border border-zinc-800 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                      style={{ width: `${Math.min(100, Math.max(5, ((((production.balance - production.opening < 0 ? 0 : production.balance - production.opening) / 40) / (production.target || 1)) * 100)))}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {production.hours}h run · {production.balance - production.opening < 0 ? 0 : production.balance - production.opening} bags
                    </span>
                    {((production.balance - production.opening < 0 ? 0 : production.balance - production.opening) / 40) > production.target && (
                      <span className="text-[9px] font-bold text-emerald-400 animate-pulse">
                        ✨ Bonus: +{Math.round((((production.balance - production.opening) / 40) - production.target) * 100) / 100} t
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">Stock Value</span>
                  <div className="text-2xl font-extrabold text-orange-500 mt-1 font-mono">
                    R {Math.round(getStockValue()).toLocaleString("en-ZA")}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium block mt-3">
                  {items.length} raw materials & items
                </span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">Active Fleet</span>
                  <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                    {drivers.length > 0 ? drivers.length - 1 : 0} <span className="text-xs text-zinc-500 font-normal">/ {drivers.length}</span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium block mt-3">
                  Average on-time: 92%
                </span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">Low Stock Alerts</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-1 font-mono">
                    {getReorderCount()}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium block mt-3">
                  Awaiting dispatch log
                </span>
              </div>
            </div>

            {/* Active alerts section */}
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2 px-1">Active Alerts</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 divide-y divide-zinc-800">
                {items.filter(it => getItemStatus(it).label !== 'OK').length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="mx-auto text-emerald-500 mb-2" size={24} />
                    <span className="text-xs text-zinc-400">All materials safely above critical levels</span>
                  </div>
                ) : (
                  items
                    .filter(it => getItemStatus(it).label !== 'OK')
                    .map(it => {
                      const status = getItemStatus(it);
                      return (
                        <div key={it.n} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                          <div>
                            <div className="text-xs font-bold text-white">{it.n}</div>
                            <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                              {it.onHand.toLocaleString("en-ZA")} {it.u} · Minimum {it.reorder} {it.u}
                            </div>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${status.colorClass} ${status.bgClass}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Weekly calendar overview */}
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2 px-1 font-mono">Weekly Maintenance Grid</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
                  PRODUCTION RUN STATUS
                </span>
                <div className="flex gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`w-full h-5 rounded-md ${idx === 4 ? 'bg-rose-500/90 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : idx < 5 ? 'bg-orange-500/90 shadow-[0_0_8px_rgba(249,115,22,0.3)]' : 'bg-zinc-800'}`}></div>
                      <span className="text-[10px] font-mono text-zinc-400 font-bold">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-zinc-800 flex gap-2 items-start text-xs text-zinc-400">
                  <AlertTriangle size={14} className="text-rose-400 mt-0.5 flex-none" />
                  <p className="leading-relaxed">
                    <strong className="text-zinc-200">Friday Maintenance:</strong> Mixer service scheduled. Full production window is restricted.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inv' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase px-1">Inventory & Breakdown</h2>
            
            {renderDonut()}
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
              {items.map((it, idx) => {
                const status = getItemStatus(it);
                const canEdit = user && (user.role === 'Plant Manager' || user.role === 'Owner / Admin');
                return (
                  <div 
                    key={it.n} 
                    onClick={() => {
                      if (canEdit) {
                        setEditingItemIdx(idx);
                        setEditQty(it.onHand);
                        setEditCost(it.cost);
                        setEditReorder(it.reorder);
                        setEditComment('');
                        setEditStepAmount(it.u.toLowerCase() === 'litre' || it.u.toLowerCase() === 'kg' ? 100 : 10);
                      }
                    }}
                    className={`p-3.5 flex items-center justify-between transition group ${canEdit ? 'cursor-pointer hover:bg-zinc-800/50' : 'hover:bg-zinc-950/20'}`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-bold text-zinc-100">{it.n}</div>
                        {canEdit && (
                          <Edit3 size={11} className="text-zinc-500 group-hover:text-orange-400 transition-colors" />
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                        {it.onHand.toLocaleString("en-ZA")} {it.u} · R {(it.onHand * it.cost).toLocaleString("en-ZA")} val
                      </div>
                    </div>
                    <span className={`text-[9px] font-black tracking-wider px-2.5 py-0.5 rounded border ${status.colorClass} ${status.bgClass}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Inventory Edit Modal */}
            {editingItemIdx !== null && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-zinc-100 space-y-5 shadow-2xl relative"
                >
                  <div className="flex justify-between items-start border-b border-zinc-800/80 pb-3">
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adjust Inventory</h3>
                      <h2 className="text-base font-extrabold text-orange-500 mt-0.5">{items[editingItemIdx]?.n}</h2>
                    </div>
                    <button 
                      onClick={() => setEditingItemIdx(null)}
                      className="text-zinc-400 hover:text-white text-xs bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Quantity Field with Step buttons */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                          QUANTITY ({items[editingItemIdx]?.u})
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Original: {items[editingItemIdx]?.onHand.toLocaleString("en-ZA")}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditQty(prev => Math.max(0, Math.round((prev - editStepAmount) * 100) / 100))}
                          className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 text-zinc-200 w-11 h-11 rounded-xl font-bold text-lg flex items-center justify-center transition active:scale-95"
                          title={`Subtract ${editStepAmount}`}
                        >
                          -
                        </button>
                        
                        <input
                          type="number"
                          inputMode="decimal"
                          value={editQty === 0 ? '0' : editQty}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setEditQty(isNaN(val) ? 0 : val);
                          }}
                          className="flex-1 bg-black border border-zinc-800 focus:border-orange-500 text-white rounded-xl px-4 py-2 text-center text-sm font-mono focus:outline-none"
                        />
                        
                        <button
                          type="button"
                          onClick={() => setEditQty(prev => Math.round((prev + editStepAmount) * 100) / 100)}
                          className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 text-zinc-200 w-11 h-11 rounded-xl font-bold text-lg flex items-center justify-center transition active:scale-95"
                          title={`Add ${editStepAmount}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Step size setting */}
                      <div className="flex items-center justify-end gap-2 text-[10px] text-zinc-500">
                        <span>Step by:</span>
                        <select
                          value={editStepAmount}
                          onChange={(e) => setEditStepAmount(parseFloat(e.target.value))}
                          className="bg-black border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none focus:border-orange-500"
                        >
                          <option value="1">1</option>
                          <option value="10">10</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                        </select>
                      </div>
                    </div>

                    {/* Cost Field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                          UNIT PRICE (R)
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Original: R {items[editingItemIdx]?.cost.toLocaleString("en-ZA")}
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">R</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={editCost === 0 ? '0' : editCost}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setEditCost(isNaN(val) ? 0 : val);
                          }}
                          className="w-full bg-black border border-zinc-800 focus:border-orange-500 text-white rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Reorder Threshold Field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                          MINIMUM STOCK LEVEL ({items[editingItemIdx]?.u})
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Original: {items[editingItemIdx]?.reorder.toLocaleString("en-ZA")}
                        </span>
                      </div>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={editReorder === 0 ? '0' : editReorder}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setEditReorder(isNaN(val) ? 0 : val);
                        }}
                        className="w-full bg-black border border-zinc-800 focus:border-orange-500 text-white rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none"
                      />
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        REASON / COMMENT
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="e.g., Stock count audit adjustment / supplier price update"
                        rows={2}
                        className="w-full bg-black border border-zinc-800 focus:border-orange-500 text-white rounded-xl px-4 py-2 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    {/* Recalculation Preview Section */}
                    {editingItemIdx !== null && (
                      <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl text-xs space-y-2">
                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase block">LIVE VALUE & STATUS PREVIEW</span>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">NEW VALUE</span>
                            <span className="font-mono text-zinc-200 font-bold text-sm">
                              R {Math.round(editQty * editCost).toLocaleString("en-ZA")}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">NEW STATUS</span>
                            {(() => {
                              const previewStatus = getItemStatus({
                                n: '',
                                u: '',
                                onHand: editQty,
                                cost: editCost,
                                reorder: editReorder
                              });
                              return (
                                <span className={`inline-block text-[9px] font-black tracking-wider px-2 py-0.5 rounded border mt-1 ${previewStatus.colorClass} ${previewStatus.bgClass}`}>
                                  {previewStatus.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingItemIdx(null)}
                      className="flex-1 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInventoryEdit}
                      className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs transition shadow-lg shadow-orange-500/15 active:translate-y-0.5"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'log' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase px-1">Log Stock Movement</h2>
            
            <div className="bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl flex gap-3 items-start">
              <Activity size={16} className="text-orange-500 mt-0.5 flex-none" />
              <p className="text-xs text-orange-200/85 leading-relaxed">
                Log movements instantly. Live stocks, target ratios, alerts, and cost accounts will recalculate immediately.
              </p>
            </div>

            <div className="space-y-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-2">
                  MOVEMENT DIRECTION
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Receive', 'Use in Production', 'Despatch', 'Adjust'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLogAct(type)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${logAct === type ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/10' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-2">
                  SELECT ITEM
                </label>
                <select
                  value={selectedItemIdx}
                  onChange={(e) => setSelectedItemIdx(parseInt(e.target.value))}
                  className="w-full bg-black border border-zinc-850 hover:border-zinc-750 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
                >
                  {items.map((it, idx) => (
                    <option key={it.n} value={idx}>{it.n} ({it.u})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-2">
                  QUANTITY ({items[selectedItemIdx]?.u})
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={logQty}
                  onChange={(e) => setLogQty(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-black border border-zinc-850 text-white rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-2">
                  REFERENCE / BATCH CODE
                </label>
                <input
                  type="text"
                  value={logRef}
                  onChange={(e) => setLogRef(e.target.value)}
                  placeholder="e.g. SPM2001 / Batch 14 / Client Name"
                  className="w-full bg-black border border-zinc-850 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              {parseFloat(logQty) > 0 && (
                <div className="bg-zinc-950 p-3.5 border border-zinc-850 rounded-xl text-xs space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">PREVIEW TRANSACTION</span>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current Position:</span>
                    <span className="font-mono text-white">{items[selectedItemIdx].onHand} {items[selectedItemIdx].u}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">New Position:</span>
                    <span className="font-mono text-orange-500 font-bold">
                      {Math.round((items[selectedItemIdx].onHand + ((logAct === 'Receive' || logAct === 'Adjust') ? 1 : -1) * parseFloat(logQty)) * 100) / 100} {items[selectedItemIdx].u}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-850 mt-1">
                    <span className="text-zinc-400">Value Impact:</span>
                    <span className="font-mono font-bold text-white">
                      R {Math.round(parseFloat(logQty) * items[selectedItemIdx].cost).toLocaleString("en-ZA")}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveLog}
                className="w-full py-3.5 rounded-xl bg-orange-500 text-black font-extrabold text-sm transition hover:bg-orange-400 active:translate-y-0.5"
              >
                Save Entry
              </button>
            </div>

            {/* Log History list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                  STOCK MOVEMENT LOGS ({activityLogs.length})
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  Real-time Ledger
                </span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Search item or reference..."
                  value={logHistorySearch}
                  onChange={(e) => setLogHistorySearch(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 placeholder-zinc-600"
                />
                <select
                  value={logHistoryTypeFilter}
                  onChange={(e) => setLogHistoryTypeFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Activities</option>
                  <option value="Receive">Receive</option>
                  <option value="Use in Production">Use in Production</option>
                  <option value="Despatch">Despatch</option>
                  <option value="Adjust (+/-)">Adjust (+/-)</option>
                </select>
              </div>

              {/* List container */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {activityLogs
                  .filter(log => {
                    const matchesSearch = log.itemName.toLowerCase().includes(logHistorySearch.toLowerCase()) || 
                                          (log.ref && log.ref.toLowerCase().includes(logHistorySearch.toLowerCase()));
                    const matchesType = logHistoryTypeFilter === 'all' || log.type === logHistoryTypeFilter;
                    return matchesSearch && matchesType;
                  })
                  .map((log) => {
                    const isPositive = log.type === 'Receive' || log.type === 'Adjust (+/-)';
                    const badgeColors = 
                      log.type === 'Receive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      log.type === 'Use in Production' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      log.type === 'Despatch' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                      'bg-zinc-800 text-zinc-300 border-zinc-700';

                    return (
                      <div key={log.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">{log.itemName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{log.timestamp}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${badgeColors}`}>
                            {log.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-1.5 border-t border-zinc-850">
                          <div>
                            <span className="text-zinc-500">Qty: </span>
                            <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-orange-400'}`}>
                              {isPositive ? '+' : '-'}{log.qty} {log.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Value: </span>
                            <span className="text-white font-bold">
                              R {log.valueImpact ? Math.round(log.valueImpact).toLocaleString("en-ZA") : "0"}
                            </span>
                          </div>
                        </div>

                        {log.ref && (
                          <div className="text-[10px] text-zinc-400 italic bg-black/40 px-2 py-1 rounded">
                            Ref: {log.ref}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {activityLogs.filter(log => {
                  const matchesSearch = log.itemName.toLowerCase().includes(logHistorySearch.toLowerCase()) || 
                                        (log.ref && log.ref.toLowerCase().includes(logHistorySearch.toLowerCase()));
                  const matchesType = logHistoryTypeFilter === 'all' || log.type === logHistoryTypeFilter;
                  return matchesSearch && matchesType;
                }).length === 0 && (
                  <div className="text-center py-6 text-xs text-zinc-500">
                    No matching activity logs found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'prod' && (() => {
          const bagsProduced = Math.max(0, production.balance - production.opening);
          const tonsProduced = bagsProduced / 40;
          const progressPercent = Math.min(100, Math.max(5, (tonsProduced / (pTarget || 1)) * 100));

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
              <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Shift Production & Daily Count</h2>

              {/* Active Shift Config & Target Card */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">EXPECTED START TIME</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={12} className="text-orange-500" />
                      <input 
                        type="text" 
                        value={pStartTime}
                        onChange={(e) => setPStartTime(e.target.value)}
                        placeholder="e.g. 06:00"
                        className="w-16 bg-black border border-zinc-800 text-white font-mono text-xs rounded px-2 py-0.5 focus:outline-none focus:border-orange-500 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">DAILY TARGET</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input 
                        type="number" 
                        step="0.1"
                        value={pTarget}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPTarget(val);
                          setProduction(prev => ({ ...prev, target: val }));
                        }}
                        className="w-20 bg-black border border-zinc-800 text-white font-mono text-xs rounded px-2 py-0.5 focus:outline-none focus:border-orange-500 text-center"
                      />
                      <span className="text-[10px] text-zinc-500">tons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">LIVE PRODUCTION TODAY</span>
                  <div className="text-3xl font-black font-mono text-orange-500 flex items-baseline gap-2 flex-wrap">
                    <span>{Math.round(tonsProduced * 100) / 100} Tons</span>
                    <span className="text-xs text-zinc-500 font-normal">/ {pTarget} ton target</span>
                    <span className="text-xs text-zinc-400 font-normal">({bagsProduced} bags)</span>
                  </div>

                  <div className="w-full bg-zinc-950 h-2.5 rounded-full border border-zinc-850 overflow-hidden mt-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {tonsProduced > pTarget && (
                    <div className="mt-2.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold animate-pulse flex items-center justify-between">
                      <span>✨ Daily Target Achieved!</span>
                      <span>Bonus: +{Math.round((tonsProduced - pTarget) * 100) / 100} Tons</span>
                    </div>
                  )}
                </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 block">Shift Duration</span>
                  <span className="font-bold text-zinc-200 block mt-0.5 font-mono">{production.hours}h run window</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Est. Raw Asphalt Mass</span>
                  <span className="font-bold text-zinc-200 block mt-0.5 font-mono">{Math.round((production.balance - production.opening) * 0.025 * 10) / 10} Tons</span>
                </div>
              </div>
            </div>

            {/* Quick Logging Buttons */}
            <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl space-y-3">
              <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase block">LOG FINISHED BATCH PRODUCTION</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddCustomProduction(25)}
                  className="py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                >
                  <span>➕ 25 Bags</span>
                </button>
                <button
                  onClick={() => handleAddCustomProduction(100)}
                  className="py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                >
                  <span>➕ 100 Bags</span>
                </button>
              </div>

              {/* Custom Batch Count Input */}
              <div className="flex gap-2 pt-1">
                <input 
                  type="number" 
                  value={customProdBags}
                  onChange={(e) => setCustomProdBags(e.target.value)}
                  placeholder="Custom bag count (e.g. 50)"
                  className="flex-1 bg-black border border-zinc-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-orange-500 font-mono"
                />
                <button
                  onClick={() => {
                    const q = parseInt(customProdBags);
                    if (!q || q <= 0) {
                      addToast("Please enter a valid count of bags to produce", true);
                      return;
                    }
                    handleAddCustomProduction(q);
                    setCustomProdBags('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-extrabold transition uppercase"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Shift Comments Board (Plant Manager) */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block font-mono">PLANT MANAGER COMMENT SECTION (MANUFACTURING)</span>
              
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {currentDailyComments.map((com, idx) => (
                  <div key={idx} className="bg-black/40 border border-zinc-850 p-3 rounded-xl text-xs text-zinc-300 leading-normal">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
                      <span className="font-bold">Plant Supervisor Log</span>
                      <span>#{idx+1}</span>
                    </div>
                    {com}
                  </div>
                ))}
                {currentDailyComments.length === 0 && (
                  <span className="text-xs text-zinc-600 block text-center py-2 italic">No shift manufacturing comments logged yet.</span>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <textarea
                  value={newDailyCommentText}
                  onChange={(e) => setNewDailyCommentText(e.target.value)}
                  placeholder="Log burner stats, mixer temperatures, moisture checks..."
                  className="w-full bg-black border border-zinc-850 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 h-16 resize-none"
                />
                <button
                  onClick={handleAddDailyComment}
                  className="mt-2 w-full py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-xl text-xs font-bold transition border border-zinc-800"
                >
                  Publish Supervisor Comment
                </button>
              </div>
            </div>

            {/* End Shift Trigger */}
            <div className="bg-gradient-to-r from-orange-950/20 to-zinc-900 border border-orange-500/10 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                Complete Active Shift Session
              </h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Completing the shift locks today's manufactured count ({production.balance - production.opening} bags), saves supervisor comment logs, resets tomorrow's starting target, and snapshots stats into the reports calendar automatically.
              </p>
              <button
                onClick={handleSaveDailyShiftLog}
                className="w-full py-3 rounded-xl bg-orange-500 text-black font-extrabold text-xs uppercase tracking-wider transition hover:bg-orange-400 active:translate-y-0.5 shadow-lg shadow-orange-500/10"
              >
                Log Completed Shift & Sync Reports
              </button>
            </div>
            </motion.div>
          );
        })()}

        {activeTab === 'pipe' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            
            {/* 5-Sub Tabs Selection */}
            <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 overflow-x-auto gap-1 scrollbar-none">
              {[
                { id: 'quotes' as const, label: 'All Quote', count: quotes.length },
                { id: 'confirmed' as const, label: 'Confirmed', count: stops.filter(s => s.st === 'todo').length },
                { id: 'loaded' as const, label: 'Loaded', count: stops.filter(s => s.st === 'route' || s.st === 'site').length },
                { id: 'delivered' as const, label: 'Delivered', count: stops.filter(s => s.st === 'done').length },
                { id: 'new-quote' as const, label: 'New Quote', count: null }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setOrdersSubTab(sub.id);
                    setSelectedQuoteId(null);
                    setSelectedStopIdx(null);
                  }}
                  className={`flex-1 py-2 px-2.5 text-center text-[9px] font-extrabold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5 ${ordersSubTab === sub.id ? 'bg-orange-500 text-black shadow font-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <span>{sub.label.toUpperCase()}</span>
                  {sub.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${ordersSubTab === sub.id ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {sub.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Filter, Search, and Aggregates Controls (Only shown for lists, not for the Calculator form) */}
            {ordersSubTab !== 'new-quote' && (
              <div className="space-y-3 bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2 mb-1">
                  <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider block font-mono">Orders &amp; Log Manifests</span>
                  <button
                    onClick={() => setOrdersSubTab('new-quote')}
                    className="py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1 transition active:scale-95 shadow-sm"
                  >
                    <Plus size={11} className="stroke-[3]" />
                    <span>Create New Quote</span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search client name, company, address..."
                      className="w-full bg-black border border-zinc-800 text-white rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">🔍</span>
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Active Vehicle Roster Filter */}
                  <div className="flex gap-2">
                    <select
                      value={selectedVehicleFilter}
                      onChange={(e) => setSelectedVehicleFilter(e.target.value)}
                      className="bg-black border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 w-full sm:w-auto"
                    >
                      <option value="all">All Vehicles &amp; Drivers</option>
                      {drivers.map(d => (
                        <option key={d.plate} value={d.plate}>{d.name} ({d.plate})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grand Total Cost calculations display */}
                {(() => {
                  let visibleCount = 0;
                  let totalBags = 0;
                  let grandTotalCost = 0;

                  if (ordersSubTab === 'quotes') {
                    const filteredQuotesList = quotes.filter(q => {
                      const query = searchQuery.toLowerCase().trim();
                      return !query || 
                        q.clientName.toLowerCase().includes(query) || 
                        q.deliveryAddress.toLowerCase().includes(query) ||
                        q.contactNumber.toLowerCase().includes(query);
                    });
                    visibleCount = filteredQuotesList.length;
                    totalBags = filteredQuotesList.reduce((sum, q) => sum + q.bags, 0);
                    grandTotalCost = filteredQuotesList.reduce((sum, q) => sum + q.total, 0);
                  } else {
                    const filteredStopsList = stops.filter(s => {
                      const query = searchQuery.toLowerCase().trim();
                      const matchesSearch = !query || 
                        s.nm.toLowerCase().includes(query) || 
                        s.addr.toLowerCase().includes(query) ||
                        (s.clientContact && s.clientContact.toLowerCase().includes(query));
                      
                      const matchesVehicle = selectedVehicleFilter === 'all' || s.assignedDriverPlate === selectedVehicleFilter;
                      
                      let matchesTab = false;
                      if (ordersSubTab === 'confirmed') matchesTab = s.st === 'todo';
                      else if (ordersSubTab === 'loaded') matchesTab = s.st === 'route' || s.st === 'site';
                      else if (ordersSubTab === 'delivered') matchesTab = s.st === 'done';
                      
                      return matchesSearch && matchesVehicle && matchesTab;
                    });
                    visibleCount = filteredStopsList.length;
                    totalBags = filteredStopsList.reduce((sum, s) => sum + s.bags, 0);
                    // Approximate cost: bags * price + distance * fee + 15% VAT
                    grandTotalCost = filteredStopsList.reduce((sum, s) => {
                      const p = s.pricePerBag || 75;
                      const d = s.distanceKm || 15;
                      const base = (s.bags * p) + (d * 15);
                      return sum + Math.round(base * 1.15 * 100) / 100;
                    }, 0);
                  }

                  return (
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-850">
                      <div>
                        <span>ITEMS: <strong className="text-white">{visibleCount}</strong></span>
                        <span className="mx-2 text-zinc-600">|</span>
                        <span>BAGS: <strong className="text-white">{totalBags} Sacks</strong></span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 text-[9px] block uppercase tracking-wider">Estimated Grand Total</span>
                        <span className="text-sm font-black text-orange-500 font-mono">
                          R {grandTotalCost.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 1. QUOTES DESK SUB TAB */}
            {ordersSubTab === 'quotes' && (
              <div className="space-y-3">
                {(() => {
                  const filteredQuotesList = quotes.filter(q => {
                    const query = searchQuery.toLowerCase().trim();
                    return !query || 
                      q.clientName.toLowerCase().includes(query) || 
                      q.deliveryAddress.toLowerCase().includes(query) ||
                      q.contactNumber.toLowerCase().includes(query);
                  });

                  if (filteredQuotesList.length === 0) {
                    return (
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center text-xs text-zinc-500 italic">
                        No quotes match the current search query.
                      </div>
                    );
                  }

                  return filteredQuotesList.map((q) => {
                    const isExpanded = selectedQuoteId === q.id;
                    return (
                      <div 
                        key={q.id}
                        className={`bg-zinc-900 border transition-all rounded-2xl overflow-hidden ${isExpanded ? 'border-orange-500 bg-zinc-900/90' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        {/* Quote summary row with SAME-ROW Actions */}
                        <div 
                          onClick={() => setSelectedQuoteId(isExpanded ? null : q.id)}
                          className="p-4 cursor-pointer flex justify-between items-center gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono bg-orange-500/10 text-orange-500 font-bold px-1 py-0.5 rounded border border-orange-500/10">{q.id}</span>
                              <span className="text-xs font-bold text-white truncate max-w-[140px] block">{q.clientName}</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 mt-1 block truncate max-w-[220px] font-sans">{q.deliveryAddress}</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5 block font-mono">
                              {q.bags} Bags · <strong>R {q.total.toLocaleString("en-ZA")} total</strong>
                            </span>
                          </div>

                          {/* SAME ROW ACTIONS: Approve/Convert and Delete icons */}
                          <div className="flex items-center gap-1.5 flex-none" onClick={(e) => e.stopPropagation()}>
                            {q.status === 'pending' && (
                              <button
                                onClick={() => handleApproveQuote(q.id)}
                                title="Approve & Convert to Order"
                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-xl transition border border-emerald-500/20 active:scale-95"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete quote ${q.id}?`)) {
                                  handleDeleteQuote(q.id);
                                }
                              }}
                              title="Delete/Reject Quote"
                              className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition border border-rose-500/20 active:scale-95"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Quote Expanded Details Sheet */}
                        {isExpanded && (
                          <div className="p-4 border-t border-zinc-800 bg-black/40 space-y-4">
                            
                            {/* Visual Invoice Sheet */}
                            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3 font-mono text-[10px] text-zinc-400">
                              <div className="flex justify-between border-b border-zinc-900 pb-2">
                                <span className="font-extrabold text-white text-xs tracking-wider">SUPERPATCH LTM CO.</span>
                                <span className="font-bold">DATE: {q.date}</span>
                              </div>
                              
                              <div className="space-y-1 text-[10px]">
                                <div className="text-[9px] text-zinc-500 font-bold tracking-wider">CLIENT DETAIL SHEET:</div>
                                <div className="text-white font-bold font-sans">{q.clientName}</div>
                                <div>Contact: {q.contactNumber}</div>
                                <div className="truncate text-zinc-300">Deliver To: {q.deliveryAddress}</div>
                              </div>

                              {/* Price breakdown table */}
                              <div className="border-t border-zinc-900 pt-2.5 space-y-1.5">
                                <div className="flex justify-between">
                                  <span>{q.bags} x 25kg Bags (@R {q.pricePerBag})</span>
                                  <span className="text-zinc-200">R {q.subtotalBags.toLocaleString("en-ZA")}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Delivery ({q.distanceKm} km @ R15/km)</span>
                                  <span className="text-zinc-200">R {q.subtotalDelivery.toLocaleString("en-ZA")}</span>
                                </div>
                                <div className="flex justify-between border-t border-zinc-900 pt-1">
                                  <span>Subtotal Excl. VAT</span>
                                  <span>R {(q.subtotalBags + q.subtotalDelivery).toLocaleString("en-ZA")}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>VAT (15%)</span>
                                  <span>R {q.vat.toLocaleString("en-ZA")}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black text-orange-500 border-t border-dashed border-zinc-800 pt-2">
                                  <span>GRAND TOTAL INCL. VAT</span>
                                  <span>R {q.total.toLocaleString("en-ZA")}</span>
                                </div>
                              </div>
                            </div>

                            {/* EXPORT OPTIONS: Download PDF & Send via WhatsApp */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  addToast(`Downloading SuperPatch_Quote_${q.id}.pdf ...`);
                                  // Mock printable window simulation
                                  const printWin = window.open("", "_blank");
                                  if (printWin) {
                                    printWin.document.write(`
                                      <html>
                                        <head>
                                          <title>SuperPatch Quote ${q.id}</title>
                                          <style>
                                            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                                            .header { border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 25px; }
                                            .total { font-size: 1.3em; font-weight: bold; color: #f97316; }
                                            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                            .table th, .table td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
                                            .footer { margin-top: 50px; font-size: 0.8em; color: #777; border-t: 1px solid #ddd; padding-top: 20px; }
                                          </style>
                                        </head>
                                        <body>
                                          <div class="header">
                                            <h1>SUPERPATCH LTM COVENTURES</h1>
                                            <p>Asphalt Manufacturing Plant & Dispatch Office</p>
                                          </div>
                                          <h2>CLIENT QUOTE SHEET: ${q.id}</h2>
                                          <p><strong>Date:</strong> ${q.date}</p>
                                          <p><strong>Client:</strong> ${q.clientName}</p>
                                          <p><strong>Phone:</strong> ${q.contactNumber}</p>
                                          <p><strong>Delivery Address:</strong> ${q.deliveryAddress}</p>
                                          
                                          <table class="table">
                                            <thead>
                                              <tr><th>Item Description</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
                                            </thead>
                                            <tbody>
                                              <tr><td>SuperPatch 25kg Premix Asphalt Sacks</td><td>${q.bags}</td><td>R ${q.pricePerBag}</td><td>R ${q.subtotalBags.toLocaleString()}</td></tr>
                                              <tr><td>Freight and Delivery Surcharge</td><td>${q.distanceKm} km</td><td>R 15.00</td><td>R ${q.subtotalDelivery.toLocaleString()}</td></tr>
                                              <tr><td colspan="3" style="text-align:right"><strong>VAT (15%):</strong></td><td>R ${q.vat.toLocaleString()}</td></tr>
                                              <tr class="total"><td colspan="3" style="text-align:right"><strong>Grand Total Cost:</strong></td><td>R ${q.total.toLocaleString()}</td></tr>
                                            </tbody>
                                          </table>
                                          <div class="footer">
                                            <p>Thank you for choosing SuperPatch. Standard dry hot-mix bagging certified to SANS 4001-BT1 specifications.</p>
                                          </div>
                                        </body>
                                      </html>
                                    `);
                                    printWin.document.close();
                                    printWin.print();
                                  }
                                }}
                                className="py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:translate-y-0.5"
                              >
                                <span>📄</span> Download PDF Quote
                              </button>

                              <a
                                href={`https://api.whatsapp.com/send?phone=${q.contactNumber.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                                  `*SUPERPATCH ASPHALT QUOTATION*\n\n*Quote ID:* ${q.id}\n*Client:* ${q.clientName}\n*Physical Address:* ${q.deliveryAddress}\n\n*Order Metrics:*\n- Bags Ordered: ${q.bags} x 25kg sacks\n- Asphalt Subtotal: R ${q.subtotalBags.toLocaleString("en-ZA")}\n- Delivery Cost: R ${q.subtotalDelivery.toLocaleString("en-ZA")}\n- Tax VAT (15%): R ${q.vat.toLocaleString("en-ZA")}\n\n*ESTIMATED GRAND TOTAL: R ${q.total.toLocaleString("en-ZA")}*\n\nThank you for choosing SuperPatch! Please confirm for dispatch schedule.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2.5 bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-900/30 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:translate-y-0.5"
                              >
                                <span>💬</span> Send via WhatsApp
                              </a>
                            </div>

                            {/* Comment Section */}
                            <div className="space-y-2 pt-2 border-t border-zinc-900">
                              <span className="text-[9px] font-bold text-zinc-500 tracking-wider block font-mono">INTERNAL DESK COMMENTS LOG</span>
                              <div className="space-y-1.5">
                                {q.comments && q.comments.map((com, ci) => (
                                  <div key={ci} className="p-2.5 rounded-lg bg-black/50 border border-zinc-900 text-[11px] text-zinc-300 leading-normal">
                                    {com}
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={newQuoteCommentText}
                                  onChange={(e) => setNewQuoteCommentText(e.target.value)}
                                  placeholder="Log client feedback, special terms, discount approvals..."
                                  className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 text-xs focus:outline-none focus:border-orange-500 text-white"
                                />
                                <button
                                  onClick={() => handleAddQuoteComment(q.id)}
                                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition"
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* 2. CONFIRMED, LOADED, AND DELIVERED STOPS SUB TABS */}
            {(ordersSubTab === 'confirmed' || ordersSubTab === 'loaded' || ordersSubTab === 'delivered') && (
              <div className="space-y-3.5">
                {(() => {
                  // Filter stops according to current tab status
                  const filteredStopsList = stops.map((s, originalIndex) => ({ ...s, originalIndex })).filter(item => {
                    // Filter Search Query
                    const query = searchQuery.toLowerCase().trim();
                    const matchesSearch = !query || 
                      item.nm.toLowerCase().includes(query) || 
                      item.addr.toLowerCase().includes(query) ||
                      (item.clientContact && item.clientContact.toLowerCase().includes(query));
                    
                    // Filter Vehicle
                    const matchesVehicle = selectedVehicleFilter === 'all' || item.assignedDriverPlate === selectedVehicleFilter;
                    
                    // Filter Status
                    let matchesStatus = false;
                    if (ordersSubTab === 'confirmed') matchesStatus = item.st === 'todo';
                    else if (ordersSubTab === 'loaded') matchesStatus = item.st === 'route' || item.st === 'site';
                    else if (ordersSubTab === 'delivered') matchesStatus = item.st === 'done';

                    return matchesSearch && matchesVehicle && matchesStatus;
                  });

                  if (filteredStopsList.length === 0) {
                    return (
                      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center text-xs text-zinc-500 italic">
                        No loaded order packages in {ordersSubTab} state.
                      </div>
                    );
                  }

                  return filteredStopsList.map((stop) => {
                    const idx = stop.originalIndex;
                    const isExpanded = selectedStopIdx === idx;
                    const stopPrice = stop.pricePerBag || 75;
                    const stopDistance = stop.distanceKm || 15;
                    const stopBase = (stop.bags * stopPrice) + (stopDistance * 15);
                    const stopGrandTotal = Math.round(stopBase * 1.15 * 100) / 100;

                    return (
                      <div 
                        key={idx}
                        className={`bg-zinc-900 border transition-all rounded-2xl overflow-hidden ${isExpanded ? 'border-orange-500 bg-zinc-900/90' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        {/* Summary Block with SAME-ROW Deletion */}
                        <div 
                          onClick={() => setSelectedStopIdx(isExpanded ? null : idx)}
                          className="p-4 cursor-pointer flex justify-between items-center gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white block truncate max-w-[150px]">{stop.nm}</span>
                              <span className={`text-[8px] px-1.5 font-mono py-0.2 rounded font-black border uppercase ${
                                stop.st === 'done' ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20' :
                                stop.st === 'route' ? 'text-orange-400 bg-orange-950/20 border-orange-500/20' :
                                stop.st === 'site' ? 'text-teal-400 bg-teal-950/20 border-teal-500/20' :
                                'text-yellow-400 bg-yellow-950/20 border-yellow-500/20'
                              }`}>
                                {stop.st === 'todo' ? 'Confirmed' : stop.st === 'route' ? 'En Route' : stop.st === 'site' ? 'At Site' : 'Delivered'}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 mt-1 block truncate max-w-[220px]">{stop.addr}</span>
                            
                            {/* Assigned vehicle indicator */}
                            <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-zinc-400">
                              <span className="text-zinc-500">Vehicle:</span>
                              {stop.assignedDriverPlate ? (
                                <span className="text-orange-400 font-bold">{stop.assignedDriverName} ({stop.assignedDriverPlate})</span>
                              ) : (
                                <span className="text-rose-500 italic">Unassigned ⚠️</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-none" onClick={(e) => e.stopPropagation()}>
                            <div className="text-right mr-1 hidden sm:block">
                              <span className="text-[9px] text-zinc-500 block font-mono">GRAND TOTAL</span>
                              <span className="text-xs font-bold text-white font-mono">R {stopGrandTotal.toLocaleString("en-ZA")}</span>
                            </div>
                            
                            {/* SAME-ROW Deletion for loaded order packages */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete order package for ${stop.nm}?`)) {
                                  handleDeleteStop(idx);
                                }
                              }}
                              title="Delete Order Package"
                              className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition border border-rose-500/20 active:scale-95"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded details, comment log, and driver assignment */}
                        {isExpanded && (
                          <div className="p-4 border-t border-zinc-800 bg-black/40 space-y-4">
                            
                            {/* Assign Driver / Vehicle Roster Widget */}
                            <div className="bg-zinc-950/80 p-3.5 border border-zinc-850 rounded-xl space-y-2.5">
                              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">ASSIGN VEHICLE &amp; FLEET ROSTER</label>
                              <div className="flex flex-col gap-2">
                                <select
                                  value={stop.assignedDriverPlate || ""}
                                  onChange={(e) => handleAssignDriver(idx, e.target.value)}
                                  className="w-full bg-black border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                                >
                                  <option value="">-- Click to assign driver vehicle --</option>
                                  {drivers.map(d => (
                                    <option key={d.plate} value={d.plate}>
                                      {d.name} -- {d.truck} ({d.plate})
                                    </option>
                                  ))}
                                </select>
                                <p className="text-[9px] text-zinc-500 leading-normal">
                                  Assigning a vehicle pushes this order package to the designated fleet driver's real-time mobile app and terminal instantaneously.
                                </p>
                              </div>
                            </div>

                            {/* Status controls */}
                            <div className="bg-zinc-950/80 p-3 border border-zinc-850 rounded-xl space-y-2">
                              <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block font-mono">DISPATCH STATUS OVERRIDES</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                <button
                                  onClick={() => {
                                    setStops(prev => prev.map((s, i) => i === idx ? { ...s, st: 'todo' } : s));
                                    addToast("Status updated to Confirmed");
                                  }}
                                  className={`py-1.5 rounded-lg text-[9px] font-bold transition ${stop.st === 'todo' ? 'bg-yellow-500 text-black font-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                                >
                                  Confirmed
                                </button>
                                <button
                                  onClick={() => {
                                    setStops(prev => prev.map((s, i) => i === idx ? { ...s, st: 'route' } : s));
                                    addToast("Status updated to En Route");
                                  }}
                                  className={`py-1.5 rounded-lg text-[9px] font-bold transition ${stop.st === 'route' ? 'bg-orange-500 text-black font-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                                >
                                  En Route
                                </button>
                                <button
                                  onClick={() => {
                                    setStops(prev => prev.map((s, i) => i === idx ? { ...s, st: 'done' } : s));
                                    addToast("Status updated to Delivered");
                                  }}
                                  className={`py-1.5 rounded-lg text-[9px] font-bold transition ${stop.st === 'done' ? 'bg-emerald-500 text-black font-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                                >
                                  Delivered
                                </button>
                              </div>
                            </div>

                            {/* Standard Parameter Sheet */}
                            <div className="grid grid-cols-2 gap-3 text-[10px] text-zinc-400 font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                              <div>
                                <span className="text-zinc-500 block uppercase text-[8px] tracking-wider">Client Contact:</span>
                                <span className="text-white block font-sans font-bold mt-0.5">{stop.clientContact || "No contact logged"}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block uppercase text-[8px] tracking-wider">Trip Loads:</span>
                                <span className="text-white block mt-0.5 font-bold">{stop.loads || 1} loads required</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block uppercase text-[8px] tracking-wider">Sacks Count:</span>
                                <span className="text-white block mt-0.5 font-bold">{stop.bags} x 25kg Bags</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block uppercase text-[8px] tracking-wider">Delivery distance:</span>
                                <span className="text-white block mt-0.5 font-bold">{stopDistance} km</span>
                              </div>
                            </div>

                            {/* Comment Section for active orders */}
                            <div className="space-y-2 pt-2 border-t border-zinc-900">
                              <span className="text-[9px] font-bold text-zinc-500 tracking-wider block font-mono">PLANT MANAGER DISPATCH INSTRUCTIONS LOG</span>
                              <div className="space-y-1.5">
                                {stop.comments && stop.comments.map((c, ci) => (
                                  <div key={ci} className="p-2.5 rounded-lg bg-black/50 border border-zinc-900 text-[11px] text-zinc-300 leading-normal">
                                    {c}
                                  </div>
                                ))}
                                {(!stop.comments || stop.comments.length === 0) && (
                                  <span className="text-[10px] text-zinc-600 block italic text-center py-2">No dispatch comments logged yet.</span>
                                )}
                              </div>

                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={newStopCommentText}
                                  onChange={(e) => setNewStopCommentText(e.target.value)}
                                  placeholder="Log bypass instructions, gate codes, site contact..."
                                  className="flex-1 bg-black border border-zinc-850 rounded-xl px-3 text-xs focus:outline-none focus:border-orange-500 text-white"
                                />
                                <button
                                  onClick={() => handleAddStopComment(idx)}
                                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition"
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* 3. NEW QUOTE CALCULATOR SUB TAB */}
            {ordersSubTab === 'new-quote' && (
              <div className="space-y-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block font-mono">QUOTING CALCULATOR & CLIENT SCHEDULER</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">CLIENT NAME / DEPARTMENT</label>
                    <input 
                      type="text" 
                      value={qClientName}
                      onChange={(e) => setQClientName(e.target.value)}
                      placeholder="e.g. Mogale City Roads Depot"
                      className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">CONTACT PHONE</label>
                      <input 
                        type="text" 
                        value={qContactNumber}
                        onChange={(e) => setQContactNumber(e.target.value)}
                        placeholder="e.g. +27 11 951 2000"
                        className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">DISTANCE (KM)</label>
                      <input 
                        type="number" 
                        value={qDistance}
                        onChange={(e) => setQDistance(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">DELIVERY SITE PHYSICAL ADDRESS</label>
                    <input 
                      type="text" 
                      value={qAddress}
                      onChange={(e) => setQAddress(e.target.value)}
                      placeholder="e.g. Commissioner St, Krugersdorp Depot"
                      className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">BAGS OF ASPHALT (25KG)</label>
                      <input 
                        type="number" 
                        value={qBags}
                        onChange={(e) => setQBags(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">PRICE PER BAG (R)</label>
                      <input 
                        type="number" 
                        value={qPricePerBag}
                        onChange={(e) => setQPricePerBag(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Dynamic Cost Sheet (In-app Quote preview with GRAND TOTAL COST) */}
                  <div className="bg-black/90 border border-zinc-850 p-4 rounded-xl space-y-2 text-[10px] font-mono text-zinc-400">
                    <span className="text-[9px] font-bold text-zinc-500 block uppercase mb-1.5">REAL-TIME VALUATION SHEET</span>
                    
                    <div className="flex justify-between">
                      <span>Bags Subtotal:</span>
                      <span className="text-white font-bold">R {((parseInt(qBags)||0) * (parseFloat(qPricePerBag)||0)).toLocaleString("en-ZA")}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Delivery Subtotal ({qDistance} km @ R15/km):</span>
                      <span className="text-white font-bold">R {((parseFloat(qDistance)||0) * (parseFloat(qCostPerKm)||15)).toLocaleString("en-ZA")}</span>
                    </div>

                    <div className="flex justify-between border-t border-zinc-900 pt-1.5">
                      <span>VAT (15%):</span>
                      <span className="text-zinc-200">
                        R {Math.round((((parseInt(qBags)||0) * (parseFloat(qPricePerBag)||0)) + ((parseFloat(qDistance)||0) * (parseFloat(qCostPerKm)||15))) * 0.15 * 100) / 100}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-black text-orange-500 border-t border-dashed border-zinc-800 pt-2 mt-1">
                      <span>ESTIMATED GRAND TOTAL:</span>
                      <span>
                        R {Math.round(((((parseInt(qBags)||0) * (parseFloat(qPricePerBag)||0)) + ((parseFloat(qDistance)||0) * (parseFloat(qCostPerKm)||15))) * 1.15) * 100) / 100}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateQuote}
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black rounded-xl transition uppercase tracking-wider"
                  >
                    Save &amp; Generate Formal Quote
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* 3. REPORTS TAB (Simplified Calendar view with operational parameters) */}
        {activeTab === 'reps' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Operations Reports Tab</h2>

            {/* Simplified June 2026 Calendar Grid */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-white uppercase font-mono">June 2026</span>
                <span className="text-[10px] text-zinc-500">Tap day to load report metrics</span>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 font-bold font-mono">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((h, i) => (
                  <div key={i} className="py-1">{h}</div>
                ))}
              </div>

              {/* Day Cells (June 2026 starts on Monday June 1) */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                  const hasData = reportsData.some(r => r.date === dateStr);
                  const isSelected = selectedReportDate === dateStr;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedReportDate(dateStr)}
                      className={`h-9 rounded-lg flex flex-col justify-between p-1 border transition-all relative ${
                        isSelected 
                          ? 'bg-orange-500 border-orange-500 text-black font-extrabold shadow' 
                          : hasData 
                            ? 'bg-orange-950/20 border-orange-500/30 text-white' 
                            : 'bg-black/40 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                      }`}
                    >
                      {/* Day number with white wording text constraint */}
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                        {dayNum}
                      </span>

                      {/* Small visual indicator dot for days with data */}
                      {hasData && (
                        <span className={`w-1 h-1 rounded-full self-center mb-0.5 ${isSelected ? 'bg-zinc-950' : 'bg-orange-500'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected day parameters output */}
            {(() => {
              const selectedDayReport = reportsData.find(r => r.date === selectedReportDate);
              
              if (!selectedDayReport) {
                return (
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center space-y-3">
                    <span className="text-xl">📅</span>
                    <h3 className="text-xs font-bold text-white uppercase font-mono">No Records Logged for June {selectedReportDate.split('-')[2]}</h3>
                    <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                      There are no archived production runs or delivery sheets synchronized for this date. Run and "Complete Shift" in the production tab to push operational stats here.
                    </p>
                    <button
                      onClick={() => {
                        const dayPart = selectedReportDate.split('-')[2];
                        const mockData: ReportDay = {
                          date: selectedReportDate,
                          closingStock: 11000 + Math.round(Math.random() * 2000),
                          produced: 300 + Math.round(Math.random() * 200),
                          delivered: 200 + Math.round(Math.random() * 200),
                          ordersCompleted: 2 + Math.round(Math.random() * 3),
                          deliveryDistance: 40 + Math.round(Math.random() * 80),
                          loads: 2 + Math.round(Math.random() * 4),
                          manufacturingComments: ["Aggregates moisture balanced perfectly.", "Pre-heater temperature average 155°C."],
                          orderComments: [`Private contractor order completed.`, `Loads dispatched on Samuel Mathole's truck.`]
                        };
                        setReportsData(prev => [mockData, ...prev.filter(r => r.date !== selectedReportDate)]);
                        addToast(`Demo metrics generated for June ${dayPart}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-bold transition border border-zinc-800"
                    >
                      Log Demo Shift Snapshot
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  
                  {/* Selected report date title */}
                  <div className="flex justify-between items-center px-1 font-mono text-[10px] text-zinc-500 font-bold">
                    <span>OPERATIONAL AUDIT REPORT</span>
                    <span className="text-orange-500">DATE: {selectedDayReport.date}</span>
                  </div>

                  {/* 3x2 Bento grid for daily parameters */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Parameter: Closing Stock (High contrast white wording text) */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">CLOSING STOCK</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.closingStock.toLocaleString()}
                        <span className="text-xs text-zinc-500 font-normal"> bags</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 block mt-1 font-bold font-mono">
                        {Math.round((selectedDayReport.closingStock / 40) * 100) / 100} Tons stock
                      </span>
                    </div>

                    {/* Parameter: Produced */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">PRODUCED</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.produced.toLocaleString()}
                        <span className="text-xs text-zinc-500 font-normal"> bags</span>
                      </div>
                      <div className="flex flex-wrap justify-between items-center mt-1">
                        <span className="text-[9px] text-emerald-400 font-bold font-mono">
                          +{Math.round((selectedDayReport.produced / 40) * 100) / 100} Tons mix
                        </span>
                        {(selectedDayReport.produced / 40) > 90 && (
                          <span className="text-[8px] font-black text-amber-400 animate-pulse bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                            ✨ Bonus: +{Math.round(((selectedDayReport.produced / 40) - 90) * 100) / 100} t
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Parameter: Delivered */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">DELIVERED</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.delivered.toLocaleString()}
                        <span className="text-xs text-zinc-500 font-normal"> bags</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 block mt-1 font-bold font-mono">
                        {Math.round((selectedDayReport.delivered / 40) * 100) / 100} Tons dispatched
                      </span>
                    </div>

                    {/* Parameter: Orders Completed */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">ORDERS COMPLETED</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.ordersCompleted}
                        <span className="text-xs text-zinc-500 font-normal"> orders</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 block mt-1 font-bold font-mono">
                        {Math.round((selectedDayReport.delivered / 40) * 100) / 100} Tons completed
                      </span>
                    </div>

                    {/* Parameter: Delivery Distance */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">DELIVERY DISTANCE</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.deliveryDistance}
                        <span className="text-xs text-zinc-500 font-normal"> km</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-1">Traversed by fleet drivers</span>
                    </div>

                    {/* Parameter: Loads */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase block">TRUCK LOADS</span>
                      <div className="text-xl font-extrabold text-white mt-1.5 font-mono">
                        {selectedDayReport.loads}
                        <span className="text-xs text-zinc-500 font-normal"> loads</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-1">Aggregated trip count</span>
                    </div>
                  </div>

                  {/* Daily Log Comment boards */}
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3.5">
                    
                    {/* Plant manufacturing comments */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-orange-500 tracking-wider uppercase block">MANUFACTURING PLANT DAILY COMMENTS</span>
                      <div className="space-y-1">
                        {selectedDayReport.manufacturingComments && selectedDayReport.manufacturingComments.map((com, index) => (
                          <div key={index} className="bg-black/50 border border-zinc-850 text-[11px] text-zinc-300 p-2 rounded-xl leading-normal">
                            • {com}
                          </div>
                        ))}
                        {(!selectedDayReport.manufacturingComments || selectedDayReport.manufacturingComments.length === 0) && (
                          <span className="text-[10px] text-zinc-600 block italic">No plant manufacturing comments logged for this day.</span>
                        )}
                      </div>
                    </div>

                    {/* Fleet order dispatch comments */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                      <span className="text-[9px] font-bold text-orange-500 tracking-wider uppercase block">FLEET DISPATCH DAILY COMMENTS</span>
                      <div className="space-y-1">
                        {selectedDayReport.orderComments && selectedDayReport.orderComments.map((com, index) => (
                          <div key={index} className="bg-black/50 border border-zinc-850 text-[11px] text-zinc-300 p-2 rounded-xl leading-normal">
                            • {com}
                          </div>
                        ))}
                        {(!selectedDayReport.orderComments || selectedDayReport.orderComments.length === 0) && (
                          <span className="text-[10px] text-zinc-600 block italic">No client dispatch or logistics comments logged for this day.</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('home')} 
                className="p-1.5 rounded-lg border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white transition"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Team Management</h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                {editingOfficeUserEmail || editingDriverPlate ? `EDIT PROFILE: ${newUserName}` : 'ADD NEW PROFILE'}
              </span>
              
              <div>
                <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Samuel Nkosi"
                  className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Role / Function</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  disabled={editingOfficeUserEmail !== null || editingDriverPlate !== null}
                  className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="Plant Manager">Plant Manager</option>
                  <option value="Sales / Admin">Sales / Admin</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Owner / Admin">Owner / Admin</option>
                  <option value="Driver">Driver (Fleet)</option>
                </select>
              </div>

              {newUserRole !== 'Driver' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Email (Sign In Username)</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. name@superpatch.co.za"
                      disabled={editingOfficeUserEmail !== null}
                      className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Temporary Password</label>
                    <input
                      type="text"
                      value={newUserPass}
                      onChange={(e) => setNewUserPass(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border-l-2 border-orange-500/20 pl-3.5 py-1">
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Vehicle Registration Plate</label>
                    <input
                      type="text"
                      value={newUserPlate}
                      onChange={(e) => setNewUserPlate(e.target.value)}
                      placeholder="e.g. LK 75 FG GP"
                      disabled={editingDriverPlate !== null}
                      className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Mobile / Phone Number (For Sign-In)</label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="e.g. 0821234567"
                      className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Trailer / Vehicle Class</label>
                    <select
                      value={newUserTruck}
                      onChange={(e) => setNewUserTruck(e.target.value)}
                      className="w-full bg-black border border-zinc-855 text-white text-xs rounded-xl p-3 focus:outline-none"
                    >
                      <option value="34t Horse & Trailer">34t Horse & Trailer</option>
                      <option value="16t Horse & Trailer">16t Horse & Trailer</option>
                      <option value="8t Rigid">8t Rigid</option>
                      <option value="Bakkie / LDV">Bakkie / LDV</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCreateUser}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-black font-extrabold text-xs transition hover:bg-orange-400"
                >
                  {editingOfficeUserEmail || editingDriverPlate ? 'Save Changes' : 'Create Account Profile'}
                </button>
                {(editingOfficeUserEmail || editingDriverPlate) && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-extrabold text-xs transition hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Office users listing */}
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2 px-1">Office Personnel ({officeUsers.length})</h3>
              <div className="space-y-2">
                {officeUsers.map((u, i) => (
                  <div key={u.email} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {u.email === user.email && <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">You</span>}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-mono">{u.email} · {u.role}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleEditOfficeUser(u)}
                        title="Edit User"
                        className="p-2 text-zinc-500 hover:text-orange-500 transition hover:bg-orange-500/5 rounded-lg border border-transparent hover:border-orange-500/15"
                      >
                        <Edit3 size={14} />
                      </button>
                      {u.email !== user.email && (
                        <button 
                          onClick={() => handleRemoveOfficeUser(u.email)}
                          title="Delete User"
                          className="p-2 text-zinc-500 hover:text-rose-500 transition hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/15"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drivers listing */}
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2 px-1">Active Fleet Drivers ({drivers.length})</h3>
              <div className="space-y-2">
                {drivers.map(d => (
                  <div key={d.plate} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{d.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-mono">{d.plate} · {d.truck} {d.phone ? `· Mobile: ${d.phone}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleEditDriver(d)}
                        title="Edit Driver"
                        className="p-2 text-zinc-500 hover:text-orange-500 transition hover:bg-orange-500/5 rounded-lg border border-transparent hover:border-orange-500/15"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleRemoveDriver(d.plate)}
                        title="Delete Driver"
                        className="p-2 text-zinc-500 hover:text-rose-500 transition hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/15"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation Panel */}
      {activeTab !== 'users' && (
        <div className="absolute bottom-0 inset-x-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 h-20 flex px-1 z-30 justify-around">
          {[
            { id: 'home', label: 'Home', icon: '🏭' },
            { id: 'inv', label: 'Inventory', icon: '📦' },
            { id: 'prod', label: 'Production', icon: '📊' },
            { id: 'pipe', label: 'Orders', icon: '🚛' },
            { id: 'reps', label: 'Reports', icon: '📅' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 text-[8.5px] font-bold tracking-wider transition ${activeTab === tab.id ? 'text-orange-500 scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span>{tab.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
