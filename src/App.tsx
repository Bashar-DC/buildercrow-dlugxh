import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowUpRight, 
  Wallet, 
  Coins, 
  DollarSign, 
  RefreshCw, 
  Newspaper, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Flame, 
  Info, 
  ArrowRightLeft, 
  Bell, 
  Share2, 
  ShieldCheck, 
  Zap,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Mock Coins Database
const INITIAL_COINS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 64250.00, change24h: 2.45, volume: '28.4B', marketCap: '1.26T', color: '#F7931A', history: [63100, 63400, 63200, 63800, 64100, 64250] },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3450.25, change24h: -1.12, volume: '15.2B', marketCap: '414.8B', color: '#627EEA', history: [3520, 3500, 3480, 3430, 3440, 3450.25] },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 145.80, change24h: 5.82, volume: '3.8B', marketCap: '67.2B', color: '#14F195', history: [135, 138, 141, 140, 143, 145.80] },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 575.40, change24h: 0.28, volume: '1.2B', marketCap: '84.6B', color: '#F3BA2F', history: [572, 574, 573, 576, 574, 575.40] },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.485, change24h: -2.31, volume: '380M', marketCap: '17.3B', color: '#0033AD', history: [0.501, 0.495, 0.492, 0.488, 0.489, 0.485] },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP', price: 0.582, change24h: 1.15, volume: '890M', marketCap: '32.5B', color: '#23292F', history: [0.575, 0.578, 0.571, 0.580, 0.579, 0.582] },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.124, change24h: 8.76, volume: '1.4B', marketCap: '18.0B', color: '#C2A633', history: [0.112, 0.115, 0.114, 0.120, 0.122, 0.124] },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: 6.22, change24h: -0.45, volume: '185M', marketCap: '8.9B', color: '#E6007A', history: [6.31, 6.28, 6.25, 6.20, 6.24, 6.22] },
];

// Mock News Database
const CRYPTO_NEWS = [
  { id: 1, source: 'CoinPulse', title: 'Bitcoin Holds Strong Support at $64,000 as Institutional Inflow Continues', time: '10m ago', impact: 'Bullish' },
  { id: 2, source: 'EtherWatch', title: 'Ethereum Gas Fees Drop to Multi-Year Lows Amid Layer-2 Migration', time: '1h ago', impact: 'Neutral' },
  { id: 3, source: 'Solana Daily', title: 'Solana Dex Volume Flips Mainstream Competitors in Weekly Stats', time: '3h ago', impact: 'Bullish' },
  { id: 4, source: 'BlockReport', title: 'Global Regulatory Updates Introduce New Framework for Stablecoins', time: '5h ago', impact: 'Caution' }
];

