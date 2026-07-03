import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Key, Users, HelpCircle, Activity, RotateCcw, 
  Sparkles, Check, AlertTriangle, HelpCircle as HelpIcon, Lock
} from 'lucide-react';
import { OfficeUser, Item, Driver, Production, Stop, Quote, DailyProduction, ReportDay, ActivityLog } from './types';
import { 
  INITIAL_OFFICE_USERS, DRIVER_LOGIN, ROLES, ADD_ROLES, TRUCK_SIZES,
  INITIAL_DRIVERS, INITIAL_ITEMS, INITIAL_PROD, INITIAL_STOPS,
  INITIAL_QUOTES, INITIAL_DAILY_PRODUCTIONS, INITIAL_REPORTS_DATA,
  INITIAL_ACTIVITY_LOGS
} from './data';
import OfficeApp from './components/OfficeApp';
import DriverApp from './components/DriverApp';

export default function App() {
  // --- Centralized States & LocalStorage Syncing ---
  const [officeUsers, setOfficeUsers] = useState<OfficeUser[]>(() => {
    const migrated = localStorage.getItem('superpatch_db_v6_migrated');
    if (!migrated) {
      localStorage.setItem('superpatch_db_v6_migrated', 'true');
      localStorage.setItem('superpatch_office_users', JSON.stringify(INITIAL_OFFICE_USERS));
      localStorage.setItem('superpatch_drivers', JSON.stringify([]));
      sessionStorage.removeItem('superpatch_active_session');
      return INITIAL_OFFICE_USERS;
    }
    const saved = localStorage.getItem('superpatch_office_users');
    return saved ? JSON.parse(saved) : INITIAL_OFFICE_USERS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('superpatch_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('superpatch_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [production, setProduction] = useState<Production>(() => {
    const saved = localStorage.getItem('superpatch_production');
    return saved ? JSON.parse(saved) : INITIAL_PROD;
  });

  const [stops, setStops] = useState<Stop[]>(() => {
    const saved = localStorage.getItem('superpatch_stops');
    return saved ? JSON.parse(saved) : INITIAL_STOPS;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('superpatch_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [dailyProductions, setDailyProductions] = useState<DailyProduction[]>(() => {
    const saved = localStorage.getItem('superpatch_daily_productions');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PRODUCTIONS;
  });

  const [reportsData, setReportsData] = useState<ReportDay[]>(() => {
    const saved = localStorage.getItem('superpatch_reports_data');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS_DATA;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('superpatch_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Current session states
  const [activeUser, setActiveUser] = useState<OfficeUser | Driver | 'driver' | null>(() => {
    const saved = sessionStorage.getItem('superpatch_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [officeTab, setOfficeTab] = useState<string>('home');

  // Login form inputs
  const [loginType, setLoginType] = useState<'staff' | 'driver'>('staff');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Toast notification state
  interface Toast { id: string; message: string; isError?: boolean }
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('superpatch_office_users', JSON.stringify(officeUsers));
  }, [officeUsers]);

  useEffect(() => {
    localStorage.setItem('superpatch_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('superpatch_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('superpatch_production', JSON.stringify(production));
  }, [production]);

  useEffect(() => {
    localStorage.setItem('superpatch_stops', JSON.stringify(stops));
  }, [stops]);

  useEffect(() => {
    localStorage.setItem('superpatch_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('superpatch_daily_productions', JSON.stringify(dailyProductions));
  }, [dailyProductions]);

  useEffect(() => {
    localStorage.setItem('superpatch_reports_data', JSON.stringify(reportsData));
  }, [reportsData]);

  useEffect(() => {
    localStorage.setItem('superpatch_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Toast handler
  const addToast = (message: string, isError: boolean = false) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, isError }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // --- User Registration / Signup Flow States ---
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signUpType, setSignUpType] = useState<'office' | 'driver'>('office');
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPass, setSignUpPass] = useState<string>('');
  const [signUpRole, setSignUpRole] = useState<string>('Plant Manager');
  const [signUpPlate, setSignUpPlate] = useState<string>('');
  const [signUpTruck, setSignUpTruck] = useState<string>('34t Horse & Trailer');
  const [signUpError, setSignUpError] = useState<string>('');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    const name = signUpName.trim();
    if (!name) {
      setSignUpError("Full name is required.");
      return;
    }

    if (signUpType === 'office') {
      const email = signUpEmail.trim().toLowerCase();
      const pass = signUpPass.trim();

      if (!email || !pass) {
        setSignUpError("Email and password are required.");
        return;
      }

      if (pass.length < 4) {
        setSignUpError("Password must be at least 4 characters.");
        return;
      }

      if (officeUsers.some(u => u.email.toLowerCase() === email)) {
        setSignUpError("This email address is already in use.");
        return;
      }

      // Add new office personnel
      const newUser: OfficeUser = { email, pass, name, role: signUpRole };
      setOfficeUsers(prev => [...prev, newUser]);
      addToast(`Account for ${name} registered successfully!`);
      
      // Auto-fill and switch back to sign-in
      setEmailInput(email);
      setPasswordInput(pass);
      setAuthMode('signin');
      
      // Reset inputs
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPass('');
      setSignUpRole('Plant Manager');
    } else {
      const plate = signUpPlate.trim().toUpperCase();
      if (!plate) {
        setSignUpError("Vehicle plate number is required.");
        return;
      }

      if (drivers.some(d => d.plate.toUpperCase() === plate)) {
        setSignUpError("This plate is already registered.");
        return;
      }

      // Add new driver
      const newDriver: Driver = { name, plate, truck: signUpTruck };
      setDrivers(prev => [...prev, newDriver]);
      addToast(`Driver profile for ${name} registered successfully!`);

      // Fill shared credentials to simplify login path
      setEmailInput(DRIVER_LOGIN.email);
      setPasswordInput(DRIVER_LOGIN.pass);
      setAuthMode('signin');

      // Reset inputs
      setSignUpName('');
      setSignUpPlate('');
      setSignUpTruck('34t Horse & Trailer');
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (loginType === 'driver') {
      const phone = phoneInput.trim();
      if (!phone) {
        setLoginError("Please enter your registered mobile number.");
        return;
      }
      const matchedDriver = drivers.find(
        d => d.phone && d.phone.replace(/[\s\-\+]+/g, '') === phone.replace(/[\s\-\+]+/g, '')
      );
      if (matchedDriver) {
        setActiveUser(matchedDriver);
        sessionStorage.setItem('superpatch_active_session', JSON.stringify(matchedDriver));
        addToast(`Driver ${matchedDriver.name} authenticated successfully`);
        return;
      }
      setLoginError("Mobile number not registered. Please contact Plant Administrator to register your profile.");
      addToast("Driver authentication failed", true);
      return;
    }

    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      setLoginError("Please enter both email/username and password.");
      return;
    }

    // Check office users
    const matchedOffice = officeUsers.find(
      u => u.email.toLowerCase() === email && u.pass === password
    );

    if (matchedOffice) {
      setActiveUser(matchedOffice);
      sessionStorage.setItem('superpatch_active_session', JSON.stringify(matchedOffice));
      addToast(`Logged in successfully as ${matchedOffice.name}`);
      return;
    }

    // Check shared driver login
    if (
      (email === DRIVER_LOGIN.email || email === DRIVER_LOGIN.email + ".co.za") &&
      password === DRIVER_LOGIN.pass
    ) {
      setActiveUser('driver');
      sessionStorage.setItem('superpatch_active_session', JSON.stringify('driver'));
      addToast("Signed into Shared Driver Fleet profile");
      return;
    }

    setLoginError("Invalid credentials. Please verify details and try again.");
    addToast("Login authentication failed", true);
  };

  const handleLogout = () => {
    if (activeUser) {
      if (activeUser === 'driver' || 'plate' in activeUser) {
        setLoginType('driver');
      } else {
        setLoginType('staff');
      }
    }
    setActiveUser(null);
    sessionStorage.removeItem('superpatch_active_session');
    setEmailInput('');
    setPasswordInput('');
    addToast("Logged out of Superpatch console");
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900 flex flex-col font-sans overflow-x-hidden antialiased select-none relative">
      
      {/* Background subtle light gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/3 blur-[140px] pointer-events-none -z-10"></div>
 
      {/* Responsive Viewport Wrapper */}
      <div className="flex-1 w-full max-w-[1300px] mx-auto flex flex-col md:p-6">
        {/* Main interactive window */}
        <div className="flex-1 min-h-0 relative bg-white md:rounded-3xl md:border md:border-zinc-200 md:shadow-[0_20px_50px_rgba(24,24,27,0.08)] flex flex-col overflow-hidden">
          
          <AnimatePresence mode="wait">
            {activeUser === null ? (
              // AUTH PORTAL (Login & Signup View)
              <motion.div 
                key={authMode}
                initial={{ opacity: 0, x: authMode === 'signin' ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: authMode === 'signin' ? 15 : -15 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col justify-between px-6 py-6 bg-white max-w-md mx-auto w-full"
              >
                    <div>
                      {/* Brand Header */}
                      <div className="mb-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-xl relative shadow-[0_4px_20px_rgba(249,115,22,0.15)]">
                          S
                          <div className="absolute inset-1 border border-dashed border-white/20 rounded-xl"></div>
                        </div>
                        <h1 className="text-lg font-black text-zinc-900 mt-2.5 tracking-wider uppercase font-display">SUPERPATCH</h1>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                          Manufacturing &amp; Logistics
                        </p>
                      </div>
 
                      {/* Secure Portal Sign In Header - Only admins can register accounts */}
                      <div className="mb-4">
                        {/* Selector Tab */}
                        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginType('staff');
                              setLoginError('');
                            }}
                            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition ${loginType === 'staff' ? 'bg-white text-zinc-950 shadow font-black border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-850'}`}
                          >
                            OFFICE STAFF
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLoginType('driver');
                              setLoginError('');
                            }}
                            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition ${loginType === 'driver' ? 'bg-white text-zinc-950 shadow font-black border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-850'}`}
                          >
                            FLEET DRIVER
                          </button>
                        </div>

                        <div className="text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-full text-[9px] font-bold uppercase tracking-wider">
                            <Lock size={10} className="stroke-[2.5]" />
                            <span>{loginType === 'staff' ? 'Personnel Sign-In' : 'Driver Mobile Sign-In'}</span>
                          </div>
                        </div>
                      </div>

                      {/* --- SIGN IN PORTAL FORM --- */}
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {loginType === 'staff' ? (
                          <>
                            <div>
                              <label className="text-[8.5px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                                EMAIL OR USERNAME
                              </label>
                              <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="e.g. lee@pascal.co.za"
                                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-900 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition font-sans placeholder-zinc-400"
                              />
                            </div>

                            <div>
                              <label className="text-[8.5px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                                PASSWORD
                              </label>
                              <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-900 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition font-sans placeholder-zinc-400"
                              />
                            </div>
                          </>
                        ) : (
                          <div>
                            <label className="text-[8.5px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                              REGISTERED MOBILE NUMBER
                            </label>
                            <input
                              type="text"
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                              placeholder="e.g. 0821112222"
                              className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-900 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition font-sans placeholder-zinc-400 font-mono text-center tracking-wider"
                            />
                            <p className="text-[8.5px] text-zinc-400 text-center leading-normal mt-2 italic">
                              Input the mobile number registered to your profile by the administrator to access your delivery app.
                            </p>
                          </div>
                        )}

                        {loginError && (
                          <div className="text-[9px] font-bold text-rose-600 text-center py-0.5">
                            {loginError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:translate-y-0.5 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/15"
                        >
                          Sign In Portal
                        </button>
                      </form>


                    </div>
                  </motion.div>
                ) : (activeUser === 'driver' || (activeUser && 'plate' in activeUser)) ? (
                  // DRIVER VIEWS inside Phone
                  <motion.div 
                    key="driver-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-white text-zinc-900"
                  >
                    <DriverApp 
                      drivers={drivers}
                      stops={stops}
                      setStops={setStops}
                      onLogout={handleLogout}
                      addToast={addToast}
                      loggedInDriver={activeUser && 'plate' in activeUser ? activeUser : undefined}
                    />
                  </motion.div>
                ) : (
                  // OFFICE VIEWS inside Phone
                  <motion.div 
                    key="office-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-white text-zinc-900"
                  >
                    <OfficeApp 
                      user={activeUser}
                      items={items}
                      setItems={setItems}
                      production={production}
                      setProduction={setProduction}
                      officeUsers={officeUsers}
                      setOfficeUsers={setOfficeUsers}
                      drivers={drivers}
                      setDrivers={setDrivers}
                      stops={stops}
                      setStops={setStops}
                      quotes={quotes}
                      setQuotes={setQuotes}
                      dailyProductions={dailyProductions}
                      setDailyProductions={setDailyProductions}
                      reportsData={reportsData}
                      setReportsData={setReportsData}
                      activityLogs={activityLogs}
                      setActivityLogs={setActivityLogs}
                      activeTab={officeTab}
                      setActiveTab={setOfficeTab}
                      onLogout={handleLogout}
                      addToast={addToast}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
 
              {/* Toast Notification Container */}
              <div className="fixed bottom-6 right-6 md:w-80 w-auto left-6 md:left-auto z-50 pointer-events-none space-y-2">
                <AnimatePresence>
                  {toasts.map(t => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      className={`p-3 rounded-xl border flex gap-2.5 items-center bg-white text-zinc-900 shadow-xl pointer-events-auto ${t.isError ? 'border-rose-200 bg-rose-50' : 'border-zinc-200 bg-zinc-50'}`}
                    >
                      <div className={`p-1 rounded flex-none ${t.isError ? 'text-rose-600 bg-rose-100' : 'text-orange-600 bg-orange-100'}`}>
                        {t.isError ? <AlertTriangle size={12} /> : <Check size={12} />}
                      </div>
                      <span className="text-[10px] font-extrabold leading-normal">{t.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
        </div>
      </div>
    </div>
  );
}
