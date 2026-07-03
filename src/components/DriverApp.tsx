import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, MapPin, Map, Phone, Camera, Check, RotateCcw, 
  AlertTriangle, ArrowLeft, Wifi, WifiOff, Users, ChevronRight, FileText,
  LogOut
} from 'lucide-react';
import { Driver, Stop } from '../types';

interface DriverAppProps {
  drivers: Driver[];
  stops: Stop[];
  setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
  onLogout: () => void;
  addToast: (message: string, isError?: boolean) => void;
  loggedInDriver?: Driver;
}

const MAP_POINTS = [[40, 135], [120, 95], [200, 110], [300, 55]];

export default function DriverApp({
  drivers,
  stops,
  setStops,
  onLogout,
  addToast,
  loggedInDriver
}: DriverAppProps) {
  const [selectedDriverIdx, setSelectedDriverIdx] = useState<number | null>(() => {
    if (loggedInDriver) {
      const idx = drivers.findIndex(d => d.plate === loggedInDriver.plate);
      return idx !== -1 ? idx : null;
    }
    return null;
  });
  const [activeSubTab, setActiveSubTab] = useState<'route' | 'map' | 'help' | 'stop' | 'proof'>('route');
  const [selectedStopIdx, setSelectedStopIdx] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queuedDeliveries, setQueuedDeliveries] = useState<number>(0);
  const [hasNewRouteNotification, setHasNewRouteNotification] = useState<boolean>(true);
  
  // Real-time tracking and push-notification states
  const [activeNotification, setActiveNotification] = useState<{ title: string; body: string } | null>(null);
  const [simLocation, setSimLocation] = useState<{ x: number; y: number } | null>(null);
  const prevStopsCount = useRef<number | null>(null);
  
  // Proof of delivery state
  const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);
  const [signatureCaptured, setSignatureCaptured] = useState<boolean>(false);
  
  // Call simulation overlay state
  const [simulatedCallName, setSimulatedCallName] = useState<string | null>(null);

  // Canvas drawing reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const activeDriver = selectedDriverIdx !== null ? drivers[selectedDriverIdx] : null;

  // Filter stops to only those assigned to the current active driver (by vehicle plate)
  const driverStops = activeDriver 
    ? stops.filter(s => s.assignedDriverPlate === activeDriver.plate)
    : [];

  // Active status color helper
  const getPillConfig = (st: Stop['st']) => {
    switch (st) {
      case 'todo': return { label: 'TO DO', class: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
      case 'route': return { label: 'EN ROUTE', class: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      case 'site': return { label: 'AT SITE', class: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      case 'done': return { label: 'DELIVERED', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' };
    }
  };

  const getTotalBags = () => driverStops.reduce((sum, s) => sum + s.bags, 0);
  const getCompletedStopsCount = () => driverStops.filter(s => s.st === 'done').length;

  const handleToggleOnline = () => {
    const nextVal = !isOnline;
    setIsOnline(nextVal);
    if (nextVal && queuedDeliveries > 0) {
      addToast(`Connected to network: Synced ${queuedDeliveries} delivery log(s) to office & notified customer via automated SMS.`);
      setQueuedDeliveries(0);
    } else {
      addToast(nextVal ? "You are now ONLINE. GPS feed active." : "You are offline. Deliveries will be stored locally.");
    }
  };

  const handleSelectDriver = (idx: number) => {
    setSelectedDriverIdx(idx);
    setActiveSubTab('route');
    setHasNewRouteNotification(true);
    // Reset all stops to todo
    setStops(prev => prev.map(s => ({ ...s, st: 'todo' })));
    setQueuedDeliveries(0);
    setPhotoCaptured(false);
    setSignatureCaptured(false);
  };

  const handleStopAction = (idx: number, status: Stop['st']) => {
    const targetStop = driverStops[idx];
    if (!targetStop) return;

    setStops(prev => prev.map(s => s.nm === targetStop.nm ? { ...s, st: status } : s));

    if (status === 'route') {
      addToast(`On route to ${targetStop.nm.split(/[—,]/)[0].trim()}. GPS live to dispatcher.`);
    } else if (status === 'site') {
      addToast(`Arrived at ${targetStop.nm.split(/[—,]/)[0].trim()}. Dispatch team notified.`);
    }
  };

  // Canvas Drawing logic
  useEffect(() => {
    if (activeSubTab === 'proof' && canvasRef.current) {
      const canvas = canvasRef.current;
      // High-res retina settings
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = '#FFFFFF'; // White ink on dark background for contrast
        context.lineWidth = 3;
        contextRef.current = context;
      }
    }
  }, [activeSubTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!contextRef.current || !canvasRef.current) return;
    isDrawing.current = true;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setSignatureCaptured(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignatureCaptured(false);
  };

  const handleCapturePhoto = () => {
    setPhotoCaptured(true);
    addToast("Camera active: 25kg Bags captured, GPS location & timestamp overlaid.");
  };

  const handleConfirmDelivery = () => {
    const targetStop = driverStops[selectedStopIdx];
    if (!targetStop) return;

    setStops(prev => prev.map(s => s.nm === targetStop.nm ? { ...s, st: 'done' } : s));

    if (!isOnline) {
      setQueuedDeliveries(prev => prev + 1);
      addToast("Delivery marked done locally. Log queued for next internet signal.", false);
    } else {
      addToast("✓ Delivery uploaded. Electronic delivery note sent to client.", false);
    }

    // Reset proof capturing states
    setPhotoCaptured(false);
    setSignatureCaptured(false);

    // Direct back to route selection screen
    setTimeout(() => {
      setActiveSubTab('route');
    }, 300);
  };

  // Real-time location simulation loop (animates truck along coordinates when en-route)
  useEffect(() => {
    const activeIdx = driverStops.findIndex(s => s.st === 'route');
    if (activeIdx !== -1) {
      const startPoint = activeIdx > 0 ? MAP_POINTS[activeIdx - 1] : [170, 150];
      const endPoint = MAP_POINTS[activeIdx] || MAP_POINTS[0];
      
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        const progress = (step % 20) / 20;
        const x = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
        const y = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;
        setSimLocation({ x, y });
      }, 800);

      return () => clearInterval(interval);
    } else {
      setSimLocation(null);
    }
  }, [stops, activeSubTab, driverStops.length]);

  // Real-time push notification handler when new drops are assigned
  useEffect(() => {
    if (activeDriver) {
      if (prevStopsCount.current !== null && driverStops.length > prevStopsCount.current) {
        const newestStop = driverStops[driverStops.length - 1];
        if (newestStop) {
          setActiveNotification({
            title: "New Delivery Assigned 🚚",
            body: `${newestStop.bags} bags to ${newestStop.nm.split(/[—,]/)[0].trim()}`
          });
          setHasNewRouteNotification(true);
          addToast(`🔔 NEW ASSIGNMENT: ${newestStop.bags} bags to ${newestStop.nm.split(/[—,]/)[0].trim()}`);
        }
      }
      prevStopsCount.current = driverStops.length;
    }
  }, [driverStops.length, activeDriver]);

  // Auto-clear active notification after 5 seconds
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  const triggerSimulatedCall = (name: string) => {
    setSimulatedCallName(name);
  };

  // High-contrast custom SVG Map layout with road node paths
  const renderInteractiveMap = (activeIdx: number) => {
    return (
      <div className="relative h-44 rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#0e130e] group">
        <svg viewBox="0 0 340 170" className="w-full h-full">
          {/* Horizontal Grid Roads */}
          {[30, 70, 110, 150].map((y, idx) => (
            <line key={idx} x1="0" y1={y} x2="340" y2={y} stroke="#1b251b" strokeWidth={1} />
          ))}
          {/* Vertical Grid Roads */}
          {[70, 140, 210, 280].map((x, idx) => (
            <line key={idx} x1={x} y1="0" x2={x} y2="170" stroke="#1b251b" strokeWidth={1} />
          ))}

          {/* Dotted Route Connection Track */}
          <path 
            d={MAP_POINTS.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ')} 
            stroke="#F97316" 
            strokeWidth={2} 
            fill="none" 
            strokeDasharray="4 6" 
            className="opacity-70"
          />

          {/* Point markers */}
          {MAP_POINTS.map((p, i) => {
            const stopState = driverStops[i]?.st || 'todo';
            const isTarget = i === activeIdx;
            
            let color = '#52525b'; // default gray todo
            if (stopState === 'done') color = '#10B981'; // emerald green done
            else if (isTarget) color = '#F97316'; // orange active

            return (
              <g key={i}>
                {isTarget && (
                  <circle cx={p[0]} cy={p[1]} r={11} fill="#F97316" className="animate-ping opacity-35" />
                )}
                <circle 
                  cx={p[0]} 
                  cy={p[1]} 
                  r={isTarget ? 8 : 6} 
                  fill={color} 
                  stroke="#000000" 
                  strokeWidth={2} 
                />
                <text 
                  x={p[0]} 
                  y={p[1] + 3.5} 
                  fontSize="8" 
                  fontWeight="bold" 
                  fill="#000000" 
                  textAnchor="middle"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Real-time Truck Live Marker */}
          {simLocation && (
            <g>
              <circle cx={simLocation.x} cy={simLocation.y} r={14} fill="#F97316" className="animate-ping opacity-25" />
              <rect x={simLocation.x - 7} y={simLocation.y - 7} width={14} height={14} rx={3} fill="#F97316" stroke="#000000" strokeWidth={1.5} />
              <text x={simLocation.x} y={simLocation.y + 3} fontSize="8" fontWeight="black" fill="#000000" textAnchor="middle">🚚</text>
              <g className="opacity-90">
                <rect x={simLocation.x - 28} y={simLocation.y - 18} width={56} height={9} rx={2} fill="#000000" stroke="#F97316" strokeWidth={0.5} />
                <text x={simLocation.x} y={simLocation.y - 11} fontSize="6" fontWeight="bold" fill="#F97316" textAnchor="middle" className="font-mono">LIVE TRACKING</text>
              </g>
            </g>
          )}
        </svg>

        {/* Floating location tag */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-zinc-800 text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
          Krugersdorp · Dispatch Tracking
        </div>
      </div>
    );
  };

  if (activeDriver === null) {
    return (
      <div className="flex-1 flex flex-col justify-center p-6 bg-black">
        <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center text-black mb-4">
          <Truck size={22} />
        </div>
        <h1 className="text-xl font-extrabold text-white">Who is driving today?</h1>
        <p className="text-xs text-zinc-400 mt-1 mb-6">Select your profile to initialize route manifests & logs.</p>
        
        <div className="space-y-3">
          {drivers.length === 0 ? (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-center space-y-2">
              <span className="text-xs text-zinc-500 block">No fleet drivers registered yet.</span>
              <span className="text-[10px] text-zinc-600 block">Please go to the signup screen and register a driver profile to log in.</span>
            </div>
          ) : (
            drivers.map((d, idx) => (
              <button
                key={d.plate}
                onClick={() => handleSelectDriver(idx)}
                className="w-full bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-2xl flex items-center justify-between text-left transition active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center text-orange-400 font-extrabold text-xs border border-zinc-800">
                    {d.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{d.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{d.plate}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/5 px-2 py-1 rounded border border-orange-500/10 font-mono">
                  {d.truck}
                </span>
              </button>
            ))
          )}
        </div>

        <button 
          onClick={onLogout}
          className="mt-6 text-xs text-zinc-500 hover:text-white flex items-center gap-2 self-start transition py-2"
        >
          <ArrowLeft size={14} /> Back to standard portal
        </button>
      </div>
    );
  }

  // Driver Layout once logged in
  const driverInitials = activeDriver.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Real-time Push Notification banner on mobile device */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-4 left-4 right-4 z-50 bg-orange-600 text-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(234,88,12,0.3)] border border-orange-500 flex gap-3 items-start cursor-pointer"
            onClick={() => {
              setActiveNotification(null);
              setActiveSubTab('route');
            }}
          >
            <div className="p-2 bg-black/20 rounded-xl">
              <Truck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black leading-none">{activeNotification.title}</h4>
              <p className="text-[11px] text-orange-100 mt-1 leading-normal font-medium">{activeNotification.body}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveNotification(null); }}
              className="text-orange-200 hover:text-white font-black text-xs p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Driver Bar */}
      <div className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/20 backdrop-blur">
        <div 
          onClick={onLogout}
          className="flex items-center gap-3 cursor-pointer group"
          title="Log Out Driver Portal"
        >
          <div className="w-9 h-9 rounded-full bg-orange-500 text-black font-extrabold text-xs flex items-center justify-center group-hover:scale-105 transition-transform">
            {driverInitials}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-none flex items-center gap-1">
              {activeDriver.name}
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
              {activeDriver.plate} · {activeDriver.truck}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connectivity simulator button */}
          <button
            onClick={handleToggleOnline}
            className={`px-2.5 py-1.5 rounded-full border text-[9px] font-black tracking-widest font-mono flex items-center gap-2 transition ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20 animate-pulse'}`}
          >
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isOnline ? "ONLINE" : `OFFLINE (${queuedDeliveries})`}</span>
          </button>

          {/* Log Out button */}
          <button
            onClick={onLogout}
            id="driver-logout-btn"
            className="p-2 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 rounded-xl transition flex items-center gap-1 text-[11px] font-bold"
            title="Log Out Driver Portal"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Screen area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeSubTab === 'route' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {hasNewRouteNotification && (
              <div className="bg-orange-500/10 border border-orange-500/25 p-3.5 mx-4 mt-4 rounded-2xl flex gap-3.5 items-start relative overflow-hidden">
                <div className="p-2 bg-orange-500 text-black rounded-lg flex-none mt-0.5">
                  <FileText size={16} />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="text-xs font-bold text-white">New Route Manifest Assigned</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                    {driverStops.length} unloading drops · {getTotalBags()} bags ({Math.round(getTotalBags() * 0.025 * 10) / 10} t) · Krugersdorp Depot Dispatch
                  </p>
                </div>
                <button 
                  onClick={() => setHasNewRouteNotification(false)}
                  className="absolute top-2.5 right-3.5 text-zinc-500 hover:text-white font-extrabold text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="px-4 pt-4">
              <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-1 mb-2 font-mono">Today's Performance</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-white font-mono">{driverStops.length}</span>
                  <span className="text-[8px] text-zinc-500 font-bold block uppercase tracking-widest mt-1"> drops</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-center flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-orange-500 font-mono leading-none">{getTotalBags()}</span>
                  <span className="text-[9px] font-mono text-zinc-400 mt-1.5 leading-none">({Math.round(getTotalBags() * 0.025 * 10) / 10} t)</span>
                  <span className="text-[8px] text-zinc-500 font-bold block uppercase tracking-widest mt-1"> bags</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">{getCompletedStopsCount()}</span>
                  <span className="text-[8px] text-zinc-500 font-bold block uppercase tracking-widest mt-1"> done</span>
                </div>
              </div>
            </div>

            {/* Stops lists */}
            <div className="px-4 space-y-2.5">
              <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Delivery Nodes Queue</h2>
              {driverStops.map((s, idx) => {
                const isCurrent = s.st !== 'done' && driverStops.slice(0, idx).every(p => p.st === 'done');
                const pill = getPillConfig(s.st);

                return (
                  <div
                    key={s.nm}
                    onClick={() => {
                      setSelectedStopIdx(idx);
                      setActiveSubTab('stop');
                    }}
                    className={`bg-zinc-900 border p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-zinc-900/85 transition active:scale-[0.99] ${s.st === 'done' ? 'opacity-55 border-zinc-850' : isCurrent ? 'border-orange-500/80 shadow-[0_4px_16px_rgba(249,115,22,0.08)]' : 'border-zinc-800'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg font-mono font-extrabold text-xs flex items-center justify-center flex-none ${s.st === 'done' ? 'bg-emerald-500 text-black' : isCurrent ? 'bg-orange-500 text-black' : 'bg-black text-zinc-400 border border-zinc-800'}`}>
                      {s.st === 'done' ? '✓' : idx + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{s.nm}</h4>
                      <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2">
                        <span>{s.bags} bags</span>
                        <span>•</span>
                        <span>ETA {s.eta}</span>
                      </div>
                      <span className={`inline-block text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded border mt-2 ${pill.class}`}>
                        {pill.label}
                      </span>
                    </div>

                    <ChevronRight size={16} className="text-zinc-500 flex-none" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'stop' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 space-y-4">
            <button 
              onClick={() => setActiveSubTab('route')}
              className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1 font-bold py-1"
            >
              ‹ Back to list
            </button>

            {(() => {
              const s = driverStops[selectedStopIdx];
              if (!s) return <p className="text-xs text-zinc-500 p-4">No active delivery node selected.</p>;
              return (
                <>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-white">{s.nm}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{s.addr}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">MANIFESTED LOAD</span>
                        <span className="text-sm font-extrabold text-orange-500 font-mono mt-0.5 block">{s.bags} Sacks</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">ETA TIMING</span>
                        <span className="text-sm font-extrabold text-zinc-200 font-mono mt-0.5 block">{s.eta}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">CLIENT TYPE</span>
                        <span className="text-xs font-bold text-zinc-200 mt-1 block truncate">{s.type}</span>
                      </div>
                    </div>
                  </div>

                  {renderInteractiveMap(selectedStopIdx)}

                  <div className="space-y-2.5 pt-1">
                    {s.st === 'todo' && (
                      <button
                        onClick={() => handleStopAction(selectedStopIdx, 'route')}
                        className="w-full py-4 rounded-xl bg-orange-500 text-black font-extrabold text-sm shadow-lg shadow-orange-500/10 active:translate-y-0.5 transition"
                      >
                        ▶ Start transit to location
                      </button>
                    )}
                    {s.st === 'route' && (
                      <button
                        onClick={() => handleStopAction(selectedStopIdx, 'site')}
                        className="w-full py-4 rounded-xl bg-teal-500 text-black font-extrabold text-sm active:translate-y-0.5 transition"
                      >
                        📍 Log site arrival (GPS lock)
                      </button>
                    )}
                    {s.st === 'site' && (
                      <button
                        onClick={() => {
                          setPhotoCaptured(false);
                          setSignatureCaptured(false);
                          setActiveSubTab('proof');
                        }}
                        className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-sm active:translate-y-0.5 transition"
                      >
                        📷 Proceed to capture POD proof
                      </button>
                    )}
                    {s.st === 'done' && (
                      <button
                        disabled
                        className="w-full py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-2"
                      >
                        ✓ Consignment successfully stowed
                      </button>
                    )}

                    <button
                      onClick={() => triggerSimulatedCall('Plant Supervisor — J. Mathye')}
                      className="w-full py-3.5 border border-rose-500/10 hover:border-rose-500/20 bg-rose-500/5 text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <AlertTriangle size={14} /> One-Tap Emergency Call Plant
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

        {activeSubTab === 'proof' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
            <button 
              onClick={() => setActiveSubTab('stop')}
              className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1 font-bold py-1"
            >
              ‹ Back to stop detail
            </button>

            <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Proof Of Delivery Captures</h2>

            <div className="space-y-4">
              {/* Photo component */}
              <div>
                <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block mb-1.5">Consignment Photo</label>
                {!photoCaptured ? (
                  <div 
                    onClick={handleCapturePhoto}
                    className="h-36 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 cursor-pointer transition"
                  >
                    <Camera size={24} className="mb-2" />
                    <span className="text-[10px] font-bold">Tap to capture the delivered bags on-site</span>
                  </div>
                ) : (
                  <div className="h-36 rounded-2xl overflow-hidden border border-zinc-800 relative bg-[#241c14] flex flex-col justify-center items-center">
                    {/* Simulated stacked bag stack drawing inside responsive SVG */}
                    <svg viewBox="0 0 356 160" className="w-full h-full opacity-90">
                      <rect width="356" height="160" fill="#1c1611" />
                      {/* Drawing 4 rows of stacked bags */}
                      <g fill="#EA580C" stroke="#000000" strokeWidth="1.5">
                        <rect x="78" y="110" width="90" height="26" rx="4" />
                        <rect x="188" y="110" width="90" height="26" rx="4" />
                        <rect x="133" y="80" width="90" height="26" rx="4" />
                        <rect x="133" y="50" width="90" height="26" rx="4" />
                      </g>
                      <text x="178" y="148" fill="#a1a1aa" fontSize="10" fontWeight="bold" textAnchor="middle">
                        SUPERPATCH Dry Sacks (25kg standard load)
                      </text>
                    </svg>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/80 px-2 py-1 rounded border border-zinc-800 font-mono text-[8px] text-zinc-300 leading-normal">
                      GPS coordinates: {driverStops[selectedStopIdx]?.gps || "-26.178, 27.812"}<br />
                      Timestamp: {new Date().toLocaleTimeString()} (GPS verified)
                    </div>
                  </div>
                )}
              </div>

              {/* Signature Capture Canvas */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase">Customer / Agent Signature</label>
                  <button 
                    onClick={clearSignature}
                    className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1"
                  >
                    <RotateCcw size={10} /> Clear canvas
                  </button>
                </div>
                <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 block touch-none cursor-crosshair"
                  />
                </div>
              </div>

              <div className="text-[9px] text-zinc-500 text-center leading-normal">
                All coordinates are hardware logged. Digital receipt with copies of files will generate instantly.
              </div>

              <button
                onClick={handleConfirmDelivery}
                disabled={!(photoCaptured && signatureCaptured)}
                className="w-full py-4 rounded-xl bg-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border disabled:border-zinc-800 text-black font-extrabold text-sm transition"
              >
                Confirm Delivery Completion
              </button>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'map' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Live Transit Mapping</h2>
            {renderInteractiveMap(driverStops.findIndex(s => s.st !== 'done'))}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 divide-y divide-zinc-800/80">
              {driverStops.map((s, i) => (
                <div key={s.nm} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <span className="text-xs font-bold text-zinc-200">{i+1}. {s.nm.split(" — ")[0]}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{s.gps}</span>
                  </div>
                  <span className={`text-[8px] font-black tracking-wider px-2 py-0.5 rounded border ${getPillConfig(s.st).class}`}>
                    {getPillConfig(s.st).label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'help' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-1 font-mono">Contact Hotlines</h2>

            <div className="space-y-3">
              {[
                { name: "Jabu Mathye (Plant Supervisor)", tel: "082 000 0000", badge: "PLANT", color: "text-orange-500 hover:border-orange-500/20 hover:bg-orange-500/5" },
                { name: "Krugersdorp Dispatch", tel: "011 000 0000", badge: "OFFICE", color: "text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900" },
                { name: "Breakdown Logistics & Towing", tel: "083 000 0000", badge: "TOW", color: "text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900" },
                { name: "Emergency Line", tel: "112", badge: "CRITICAL", color: "text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5" },
              ].map(c => (
                <div
                  key={c.name}
                  onClick={() => triggerSimulatedCall(c.name)}
                  className={`bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition ${c.color}`}
                >
                  <div>
                    <span className="text-xs font-bold">{c.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">{c.tel}</span>
                  </div>
                  <Phone size={16} />
                </div>
              ))}
            </div>

            <div className="text-[10px] text-zinc-500 leading-normal text-center bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
              Emergency contacts are coded to initiate calls even when fully offline. Transit coordinates cache locally and upload once you re-enter signal zones.
            </div>
          </motion.div>
        )}
      </div>

      {/* Simulated calling overlay */}
      <AnimatePresence>
        {simulatedCallName !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-8 text-center"
          >
            <div className="pt-16">
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase block mb-2">DIALING SIMULATOR</span>
              <h2 className="text-xl font-extrabold text-white">{simulatedCallName}</h2>
              <span className="text-xs text-orange-500 animate-pulse font-mono block mt-2">Connecting VoIP Hotkey...</span>
            </div>

            {/* Ripple effect call widget */}
            <div className="flex justify-center my-auto">
              <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-black flex items-center justify-center">
                  <Phone size={24} className="animate-bounce" />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setSimulatedCallName(null)}
                className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 font-extrabold text-xs text-white uppercase tracking-wider"
              >
                End Simulation Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Footer tabs */}
      {activeSubTab !== 'stop' && activeSubTab !== 'proof' && (
        <div className="absolute bottom-0 inset-x-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 h-20 flex px-2 z-30">
          {[
            { id: 'route', label: 'Route', icon: '📋' },
            { id: 'map', label: 'Map', icon: '🗺️' },
            { id: 'help', label: 'Help', icon: '☎️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold tracking-wider transition ${activeSubTab === tab.id ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span>{tab.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