export default function App() {
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(INITIAL_COINS[0]);
  const [usdBalance, setUsdBalance] = useState(10000.00);
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({
    btc: 0.05,
    eth: 0.5,
    sol: 4.2,
    bnb: 0
  });

  // Trading Form States
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'success' | 'error' }[]>([]);

  // Simulation of Live Prices ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => 
        prevCoins.map(coin => {
          // Add small fluctuation (-1.5% to +1.6%)
          const percentChange = (Math.random() * 3.1 - 1.5) / 100;
          const newPrice = Math.max(0.001, parseFloat((coin.price * (1 + percentChange)).toFixed(coin.price < 1 ? 4 : 2)));
          const updatedHistory = [...coin.history.slice(1), newPrice];
          
          return {
            ...coin,
            price: newPrice,
            change24h: parseFloat((coin.change24h + percentChange * 100).toFixed(2)),
            history: updatedHistory
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update selected coin data in real-time when coins list updates
  useEffect(() => {
    const freshData = coins.find(c => c.id === selectedCoin.id);
    if (freshData) {
      setSelectedCoin(freshData);
    }
  }, [coins, selectedCoin.id]);

  // Helper trigger for UI notifications
  const pushNotification = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Portfolio value calculations
  const portfolioValue = useMemo(() => {
    let valueInUsd = 0;
    Object.entries(portfolio).forEach(([coinId, amount]) => {
      const coin = coins.find(c => c.id === coinId);
      if (coin) {
        valueInUsd += amount * coin.price;
      }
    });
    return valueInUsd;
  }, [portfolio, coins]);

  const totalNetWorth = usdBalance + portfolioValue;

  // Handle mock buy/sell actions
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseFloat(tradeAmount);
    if (isNaN(quantity) || quantity <= 0) {
      pushNotification('Please enter a valid quantity', 'error');
      return;
    }

    const cost = quantity * selectedCoin.price;

    if (tradeType === 'BUY') {
      if (usdBalance < cost) {
        pushNotification(`Insufficient USD balance to buy ${quantity} ${selectedCoin.symbol}`, 'error');
        return;
      }
      setUsdBalance(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [selectedCoin.id]: (prev[selectedCoin.id] || 0) + quantity
      }));
      pushNotification(`Successfully bought ${quantity.toFixed(4)} ${selectedCoin.symbol}!`, 'success');
    } else {
      const currentHolding = portfolio[selectedCoin.id] || 0;
      if (currentHolding < quantity) {
        pushNotification(`Insufficient ${selectedCoin.symbol} balance to complete sale`, 'error');
        return;
      }
      setUsdBalance(prev => prev + cost);
      setPortfolio(prev => ({
        ...prev,
        [selectedCoin.id]: Math.max(0, currentHolding - quantity)
      }));
      pushNotification(`Successfully sold ${quantity.toFixed(4)} ${selectedCoin.symbol}!`, 'success');
    }
    setTradeAmount('');
  };

  // Preset action percentages (e.g., 25%, 50%, 100%) for trade execution helper
  const handlePresetPercentage = (pct: number) => {
    if (tradeType === 'BUY') {
      const targetUsd = usdBalance * pct;
      const possibleQty = targetUsd / selectedCoin.price;
      setTradeAmount(possibleQty.toFixed(selectedCoin.price < 1 ? 4 : 5));
    } else {
      const currentHolding = portfolio[selectedCoin.id] || 0;
      setTradeAmount((currentHolding * pct).toFixed(selectedCoin.price < 1 ? 4 : 5));
    }
  };

  // Filter and Search logic for Coin List
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-lg flex items-center justify-between backdrop-blur-md ${
                notif.type === 'success' 
                  ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/95 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{notif.type === 'success' ? '⚡' : '⚠️'}</span>
                <p className="text-sm font-medium">{notif.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Coins className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                XenoCrypto
              </span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                Mock Sandbox
              </span>
            </div>
          </div>

          {/* Quick Stats Ticker */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gas Limit: <strong className="text-slate-200">22 Gwei</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <span>Market Cap: <strong className="text-slate-200">$2.41T</strong></span>
              <span className="text-emerald-400 font-semibold flex items-center"><ChevronUp className="h-3 w-3 inline" /> 1.8%</span>
            </div>
          </div>

          {/* User Portfolio Balance Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Net Worth</p>
              <p className="text-sm font-semibold text-emerald-400">
                ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-9 w-px bg-slate-800" />
            <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Wallet className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500">Available USD</p>
                <p className="text-xs font-mono font-bold text-slate-200">${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome & Dashboard Overview Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-8">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-indigo-300">
                <Flame className="h-3.5 w-3.5 text-orange-400" /> Real-time Interactive Trading Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Simulate Crypto Trading, <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Risk Free & Instantly.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl">
                Test your trading strategies with our integrated live-flushing exchange simulation. Spot trends, purchase top-tier assets, and track your virtual portfolio's ROI.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex-1 min-w-[140px]">
                  <p className="text-xs text-slate-400">Mock Wallet Value</p>
                  <p className="text-lg font-bold text-slate-100 font-mono">
                    ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    {Object.values(portfolio).reduce((a, b) => a + b, 0).toFixed(2)} active coins
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex-1 min-w-[140px]">
                  <p className="text-xs text-slate-400">Total Yield</p>
                  {/* Calculate starting portfolio yield based on initial starting budget of 10k */}
                  {(() => {
                    const diff = totalNetWorth - 10000;
                    const pct = (diff / 10000) * 100;
                    const isPositive = diff >= 0;
                    return (
                      <>
                        <p className={`text-lg font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}${diff.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`text-[10px] font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {isPositive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {pct.toFixed(2)}%
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Quick Live Highlight Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {coins.slice(0, 4).map((coin) => (
                <div 
                  key={coin.id} 
                  onClick={() => setSelectedCoin(coin)}
                  className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                    selectedCoin.id === coin.id 
                      ? 'bg-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/5' 
                      : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950"
                        style={{ backgroundColor: coin.color }}
                      >
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{coin.symbol}</h4>
                        <p className="text-[10px] text-slate-500">{coin.name}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-base font-bold font-mono text-slate-100">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}
                  </p>
                  <span className={`text-xs font-semibold inline-flex items-center ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live News Banner */}
        <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-2xl p-3 flex items-center gap-4 overflow-hidden relative">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shrink-0">
            <Newspaper className="h-4 w-4" /> Market Wire
          </div>
          <div className="relative flex-1 overflow-hidden h-6">
            <div className="absolute inset-0 flex items-center gap-8 animate-marquee whitespace-nowrap text-sm text-slate-300">
              {CRYPTO_NEWS.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-2">
                  <span className="text-xs text-indigo-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded uppercase border border-slate-800">{item.source}</span>
                  <span className="font-medium">{item.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    item.impact === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.impact === 'Caution' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>{item.impact}</span>
                  <span className="text-slate-600">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Market list on Left, Trade terminal & Portfolio on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Market Prices Table & Sparklines */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" /> Market Intelligence
                  </h2>
                  <p className="text-xs text-slate-400">Real-time mock price updates every few seconds.</p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name or ticker..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950/80 text-sm text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Table / List representation of Coins */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Asset</th>
                      <th className="pb-3">Live Price</th>
                      <th className="pb-3">24h Change</th>
                      <th className="pb-3 hidden sm:table-cell">Trend (24h)</th>
                      <th className="pb-3 hidden md:table-cell">Market Cap</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCoins.map((coin) => {
                      const isSelected = coin.id === selectedCoin.id;
                      const isPositive = coin.change24h >= 0;
                      
                      return (
                        <tr 
                          key={coin.id}
                          className={`group transition-colors hover:bg-slate-900/30 ${
                            isSelected ? 'bg-slate-900/40 border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'
                          }`}
                        >
                          {/* Name & Symbol */}
                          <td className="py-4 pl-2 cursor-pointer" onClick={() => setSelectedCoin(coin)}>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-slate-950 shadow-sm transition-transform group-hover:scale-105"
                                style={{ backgroundColor: coin.color }}
                              >
                                {coin.symbol}
                              </div>
                              <div>
                                <span className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                                  {coin.name}
                                </span>
                                <span className="block text-[10px] text-slate-500 font-mono font-semibold uppercase">{coin.symbol}/USD</span>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 font-mono font-bold text-slate-200">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}
                          </td>

                          {/* 24h Change */}
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                              isPositive 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {isPositive ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              {Math.abs(coin.change24h).toFixed(2)}%
                            </span>
                          </td>

                          {/* Sparkline Visualizer */}
                          <td className="py-4 hidden sm:table-cell">
                            <div className="w-24 h-8">
                              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                                <polyline
                                  fill="none"
                                  stroke={isPositive ? '#10b981' : '#f43f5e'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={coin.history.map((val, idx) => {
                                    // Map price history values to coordinate grid within 100x30 bounding box
                                    const min = Math.min(...coin.history);
                                    const max = Math.max(...coin.history);
                                    const range = max - min || 1;
                                    const x = (idx / (coin.history.length - 1)) * 100;
                                    const y = 28 - ((val - min) / range) * 26;
                                    return `${x},${y}`;
                                  }).join(' ')}
                                />
                              </svg>
                            </div>
                          </td>

                          {/* Market Cap */}
                          <td className="py-4 font-mono text-xs text-slate-400 hidden md:table-cell">
                            ${coin.marketCap}
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right pr-2">
                            <button
                              onClick={() => {
                                setSelectedCoin(coin);
                                setTradeType('BUY');
                              }}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-sm"
                            >
                              Trade
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredCoins.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">
                          No assets found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Informational / Help Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 h-10 w-10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Guaranteed Safe</h4>
                  <p className="text-xs text-slate-400 mt-1">This simulator uses synthetic market data. Your real capital is 100% safe.</p>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 h-10 w-10 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Ultra-fast Execution</h4>
                  <p className="text-xs text-slate-400 mt-1">Instant limit-order execution simulated locally inside your browser state.</p>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 h-10 w-10 flex items-center justify-center">
                  <ArrowRightLeft className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Arbitrage Simulator</h4>
                  <p className="text-xs text-slate-400 mt-1">Prices change asynchronously. Buy low, sell high to mock absolute efficiency.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Trade Terminal & Portfolio */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trade Terminal Widget */}
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-bold text-slate-100 text-base">Instant Order Book</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>Interactive</span>
                </div>
              </div>

              {/* Asset Selected Header info */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950"
                    style={{ backgroundColor: selectedCoin.color }}
                  >
                    {selectedCoin.symbol}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{selectedCoin.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{selectedCoin.symbol}/USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-200 font-mono">
                    ${selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: selectedCoin.price < 1 ? 4 : 2 })}
                  </p>
                  <span className={`text-[10px] font-bold ${selectedCoin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h}%
                  </span>
                </div>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850 mb-6">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`py-2 text-xs font-extrabold rounded-lg tracking-wider transition-all uppercase ${
                    tradeType === 'BUY' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`py-2 text-xs font-extrabold rounded-lg tracking-wider transition-all uppercase ${
                    tradeType === 'SELL' 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Trade Input Form */}
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <label className="text-slate-400 font-semibold">Quantity ({selectedCoin.symbol})</label>
                    <span className="text-slate-500">
                      Balance:{' '}
                      <strong className="text-slate-300 font-mono">
                        {tradeType === 'BUY' 
                          ? `$${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                          : `${(portfolio[selectedCoin.id] || 0).toFixed(4)} ${selectedCoin.symbol}`
                        }
                      </strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0.00"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 font-mono font-bold text-lg p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-extrabold uppercase tracking-wide">
                      {selectedCoin.symbol}
                    </span>
                  </div>
                </div>

                {/* Percentage Helpers */}
                <div className="grid grid-cols-4 gap-2">
                  {[0.1, 0.25, 0.5, 1.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePresetPercentage(pct)}
                      className="bg-slate-950 hover:bg-slate-800 text-[10px] font-bold py-1 px-2 rounded-lg border border-slate-850 text-slate-400 hover:text-white transition"
                    >
                      {pct === 1 ? 'MAX' : `${pct * 100}%`}
                    </button>
                  ))}
                </div>

                {/* Dynamic Estimated Calculations */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Est. Rate:</span>
                    <span className="font-mono text-slate-300">${selectedCoin.price.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Transaction Fee (Synthetic):</span>
                    <span className="font-mono text-emerald-400">FREE ($0.00)</span>
                  </div>
                  <div className="border-t border-slate-850 my-2 pt-2 flex justify-between font-bold text-slate-200">
                    <span>Estimated Total:</span>
                    <span className="font-mono text-indigo-400">
                      ${((parseFloat(tradeAmount) || 0) * selectedCoin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  </div>
                </div>

                {/* Submit Trade Button */}
                <button
                  type="submit"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-md focus:outline-none ${
                    tradeType === 'BUY'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-90 shadow-emerald-500/10'
                      : 'bg-gradient-to-r from-rose-600 to-pink-500 text-white hover:opacity-90 shadow-rose-500/10'
                  }`}
                >
                  Execute Simulated {tradeType === 'BUY' ? 'Buy' : 'Sell'}
                </button>
              </form>
            </div>

            {/* Simulated Portfolio Balances Summary */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Wallet className="h-4.5 w-4.5 text-indigo-400" /> Private Holdings
                </h3>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Virtual Assets</span>
              </div>

              {/* Assets list breakdown */}
              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {coins.map((coin) => {
                  const holdingAmount = portfolio[coin.id] || 0;
                  const holdingValueUsd = holdingAmount * coin.price;
                  if (holdingAmount === 0) return null;

                  return (
                    <div 
                      key={coin.id} 
                      onClick={() => setSelectedCoin(coin)}
                      className="group cursor-pointer p-3 rounded-xl bg-slate-950/50 hover:bg-slate-950 border border-slate-850 hover:border-indigo-500/30 flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-950"
                          style={{ backgroundColor: coin.color }}
                        >
                          {coin.symbol}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors">{coin.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{holdingAmount.toFixed(4)} {coin.symbol}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200 font-mono">
                          ${holdingValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[9px] font-semibold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* If no assets are owned */}
                {Object.values(portfolio).every(amount => amount === 0) && (
                  <div className="text-center py-8 text-slate-600 border border-dashed border-slate-850 rounded-xl">
                    <p className="text-xs">Your portfolio is currently empty.</p>
                    <p className="text-[10px] text-indigo-400/80 mt-1">Make your first simulated trade above!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Informative Grid / FAQ Section */}
        <section className="bg-slate-900/20 border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Educational</span>
            <h2 className="text-2xl font-bold text-white mt-3">Understanding Decimals & Swaps</h2>
            <p className="text-slate-400 text-sm mt-1">New to Cryptocurrency mechanics? Here is a basic overview of key decentralized indicators simulation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-indigo-300">1. Liquidity Pool Rates</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens swap based on ratios. Higher demand reduces target reserves raising the acquisition value dynamically in typical Automated Market Makers (AMM).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-indigo-300">2. Slippage Tolerance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prices fluctuate second to second. Slippage is the difference between execution price and target quote, typically allowed between 0.5% and 3.0%.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-indigo-300">3. Gas & Network Fees</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart contract actions demand computational effort measured as Gas. This changes according to general consensus queue overload factors.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-indigo-300">4. Private Keys Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never share secret credentials or seed phrases with anyone. True crypto uses asymmetric cryptography to sign trades securely.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Coins className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-slate-300">XenoCrypto Inc.</p>
              <p className="text-[10px] text-slate-600">Perfecting Decentralization Simulation.</p>
            </div>
          </div>

          <div className="flex gap-6 text-slate-400">
            <a href="#market" className="hover:text-white transition">Markets</a>
            <a href="#swap" className="hover:text-white transition">Swap Desk</a>
            <a href="#legal" className="hover:text-white transition">Terms of Play</a>
            <a href="#developer" className="hover:text-white transition">Developer API</a>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-600">
            © {new Date().getFullYear()} XenoCrypto Sandbox. <br />
            No real currency or crypto assets are used or held here.
          </p>
        </div>
      </footer>
    </div>
  );
}