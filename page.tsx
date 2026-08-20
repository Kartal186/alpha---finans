"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  Home, 
  BarChart2, 
  Settings, 
  Cpu, 
  Briefcase, 
  BookOpen, 
  Compass, 
  Terminal as TerminalIcon, 
  Zap, 
  Moon, 
  Sun, 
  Share2, 
  Layers, 
  CheckCircle, 
  RotateCw, 
  Plus, 
  Trash2, 
  HelpCircle, 
  ArrowRight, 
  MessageSquare, 
  ShieldAlert, 
  DollarSign
} from "lucide-react";

import { INITIAL_ASSETS, Asset } from "@/db/assetsData";

// Terminal Message Type
interface LogMessage {
  id: string;
  time: string;
  source: string;
  text: string;
  type: "info" | "success" | "warning" | "signal" | "system";
}

// Portfolio Item Response Type
interface PortfolioItem {
  id: number;
  assetId: string;
  assetName: string;
  category: string;
  buyPrice: string;
  amount: string;
  createdAt?: string;
}

// Cosmic Signal Type
interface CosmicSignal {
  id?: number;
  assetId: string;
  assetName: string;
  signalType: string;
  strength: string;
  dimension: string;
  price: string;
  createdAt?: string;
}

// Feedback Response Type
interface FeedbackItem {
  id: number;
  userName: string;
  message: string;
  createdAt: string;
}

export default function App() {
  // Theme state: 'dark' (Alpha Finans look) or 'light' (Canlı Borsa look)
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Navigation Tabs: 'home' | 'markets' | 'watchlist' | 'cosmic' | 'portfolio' | 'tools' | 'guide'
  const [activeTab, setActiveTab] = useState<string>("home");

  // Market & Asset State
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState<string>("all"); // 'all' | 'Crypto' | 'Stocks-TR' | 'Stocks-EU' | 'Stocks-AS' | 'Commodity'

  // Watchlist & Portfolio DB States
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [savedSignals, setSavedSignals] = useState<CosmicSignal[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // User input states
  const [newTransaction, setNewTransaction] = useState({
    assetId: "BTC",
    buyPrice: "",
    amount: ""
  });
  const [feedbackInput, setFeedbackInput] = useState({
    userName: "",
    message: ""
  });

  // Cosmic Settings
  const [cosmicDimension, setCosmicDimension] = useState("Kuantum Boyutu");
  const [cosmicSpeed, setCosmicSpeed] = useState<number>(3); // 1 to 5
  const [energyLevel, setEnergyLevel] = useState<number>(85);
  const [isSyncingDimensions, setIsSyncingDimensions] = useState(true);

  // Terminal state mimicking Telegram connector
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<LogMessage[]>([
    { id: "1", time: "11:54:01", source: "SİSTEM", text: "Kozmik Enerji Veri Bağlantısı kuruldu.", type: "system" },
    { id: "2", time: "11:54:12", source: "KONTROL", text: "BIST 100, BIST 30, Kripto ve küresel endeksler senkronize ediliyor.", type: "info" },
    { id: "3", time: "11:54:25", source: "TELEGRAM", text: "Canlı terminal bağlantısı aktif. Komutlar için /help yazın.", type: "success" }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Comparison State
  const [compareAssetA, setCompareAssetA] = useState("BTC");
  const [compareAssetB, setCompareAssetB] = useState("XU100");

  // Feedback Notification state
  const [feedbackStatus, setFeedbackStatus] = useState({ show: false, message: "", success: true });

  // 1. Fetch persistent states from our local APIs (watchlist, portfolio, saved signals, feedbacks)
  const loadWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist");
      const json = await res.json();
      if (json.success && json.data) {
        setWatchlistIds(json.data.map((item: any) => item.assetId));
      }
    } catch (e) {
      console.error("Watchlist yükleme hatası", e);
    }
  };

  const loadPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const json = await res.json();
      if (json.success && json.data) {
        setPortfolioList(json.data);
      }
    } catch (e) {
      console.error("Portföy yükleme hatası", e);
    }
  };

  const loadSavedSignals = async () => {
    try {
      const res = await fetch("/api/cosmic-signals");
      const json = await res.json();
      if (json.success && json.data) {
        setSavedSignals(json.data);
      }
    } catch (e) {
      console.error("Sinyal yükleme hatası", e);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const json = await res.json();
      if (json.success && json.data) {
        setFeedbacks(json.data);
      }
    } catch (e) {
      console.error("Geri bildirim yükleme hatası", e);
    }
  };

  useEffect(() => {
    loadWatchlist();
    loadPortfolio();
    loadSavedSignals();
    loadFeedbacks();
  }, []);

  // Scroll terminal logs to bottom when updated
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // 2. Real-time dynamic prices engine (using simulated price fluctuations influenced by the Cosmic Dimension speed!)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSyncingDimensions) return;

      // Randomly update 2-5 assets' prices to represent real-time changes
      setAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          // Probability of change based on cosmic speed setting
          const chance = Math.random() * 10;
          if (chance < cosmicSpeed + 1) {
            // Price variance: -0.4% to +0.4%, multiplied by cosmic speed multiplier
            const percentChange = (Math.random() - 0.49) * 0.005 * (cosmicSpeed * 1.5);
            const newPrice = Math.max(0.0001, asset.basePrice * (1 + percentChange));
            const newChange24h = Number((asset.change24h + percentChange * 100).toFixed(2));

            // Log high volatility and trigger automated signal
            if (Math.abs(percentChange * 100) > 0.4 && Math.random() > 0.8) {
              const signalType = percentChange > 0 ? "AL" : "SAT";
              const strength = Math.floor(80 + Math.random() * 20) + "%";
              const timestamp = new Date().toLocaleTimeString();

              // Add a transient log message mimicking real-time AI trading signals
              setTerminalLogs((prevLogs) => {
                const newLog: LogMessage = {
                  id: String(Date.now()),
                  time: timestamp,
                  source: "BOYUT-" + cosmicSpeed,
                  text: `⚡ [${asset.id}] ${asset.name} ${signalType === "AL" ? "YÜKSELİŞ" : "DÜŞÜŞ"} Sinyali Alındı (${strength})! Fiyat: ${newPrice.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} ${asset.currency}`,
                  type: "signal"
                };
                return [...prevLogs.slice(-40), newLog];
              });

              // Automatically save high strength cosmic signals to database
              if (parseInt(strength) > 90) {
                fetch("/api/cosmic-signals", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    assetId: asset.id,
                    assetName: asset.name,
                    signalType,
                    strength,
                    dimension: cosmicDimension,
                    price: `${newPrice.toFixed(2)} ${asset.currency}`
                  })
                }).then(res => res.json()).then(resJson => {
                  if (resJson.success) {
                    setSavedSignals((prev) => [resJson.data, ...prev.slice(0, 29)]);
                  }
                }).catch(err => console.log("Otomatik sinyal kaydetme hatası", err));
              }
            }

            return {
              ...asset,
              basePrice: newPrice,
              change24h: newChange24h
            };
          }
          return asset;
        });
      });

      // Slowly fluctuate cosmic energy level
      setEnergyLevel((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(100, Math.max(50, prev + delta));
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [cosmicSpeed, cosmicDimension, isSyncingDimensions]);

  // Handle Watchlist Toggle
  const toggleWatchlist = async (asset: Asset) => {
    const isAdded = watchlistIds.includes(asset.id);
    const action = isAdded ? "remove" : "add";

    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          assetName: asset.name,
          category: asset.category,
          action
        })
      });
      const data = await response.json();
      if (data.success) {
        if (isAdded) {
          setWatchlistIds(watchlistIds.filter(id => id !== asset.id));
        } else {
          setWatchlistIds([...watchlistIds, asset.id]);
        }
      }
    } catch (e) {
      console.error("Watchlist kaydı başarısız", e);
    }
  };

  // Handle Submit Portfolio buy transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const assetObj = assets.find(a => a.id === newTransaction.assetId);
    if (!assetObj) return;

    const price = parseFloat(newTransaction.buyPrice) || assetObj.basePrice;
    const amount = parseFloat(newTransaction.amount);

    if (!amount || amount <= 0) {
      alert("Lütfen geçerli bir miktar giriniz.");
      return;
    }

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: assetObj.id,
          assetName: assetObj.name,
          category: assetObj.category,
          buyPrice: price,
          amount: amount
        })
      });
      const data = await response.json();
      if (data.success) {
        loadPortfolio();
        setNewTransaction({
          ...newTransaction,
          buyPrice: "",
          amount: ""
        });
        // Add log
        setTerminalLogs(prev => [
          ...prev,
          {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString(),
            source: "PORTFÖY",
            text: `✅ ${amount} adet ${assetObj.id} alındı. Maliyet: ${price} ${assetObj.currency}`,
            type: "success"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Portfolio item
  const handleDeletePortfolioItem = async (id: number, assetId: string) => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: id
        })
      });
      const json = await res.json();
      if (json.success) {
        setPortfolioList(portfolioList.filter(item => item.id !== id));
        setTerminalLogs(prev => [
          ...prev,
          {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString(),
            source: "PORTFÖY",
            text: `🗑️ ${assetId} işlemi portföyünüzden silindi.`,
            type: "warning"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Feedback / Geri Bildirim
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.message.trim()) return;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: feedbackInput.userName,
          message: feedbackInput.message
        })
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackInput({ userName: "", message: "" });
        setFeedbackStatus({
          show: true,
          message: "Mesajınız başarıyla kozmik veri tabanına yazıldı!",
          success: true
        });
        loadFeedbacks();
        setTimeout(() => setFeedbackStatus({ show: false, message: "", success: true }), 4000);
      }
    } catch (e) {
      setFeedbackStatus({
        show: true,
        message: "Bağlantı hatası oluştu.",
        success: false
      });
    }
  };

  // Handle Telegram style terminal command execution!
  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const timestamp = new Date().toLocaleTimeString();
    const userLog: LogMessage = {
      id: String(Date.now() + 1),
      time: timestamp,
      source: "KULLANICI",
      text: cmd,
      type: "info"
    };

    let responseLog: LogMessage = {
      id: String(Date.now() + 2),
      time: timestamp,
      source: "SİSTEM",
      text: "",
      type: "system"
    };

    const cmdLower = cmd.toLowerCase();

    if (cmdLower === "/help") {
      responseLog.text = "Mevcut komutlar:\n" +
        "• /boost - Kozmik enerji veri hızını maksimuma çıkartır (Hız: 5)\n" +
        "• /slow - Enerji frekansını yavaşlatır (Hız: 1)\n" +
        "• /signal - Rastgele bir finansal varlık için anlık AL/SAT sinyali üretir ve veritabanına kaydeder.\n" +
        "• /clear - Terminal ekranındaki eski logları temizler.\n" +
        "• /status - Kozmik ağ geçidi, BIST 100 verisi ve Neon DB bağlantı durumunu raporlar.\n" +
        "• /dark veya /light - Temayı anında değiştirir.";
    } else if (cmdLower === "/boost") {
      setCosmicSpeed(5);
      setEnergyLevel(100);
      responseLog.text = "🚀 [BOOST ETKİN] Kozmik boyut enerjileri maksimum frekansta kanallanıyor! Veri yenileme hızı pik yaptı.";
      responseLog.type = "success";
    } else if (cmdLower === "/slow") {
      setCosmicSpeed(1);
      responseLog.text = "🐢 Enerji kanalı yavaşlatıldı. Yıldız tozları sakinleşiyor. Veri akışı normalize oldu.";
      responseLog.type = "warning";
    } else if (cmdLower === "/signal") {
      // Pick a random asset
      const randAsset = assets[Math.floor(Math.random() * assets.length)];
      const sigType = Math.random() > 0.5 ? "AL" : "SAT";
      const str = Math.floor(88 + Math.random() * 12) + "%";
      
      responseLog.text = `📡 [ANLIK KOZMİK SİNYAL] ${randAsset.name} (${randAsset.id}) için %${str} doğrulukla ${sigType} öneriliyor! Güncel Fiyat: ${randAsset.basePrice.toLocaleString("tr-TR")} ${randAsset.currency}`;
      responseLog.type = "signal";

      // Save to database
      fetch("/api/cosmic-signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: randAsset.id,
          assetName: randAsset.name,
          signalType: sigType,
          strength: str,
          dimension: cosmicDimension,
          price: `${randAsset.basePrice.toFixed(2)} ${randAsset.currency}`
        })
      }).then(() => loadSavedSignals());

    } else if (cmdLower === "/clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else if (cmdLower === "/status") {
      responseLog.text = `🟢 BAĞLANTI DURUMU:\n` +
        `- Ağ Geçidi: ${cosmicDimension} Aktif\n` +
        `- Güncel Enerji Akışı: %${energyLevel}\n` +
        `- Neon DB Bağlantısı: OK\n` +
        `- Vercel Serverless: OK\n` +
        `- İzlenen Varlık Sayısı: ${assets.length} Adet\n` +
        `- Kayıtlı Portföy İşlemi: ${portfolioList.length}`;
      responseLog.type = "info";
    } else if (cmdLower === "/dark") {
      setTheme("dark");
      responseLog.text = "🌒 Alfa Finans Premium Karanlık Tema uygulandı.";
      responseLog.type = "success";
    } else if (cmdLower === "/light") {
      setTheme("light");
      responseLog.text = "☀️ Canlı Borsa Aydınlık Tema uygulandı.";
      responseLog.type = "success";
    } else {
      responseLog.text = `❌ Bilinmeyen komut: "${cmd}". Yardım listesi için /help yazın.`;
      responseLog.type = "warning";
    }

    setTerminalLogs((prev) => [...prev, userLog, responseLog]);
    setTerminalInput("");
  };

  // Filtered assets for markets page
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.subText && asset.subText.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = marketFilter === "all" || asset.category === marketFilter;
    return matchesSearch && matchesCategory;
  });

  // Split BIST 100, BIST 30, USD, EUR, GRAMALTIN for top bar banner
  const topBanners = assets.filter(a => ["XU100", "XU030", "USDTRY", "EURTRY", "GRAMALTIN"].includes(a.id));

  // Get Top Gainers (Yükselenler) and Top Losers (Düşenler) to mimic exactly screenshot 4!
  const sortedMovers = [...assets].sort((a, b) => b.change24h - a.change24h);
  const topGainers = sortedMovers.slice(0, 10);
  const topLosers = [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 10);

  // Compare Assets Data logic
  const assetAObj = assets.find(a => a.id === compareAssetA) || assets[0];
  const assetBObj = assets.find(b => b.id === compareAssetB) || assets[1];

  // Calculate Total Simulated Portfolio Wealth
  const calculatePortfolioValue = () => {
    let totalValueInTRY = 0;
    let totalCostInTRY = 0;

    portfolioList.forEach((item) => {
      const liveAsset = assets.find(a => a.id === item.assetId);
      if (!liveAsset) return;

      const livePrice = liveAsset.basePrice;
      const buyPriceNum = parseFloat(item.buyPrice);
      const amountNum = parseFloat(item.amount);

      // Convert to TRY equivalent for general stats
      let livePriceTRY = livePrice;
      let buyPriceTRY = buyPriceNum;

      if (liveAsset.currency === "$") {
        const dollarRate = assets.find(a => a.id === "USDTRY")?.basePrice || 47.92;
        livePriceTRY = livePrice * dollarRate;
        buyPriceTRY = buyPriceNum * dollarRate;
      } else if (liveAsset.currency === "€") {
        const euroRate = assets.find(a => a.id === "EURTRY")?.basePrice || 55.52;
        livePriceTRY = livePrice * euroRate;
        buyPriceTRY = buyPriceNum * euroRate;
      }

      totalValueInTRY += livePriceTRY * amountNum;
      totalCostInTRY += buyPriceTRY * amountNum;
    });

    const netProfit = totalValueInTRY - totalCostInTRY;
    const profitPercent = totalCostInTRY > 0 ? (netProfit / totalCostInTRY) * 100 : 0;

    return {
      currentValue: totalValueInTRY,
      totalCost: totalCostInTRY,
      netProfit,
      profitPercent
    };
  };

  const portfolioValueStats = calculatePortfolioValue();

  // Color theme variables based on the active selection
  const darkThemeClasses = {
    bg: "bg-[#0b1329] text-slate-100",
    cardBg: "bg-[#111e3b]/85 border-[#1b2f5c]",
    cardHeaderBg: "bg-[#16274e]",
    textColorPrimary: "text-white",
    textColorSecondary: "text-slate-400",
    buttonActive: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40",
    buttonInactive: "bg-[#16264d] text-slate-300 hover:bg-[#1f3468]",
    inputBg: "bg-[#070d1c] border-[#1f376a] text-white focus:border-blue-500",
    bottomNavBg: "bg-[#090f22]/95 border-[#152752]",
    bottomNavActive: "text-blue-400 bg-blue-950/40",
    accentGlow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    headerGrad: "from-[#0d1b3e] to-[#070e24] border-b border-[#1b3164]"
  };

  const lightThemeClasses = {
    bg: "bg-[#f1f5f9] text-slate-800",
    cardBg: "bg-white border-[#e2e8f0] shadow-sm",
    cardHeaderBg: "bg-slate-50",
    textColorPrimary: "text-slate-900",
    textColorSecondary: "text-slate-500",
    buttonActive: "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-200",
    buttonInactive: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    inputBg: "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500",
    bottomNavBg: "bg-white/95 border-slate-200 shadow-lg",
    bottomNavActive: "text-blue-600 bg-blue-50",
    accentGlow: "shadow-md shadow-slate-200",
    headerGrad: "from-blue-500 to-indigo-600 text-white border-b border-blue-100"
  };

  const c = theme === "dark" ? darkThemeClasses : lightThemeClasses;

  return (
    <div className={`min-h-screen font-sans pb-28 transition-colors duration-300 ${c.bg}`}>
      
      {/* HEADER BANNER */}
      <header className={`sticky top-0 z-40 bg-gradient-to-r ${c.headerGrad} px-4 py-3 shadow-md`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl animate-pulse">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-wider">ALPHA FİNANS</span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded uppercase animate-pulse">
                    5D Live
                  </span>
                </div>
                <p className="text-[11px] opacity-80 flex items-center gap-1 font-mono">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 
                  Uzay & Zaman Boyutlarından Canlı Enerji Akışı
                </p>
              </div>
            </div>

            {/* Theme & Fast Action Toggles */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-black/20 text-white"
                title="Temayı Değiştir"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-200" />}
              </button>
            </div>
          </div>

          {/* Real-time Ticker Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-xs font-mono font-semibold whitespace-nowrap bg-black/20 text-white px-2 py-0.5 rounded-full">
                {new Date().toLocaleDateString("tr-TR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {/* Top key indices prices */}
            <div className="flex items-center gap-3 pl-2">
              {topBanners.map((banner) => {
                const isPositive = banner.change24h >= 0;
                return (
                  <div 
                    key={banner.id} 
                    className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap border border-white/5"
                  >
                    <span className="font-bold text-white/90">{banner.id}:</span>
                    <span className="text-white font-medium">
                      {banner.basePrice.toLocaleString("tr-TR", { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                    <span className={`flex items-center font-bold text-[11px] ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? "+" : ""}{banner.change24h}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-black/20 text-white transition hover:bg-black/35 flex items-center gap-2 text-xs"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Aydınlık Tema</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-950" />
                  <span>Karanlık Tema</span>
                </>
              )}
            </button>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Neon DB Aktif
            </span>
          </div>

        </div>
      </header>

      {/* BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 mt-6">

        {/* TOP LEVEL DYNAMIC ALERTS AND DIMENSIONAL LEVEL METER */}
        <section className={`mb-6 p-4 rounded-2xl ${c.cardBg} border ${c.accentGlow}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold animate-spin-slow">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`font-bold text-md ${c.textColorPrimary} flex items-center gap-1`}>
                  Kozmic Veri Alıcısı & Matrix Motoru
                  <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
                    Hız: x{cosmicSpeed}
                  </span>
                </h2>
                <p className={`text-xs ${c.textColorSecondary} mt-0.5`}>
                  Veri kanalları <strong className="text-cyan-400">{cosmicDimension}</strong> üzerinden kesintisiz akıyor. Enerji Yoğunluğu: <strong>%{energyLevel}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full md:w-48 bg-black/20 rounded-full h-3 p-0.5 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${energyLevel}%` }}
                ></div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsSyncingDimensions(!isSyncingDimensions)}
                  className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition ${
                    isSyncingDimensions ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-600/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSyncingDimensions ? "animate-spin" : ""}`} />
                  {isSyncingDimensions ? "Canlı Akış Aktif" : "Akış Durduruldu"}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ----------------- TAB: ANA SAYFA (HOME) ----------------- */}
        {activeTab === "home" && (
          <div className="space-y-6">
            
            {/* 1. HERO SLIDER OF TOOLS (Inspired by Screenshot 1) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className={`col-span-1 md:col-span-2 p-5 rounded-2xl ${c.cardBg} border flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div>
                  <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                    <Compass className="w-3.5 h-3.5" />
                    Kozmik Finansal Tarayıcı ve Yapay Zeka
                  </div>
                  <h3 className={`text-xl font-extrabold mt-3 ${c.textColorPrimary}`}>
                    Yüksek Frekanslı Boyutsal Analiz Araçları
                  </h3>
                  <p className={`text-xs ${c.textColorSecondary} mt-2 max-w-lg leading-relaxed`}>
                    BIST 100, Kripto Para Birimleri ve Avrupa/Asya borsalarından gelen verileri 
                    Matrix terminali ile anlık AL/SAT göstergelerine dönüştürün. Uzay ve zaman boyutunun 
                    tümünden gelen sinyalleri yakalamak için aşağıdaki terminali kullanın.
                  </p>
                </div>

                {/* Grid of fast-access tools */}
                <div className="grid grid-cols-4 gap-2 mt-6">
                  {[
                    { label: "Barometre", desc: "Duygu Analizi", tab: "tools", color: "text-amber-400" },
                    { label: "Taramalar", desc: "Akıllı Filtre", tab: "tools", color: "text-blue-400" },
                    { label: "Karşılaştır", desc: "A vs B Performans", tab: "tools", color: "text-purple-400" },
                    { label: "Sinyaller", desc: "AL/SAT Matrix", tab: "cosmic", color: "text-emerald-400" }
                  ].map((tool, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(tool.tab)}
                      className={`p-3 rounded-xl bg-black/10 hover:bg-black/20 border border-white/5 text-center transition group`}
                    >
                      <Zap className={`w-5 h-5 mx-auto mb-1 ${tool.color} transition group-hover:scale-110`} />
                      <div className={`text-[11px] font-bold ${c.textColorPrimary}`}>{tool.label}</div>
                      <div className="text-[9px] text-slate-500 truncate">{tool.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Telegram Connection Widget (Inspired by User's Terminal look) */}
              <div className={`p-5 rounded-2xl bg-gradient-to-b from-[#101c36] to-[#081023] border border-[#1d315f] text-slate-100 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between border-b border-[#1b2e59] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="font-bold font-mono text-sm tracking-wide text-cyan-400">TELEGRAM_MATRIX_BOT</span>
                    </div>
                    <span className="text-[10px] bg-cyan-900 text-cyan-300 font-bold px-2 py-0.5 rounded font-mono">
                      PORT 5432
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Sistemimiz, Telegram kanallarından gelen verileri anında işleyen akıllı bir terminal arayüzüne sahiptir.
                    Aşağıya <code className="text-yellow-400 font-mono">/help</code> yazarak anında botu test edin!
                  </p>
                </div>

                {/* Simulated Telegram Terminal logs */}
                <div className="bg-black/45 rounded-xl p-2.5 font-mono text-[10px] h-32 overflow-y-auto mt-3 border border-slate-800 space-y-1.5 scrollbar-thin">
                  {terminalLogs.slice(-6).map((log) => (
                    <div key={log.id} className="leading-tight">
                      <span className="text-slate-500">[{log.time}]</span>{" "}
                      <span className={`font-semibold ${
                        log.source === "SİSTEM" ? "text-cyan-400" :
                        log.source === "KULLANICI" ? "text-amber-400" : "text-emerald-400"
                      }`}>{log.source}:</span>{" "}
                      <span className={`${
                        log.type === "signal" ? "text-yellow-300 font-bold" :
                        log.type === "success" ? "text-emerald-300" :
                        log.type === "warning" ? "text-rose-300" : "text-slate-200"
                      }`}>{log.text}</span>
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Terminal Command Input */}
                <form onSubmit={handleExecuteCommand} className="mt-3 flex gap-1">
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Terminal komutu girin (Örn: /boost)..."
                    className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition"
                  >
                    GÖNDER
                  </button>
                </form>
              </div>

            </div>

            {/* 2. DYNAMIC LIVE MARKETS SPLIT (ASSETS TABLE vs MOVERS LIST) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Assets list overview */}
              <div className={`lg:col-span-2 p-5 rounded-2xl ${c.cardBg} border`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-bold text-lg ${c.textColorPrimary} flex items-center gap-1.5`}>
                      🔥 Popüler Piyasalar (Gerçek Zamanlı)
                    </h3>
                    <p className={`text-xs ${c.textColorSecondary}`}>
                      Türkiye, Kripto, Avrupa ve Asya varlıklarının anlık değişimi
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("markets")} 
                    className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1"
                  >
                    Tümünü Gör <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/10 text-xs text-slate-400">
                        <th className="pb-3 font-semibold">Sembol</th>
                        <th className="pb-3 font-semibold">İsim</th>
                        <th className="pb-3 font-semibold text-right">Anlık Fiyat</th>
                        <th className="pb-3 font-semibold text-right">24s Değişim</th>
                        <th className="pb-3 font-semibold text-center">İzleme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/5 text-xs">
                      {assets.slice(0, 10).map((asset) => {
                        const isPositive = asset.change24h >= 0;
                        const isStarred = watchlistIds.includes(asset.id);
                        return (
                          <tr key={asset.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3 font-bold flex items-center gap-2">
                              <span 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-black"
                                style={{ backgroundColor: asset.logoColor }}
                              >
                                {asset.id.slice(0, 3)}
                              </span>
                              <div>
                                <span className={`${c.textColorPrimary} font-bold`}>{asset.id}</span>
                                <span className="block text-[10px] text-slate-400 font-normal">{asset.subText || asset.category}</span>
                              </div>
                            </td>
                            <td className="py-3 font-semibold">
                              <span className={c.textColorSecondary}>{asset.name}</span>
                            </td>
                            <td className="py-3 text-right font-mono font-bold">
                              {asset.basePrice.toLocaleString("tr-TR", { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 5 
                              })} {asset.currency}
                            </td>
                            <td className="py-3 text-right font-mono">
                              <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                                isPositive ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
                              }`}>
                                {isPositive ? "▲ +" : "▼ "}{asset.change24h}%
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <button 
                                onClick={() => toggleWatchlist(asset)}
                                className={`p-1.5 rounded-lg transition ${
                                  isStarred ? "text-yellow-500" : "text-slate-400 hover:text-yellow-500"
                                }`}
                              >
                                <Star className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : ""}`} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Movers sidebar: Yükselenler & Düşenler (Matches Screenshot 4) */}
              <div className="space-y-6">
                
                {/* Yükselenler (Movers Positive) */}
                <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className={`font-extrabold text-sm ${c.textColorPrimary} uppercase`}>
                        ▲ En Çok Yükselenler (BIST & Kripto)
                      </h4>
                      <p className="text-[10px] text-slate-400">Son 24 saatlik anlık değişim zirvesi</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {topGainers.slice(0, 5).map((gainer, index) => (
                      <div key={gainer.id} className="flex items-center justify-between p-2 rounded-lg bg-black/10 hover:bg-black/20 transition text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500">{index + 1}</span>
                          <span className={`font-bold ${c.textColorPrimary}`}>{gainer.id}</span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[80px]">{gainer.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`${c.textColorPrimary} font-bold`}>
                            {gainer.basePrice.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {gainer.currency}
                          </span>
                          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            +{gainer.change24h}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Düşenler (Movers Negative) */}
                <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-rose-500" />
                    <div>
                      <h4 className={`font-extrabold text-sm ${c.textColorPrimary} uppercase`}>
                        ▼ En Çok Düşenler
                      </h4>
                      <p className="text-[10px] text-slate-400">Son 24 saatlik düşüş trendi</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {topLosers.slice(0, 5).map((loser, index) => (
                      <div key={loser.id} className="flex items-center justify-between p-2 rounded-lg bg-black/10 hover:bg-black/20 transition text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500">{index + 1}</span>
                          <span className={`font-bold ${c.textColorPrimary}`}>{loser.id}</span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[80px]">{loser.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`${c.textColorPrimary} font-bold`}>
                            {loser.basePrice.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {loser.currency}
                          </span>
                          <span className="bg-rose-500/10 text-rose-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {loser.change24h}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* QUICK STEPS CARD FOR THE BEGINNER ON HOW TO EXPORT THE APP */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 rounded-2xl border border-blue-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                  Acemi Geliştirici Özel
                </span>
                <h3 className="text-lg font-bold">
                  Bu Uygulamayı Telefonunuza Yükleyin (APK Yapma Rehberi)
                </h3>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Harika bir haberimiz var! Vercel ve Neon DB ile çalışan bu modern Next.js uygulamasını 
                  GitHub bilmeseniz dahi sadece birkaç dakikada gerçek bir Android APK dosyasına dönüştürüp 
                  kendi telefonunuzda tıpkı paylaştığınız fotoğraflardaki gibi canlı borsa uygulaması olarak kullanabilirsiniz!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("guide")}
                className="bg-white hover:bg-slate-100 text-blue-950 font-extrabold px-6 py-3 rounded-xl text-xs transition whitespace-nowrap flex items-center gap-2 shadow-lg"
              >
                <BookOpen className="w-4 h-4 text-blue-700" />
                Nasıl APK Yapılır? Rehberi Oku
              </button>
            </div>

          </div>
        )}

        {/* ----------------- TAB: PİYASALAR (MARKETS) ----------------- */}
        {activeTab === "markets" && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`font-bold text-lg ${c.textColorPrimary}`}>
                    Tüm Küresel Finans Piyasaları
                  </h3>
                  <p className={`text-xs ${c.textColorSecondary}`}>
                    Kripto, Türk Borsası, Avrupa Borsaları, Asya Borsaları ve Emtialar
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Tüm Varlıklar" },
                    { id: "Crypto", label: "🪙 Kripto Para" },
                    { id: "Stocks-TR", label: "🇹🇷 Türkiye (BIST)" },
                    { id: "Stocks-EU", label: "🇪🇺 Avrupa" },
                    { id: "Stocks-AS", label: "🌏 Asya" },
                    { id: "Commodity", label: "🏆 Emtia & Döviz" }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setMarketFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        marketFilter === filter.id ? c.buttonActive : c.buttonInactive
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hisse senedi, kripto para, döviz kodu veya şirket ismi arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none border transition ${c.inputBg}`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Markets Table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/10 text-xs text-slate-400">
                      <th className="pb-3 font-semibold">Sembol</th>
                      <th className="pb-3 font-semibold">Varlık İsmi</th>
                      <th className="pb-3 font-semibold">Kategori</th>
                      <th className="pb-3 font-semibold text-right">Canlı Fiyat</th>
                      <th className="pb-3 font-semibold text-right">24s Değişim</th>
                      <th className="pb-3 font-semibold text-right">Hacim</th>
                      <th className="pb-3 font-semibold text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/5 text-xs">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => {
                        const isPositive = asset.change24h >= 0;
                        const isStarred = watchlistIds.includes(asset.id);
                        return (
                          <tr key={asset.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3.5 font-bold flex items-center gap-2">
                              <span 
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white font-black"
                                style={{ backgroundColor: asset.logoColor }}
                              >
                                {asset.id.slice(0, 3)}
                              </span>
                              <div>
                                <span className={`${c.textColorPrimary} font-bold text-sm`}>{asset.id}</span>
                                <span className="block text-[10px] text-slate-400 font-normal">{asset.subText || asset.category}</span>
                              </div>
                            </td>
                            <td className="py-3.5 font-semibold">
                              <span className={c.textColorPrimary}>{asset.name}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="bg-slate-500/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                {asset.category}
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-mono font-bold text-sm">
                              {asset.basePrice.toLocaleString("tr-TR", { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 5 
                              })} {asset.currency}
                            </td>
                            <td className="py-3.5 text-right font-mono">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                isPositive ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
                              }`}>
                                {isPositive ? "▲ +" : "▼ "}{asset.change24h}%
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-mono text-slate-400">
                              {asset.volume}
                            </td>
                            <td className="py-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => toggleWatchlist(asset)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isStarred 
                                      ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" 
                                      : "text-slate-400 hover:text-yellow-500 bg-transparent border-slate-700/20"
                                  }`}
                                  title="Favorilere Ekle"
                                >
                                  <Star className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : ""}`} />
                                </button>
                                <button
                                  onClick={() => {
                                    setNewTransaction({
                                      assetId: asset.id,
                                      buyPrice: asset.basePrice.toFixed(2),
                                      amount: "1"
                                    });
                                    setActiveTab("portfolio");
                                  }}
                                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition"
                                >
                                  Portföye Ekle
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Aramanızla eşleşen hiçbir finansal varlık bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: İZLEME LİSTESİ (WATCHLIST) ----------------- */}
        {activeTab === "watchlist" && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`font-bold text-lg ${c.textColorPrimary} flex items-center gap-2`}>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Kişisel İzleme Listeniz (Senkronize)
                  </h3>
                  <p className={`text-xs ${c.textColorSecondary}`}>
                    Neon DB veritabanınızda saklanan ve canlı güncellenen favori hisse ve kriptolarınız
                  </p>
                </div>
                <span className="text-xs bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full border border-yellow-500/20">
                  {watchlistIds.length} Varlık İzleniyor
                </span>
              </div>

              {watchlistIds.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Star className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className={`text-sm ${c.textColorSecondary}`}>Henüz hiçbir hisse veya kriptoyu izleme listenize eklemediniz.</p>
                  <p className="text-xs text-slate-500">Piyasalar sayfasından yıldız ikonuna tıklayarak favorilerinizi buraya kaydedebilirsiniz.</p>
                  <button
                    onClick={() => setActiveTab("markets")}
                    className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Piyasaları Keşfet
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/10 text-xs text-slate-400">
                        <th className="pb-3 font-semibold">Sembol</th>
                        <th className="pb-3 font-semibold">Varlık İsmi</th>
                        <th className="pb-3 font-semibold">Kategori</th>
                        <th className="pb-3 font-semibold text-right">Canlı Fiyat</th>
                        <th className="pb-3 font-semibold text-right">24s Değişim</th>
                        <th className="pb-3 font-semibold text-center">Kaldır</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/5 text-xs">
                      {assets
                        .filter((a) => watchlistIds.includes(a.id))
                        .map((asset) => {
                          const isPositive = asset.change24h >= 0;
                          return (
                            <tr key={asset.id} className="hover:bg-slate-500/5 transition-colors">
                              <td className="py-3 font-bold flex items-center gap-2">
                                <span 
                                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white font-black"
                                  style={{ backgroundColor: asset.logoColor }}
                                >
                                  {asset.id.slice(0, 3)}
                                </span>
                                <div>
                                  <span className={`${c.textColorPrimary} font-bold text-sm`}>{asset.id}</span>
                                  <span className="block text-[10px] text-slate-400 font-normal">{asset.subText}</span>
                                </div>
                              </td>
                              <td className="py-3 font-semibold">
                                <span className={c.textColorPrimary}>{asset.name}</span>
                              </td>
                              <td className="py-3">
                                <span className="bg-slate-500/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                  {asset.category}
                                </span>
                              </td>
                              <td className="py-3 text-right font-mono font-bold text-sm">
                                {asset.basePrice.toLocaleString("tr-TR", { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 5 
                                })} {asset.currency}
                              </td>
                              <td className="py-3 text-right font-mono">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                  isPositive ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
                                }`}>
                                  {isPositive ? "▲ +" : "▼ "}{asset.change24h}%
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <button
                                  onClick={() => toggleWatchlist(asset)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                                  title="İzleme Listesinden Çıkar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: KOZMİK ENERJİ ALICISI & TERMINAL (COSMIC) ----------------- */}
        {activeTab === "cosmic" && (
          <div className="space-y-6">
            
            {/* Visual Dimension portal switcher */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className={`col-span-1 md:col-span-2 p-6 rounded-2xl ${c.cardBg} border space-y-4`}>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
                    <Zap className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${c.textColorPrimary}`}>
                      Kozmik Boyutsal Güç Ağ Geçidi
                    </h3>
                    <p className={`text-xs ${c.textColorSecondary}`}>
                      Farklı zaman ve uzay boyutlarından gelen enerjileri değiştirerek piyasaların frekansını ayarlayın.
                    </p>
                  </div>
                </div>

                {/* Dimension selection cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {[
                    { name: "Kuantum Boyutu", desc: "Saniyede 3 veri güncellemesi. Yüksek RSI sinyalleri.", speed: 3, energy: 82, color: "from-cyan-500 to-blue-500" },
                    { name: "Işık Hızı Zaman Döngüsü", desc: "Saniyede 5 veri güncellemesi. Ultra yüksek volatilite.", speed: 5, energy: 98, color: "from-amber-500 to-red-500" },
                    { name: "Astral Yıldız Tozu", desc: "Saniyede 2 veri güncellemesi. Kararlı uzun vade trendleri.", speed: 2, energy: 65, color: "from-purple-500 to-pink-500" },
                    { name: "Çoklu Evren Ağ Geçidi", desc: "Saniyede 4 veri güncellemesi. Çapraz arbitrage sinyalleri.", speed: 4, energy: 88, color: "from-emerald-500 to-teal-500" }
                  ].map((dim) => (
                    <button
                      key={dim.name}
                      onClick={() => {
                        setCosmicDimension(dim.name);
                        setCosmicSpeed(dim.speed);
                        setEnergyLevel(dim.energy);
                        setTerminalLogs(prev => [
                          ...prev,
                          {
                            id: String(Date.now()),
                            time: new Date().toLocaleTimeString(),
                            source: "BOYUT",
                            text: `🌌 Ağ geçidi değiştirildi: ${dim.name}. Frekans: x${dim.speed}, Güç Yoğunluğu: %${dim.energy}`,
                            type: "success"
                          }
                        ]);
                      }}
                      className={`p-4 rounded-xl text-left border transition relative overflow-hidden group ${
                        cosmicDimension === dim.name 
                          ? "border-purple-500 bg-purple-500/5" 
                          : "border-slate-700/10 hover:border-slate-500/30 bg-black/10"
                      }`}
                    >
                      <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${dim.color}`}></div>
                      <div className={`font-bold text-xs ${c.textColorPrimary} group-hover:text-purple-400 transition`}>{dim.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{dim.desc}</div>
                      <div className="flex items-center gap-3 mt-3 text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">Hız: x{dim.speed}</span>
                        <span className="text-pink-400 font-bold">Güç: %{dim.energy}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Simulated Waveform chart */}
                <div className="bg-black/40 rounded-xl p-4 border border-slate-700/20 font-mono text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 animate-spin-slow" />
                      ANLIK ENERJİ DALGA BOYU SİMÜLASYONU
                    </span>
                    <span className="text-slate-500">BOYUT_FREKANS_OKEY</span>
                  </div>
                  <div className="text-[11px] text-purple-300 leading-none tracking-widest overflow-hidden h-12 flex flex-col justify-around">
                    <div>{`⚡⚡ ${"|/|\\".repeat(Math.min(25, energyLevel / 3))} [${energyLevel}%]`}</div>
                    <div className="text-cyan-400">{`💎💎 ${"~_~_".repeat(Math.min(25, cosmicSpeed * 5))} [${cosmicSpeed} GHz]`}</div>
                  </div>
                </div>
              </div>

              {/* Active cosmic parameters panel */}
              <div className={`p-6 rounded-2xl ${c.cardBg} border flex flex-col justify-between`}>
                <div className="space-y-4">
                  <h4 className={`font-bold text-sm ${c.textColorPrimary} uppercase tracking-wider`}>
                    📡 Kozmik Sinyal Üretici
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Uygulamamızın uzay-zaman dalgalarını analiz ederek ürettiği en yüksek doğruluktaki AL/SAT sinyalleri 
                    aşağıda listelenmiştir. Bunlar veri tabanınızda (Neon) saklanır.
                  </p>

                  <div className="bg-black/25 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aktif Ağ:</span>
                      <span className="font-bold text-white">{cosmicDimension}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Neon Sinyal Kaydı:</span>
                      <span className="font-bold text-cyan-400">{savedSignals.length} Adet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sinyal Hassasiyeti:</span>
                      <span className="font-bold text-emerald-400">Yüksek (90%+)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      // Trigger a mock command `/signal` via code
                      setTerminalInput("/signal");
                      // Execute via mock trigger
                      const fakeEvent = { preventDefault: () => {} };
                      setTimeout(() => {
                        const btn = document.getElementById("terminal-trigger");
                        if (btn) btn.click();
                      }, 100);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md shadow-purple-900/20 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white text-yellow-300 animate-pulse" />
                    Manuel Sinyal Tetikle (DB Kaydı)
                  </button>
                  <p className="text-[9px] text-slate-500 text-center mt-2">
                    Tetiklenen sinyaller terminale basılır ve veritabanına kaydedilir.
                  </p>
                </div>
              </div>

            </div>

            {/* List of saved signals from database */}
            <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
              <h3 className={`font-bold text-md mb-4 ${c.textColorPrimary} flex items-center gap-2`}>
                <TerminalIcon className="w-5 h-5 text-purple-400" />
                Neon DB Üzerinde Kayıtlı En Son 30 Sinyal Analizi
              </h3>

              {savedSignals.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Henüz yüksek güçte bir sinyal üretilmedi. "Manuel Sinyal Tetikle" butonuna basarak veya terminale{" "}
                  <code className="text-yellow-400">/signal</code> yazarak ilk sinyali anında oluşturabilirsiniz!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {savedSignals.map((sig, idx) => {
                    const isBuy = sig.signalType === "AL";
                    return (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-xl bg-black/20 border border-slate-700/10 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between border-b border-slate-700/10 pb-2 mb-2">
                          <span className={`font-mono font-black text-xs ${c.textColorPrimary}`}>{sig.assetId}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                          }`}>
                            {isBuy ? "GUÇLÜ AL" : "GUÇLÜ SAT"}
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">İsim:</span>
                            <span className={`font-semibold ${c.textColorPrimary} truncate max-w-[120px]`}>{sig.assetName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sinyal Skoru:</span>
                            <span className="text-yellow-400 font-bold">{sig.strength}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Kanallanan Fiyat:</span>
                            <span className={`font-bold ${c.textColorPrimary}`}>{sig.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Boyut Ağ Geçidi:</span>
                            <span className="text-purple-400 text-[10px] font-bold">{sig.dimension}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hidden interactive submit trigger for code injection */}
            <form onSubmit={handleExecuteCommand} className="hidden">
              <input 
                type="text" 
                value={terminalInput} 
                onChange={(e) => setTerminalInput(e.target.value)} 
              />
              <button id="terminal-trigger" type="submit">Submit</button>
            </form>

          </div>
        )}

        {/* ----------------- TAB: PORTFÖY (PORTFOLIO) ----------------- */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            
            {/* PORTFOLIO BALANCE OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-950 p-6 rounded-2xl text-white border border-blue-800 col-span-1 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-600/30 text-blue-300 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase border border-blue-500/20">
                      Simüle Canlı Portföy Durumu
                    </span>
                    <span className="text-xs text-blue-200">Neon DB Kaydı</span>
                  </div>
                  <h3 className="text-3xl font-black mt-4 font-mono text-white">
                    ₺{portfolioValueStats.currentValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-blue-300 mt-1">Toplam Portföy Değeri (TL bazında)</p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mt-6 text-xs font-mono">
                  <div>
                    <span className="text-blue-200 block text-[10px] uppercase">Toplam Maliyet</span>
                    <span className="font-bold text-slate-100">
                      ₺{portfolioValueStats.totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-200 block text-[10px] uppercase">Net Kar / Zarar</span>
                    <span className={`font-bold ${portfolioValueStats.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {portfolioValueStats.netProfit >= 0 ? "▲ +₺" : "▼ -₺"}
                      {Math.abs(portfolioValueStats.netProfit).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-200 block text-[10px] uppercase">Yüzde Değişim</span>
                    <span className={`font-bold ${portfolioValueStats.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {portfolioValueStats.netProfit >= 0 ? "+" : ""}
                      {portfolioValueStats.profitPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* QUICK ADD TRANSACTION FORM */}
              <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
                <h4 className={`font-extrabold text-sm mb-3 ${c.textColorPrimary} uppercase flex items-center gap-1.5`}>
                  <Plus className="w-4 h-4 text-blue-500" />
                  Yeni İşlem Ekle
                </h4>
                
                <form onSubmit={handleAddTransaction} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Varlık Seçin</label>
                    <select
                      value={newTransaction.assetId}
                      onChange={(e) => {
                        const selectedAsset = assets.find(a => a.id === e.target.value);
                        setNewTransaction({
                          ...newTransaction,
                          assetId: e.target.value,
                          buyPrice: selectedAsset ? selectedAsset.basePrice.toFixed(2) : ""
                        });
                      }}
                      className={`w-full p-2.5 rounded-lg text-xs font-bold border ${c.inputBg}`}
                    >
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.id} - {asset.name} ({asset.currency})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Miktar</label>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="Örn: 0.5"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        className={`w-full p-2.5 rounded-lg text-xs font-mono border ${c.inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Alış Fiyatı</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="Boş bırakılırsa canlı fiyat"
                        value={newTransaction.buyPrice}
                        onChange={(e) => setNewTransaction({ ...newTransaction, buyPrice: e.target.value })}
                        className={`w-full p-2.5 rounded-lg text-xs font-mono border ${c.inputBg}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition mt-2 shadow-sm"
                  >
                    Maliye Kaydet (DB Ekle)
                  </button>
                </form>
              </div>

            </div>

            {/* PORTFOLIO LISTING */}
            <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
              <h3 className={`font-bold text-md mb-4 ${c.textColorPrimary}`}>
                Portföyünüzdeki Varlıklar ve Anlık Kar/Zarar Durumları
              </h3>

              {portfolioList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Portföyünüz boş. Yukarıdaki formu kullanarak veya Piyasalar sayfasından tek tıkla simüle alım yaparak portföyünüzü oluşturun.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/10 text-xs text-slate-400">
                        <th className="pb-3 font-semibold">Sembol</th>
                        <th className="pb-3 font-semibold text-right">Miktar</th>
                        <th className="pb-3 font-semibold text-right">Alış Fiyatı</th>
                        <th className="pb-3 font-semibold text-right">Canlı Fiyat</th>
                        <th className="pb-3 font-semibold text-right">Maliyet (TL)</th>
                        <th className="pb-3 font-semibold text-right">Güncel Değer (TL)</th>
                        <th className="pb-3 font-semibold text-right">Kar / Zarar (TL)</th>
                        <th className="pb-3 font-semibold text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/5 text-xs font-mono">
                      {portfolioList.map((item) => {
                        const liveAsset = assets.find(a => a.id === item.assetId);
                        if (!liveAsset) return null;

                        const amountNum = parseFloat(item.amount);
                        const buyPriceNum = parseFloat(item.buyPrice);
                        const livePrice = liveAsset.basePrice;

                        // Calculate TRY conversion
                        let dollarRate = assets.find(a => a.id === "USDTRY")?.basePrice || 47.92;
                        let euroRate = assets.find(a => a.id === "EURTRY")?.basePrice || 55.52;

                        let currencySymbol = liveAsset.currency;
                        
                        let totalCostTRY = buyPriceNum * amountNum;
                        let totalCurrentTRY = livePrice * amountNum;

                        if (liveAsset.currency === "$") {
                          totalCostTRY = buyPriceNum * amountNum * dollarRate;
                          totalCurrentTRY = livePrice * amountNum * dollarRate;
                        } else if (liveAsset.currency === "€") {
                          totalCostTRY = buyPriceNum * amountNum * euroRate;
                          totalCurrentTRY = livePrice * amountNum * euroRate;
                        }

                        const pnlTRY = totalCurrentTRY - totalCostTRY;
                        const pnlPercent = totalCostTRY > 0 ? (pnlTRY / totalCostTRY) * 100 : 0;
                        const isProfit = pnlTRY >= 0;

                        return (
                          <tr key={item.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3 font-bold text-left flex items-center gap-1.5 font-sans">
                              <span 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-black"
                                style={{ backgroundColor: liveAsset.logoColor }}
                              >
                                {liveAsset.id.slice(0, 3)}
                              </span>
                              <div>
                                <span className={`${c.textColorPrimary} font-bold`}>{item.assetId}</span>
                                <span className="block text-[9px] text-slate-400">{liveAsset.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-right font-bold text-slate-200">
                              <span className={c.textColorPrimary}>{amountNum.toLocaleString("tr-TR", { maximumFractionDigits: 4 })}</span>
                            </td>
                            <td className="py-3 text-right text-slate-400">
                              {buyPriceNum.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} {currencySymbol}
                            </td>
                            <td className="py-3 text-right text-emerald-400 font-bold">
                              {livePrice.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} {currencySymbol}
                            </td>
                            <td className="py-3 text-right text-slate-400">
                              ₺{totalCostTRY.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right font-bold text-slate-200">
                              <span className={c.textColorPrimary}>₺{totalCurrentTRY.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}</span>
                            </td>
                            <td className={`py-3 text-right font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                              {isProfit ? "+" : ""}
                              {pnlPercent.toFixed(1)}% (
                              {isProfit ? "₺" : "-₺"}
                              {Math.abs(pnlTRY).toLocaleString("tr-TR", { maximumFractionDigits: 2 })})
                            </td>
                            <td className="py-3 text-center">
                              <button
                                onClick={() => handleDeletePortfolioItem(item.id, item.assetId)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition"
                                title="İşlemi Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ----------------- TAB: ARAÇLAR & ANALİZ (TOOLS) ----------------- */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. BAROMETRE (Fear & Greed Sentiment) */}
              <div className={`p-5 rounded-2xl ${c.cardBg} border space-y-4`}>
                <div className="flex items-center justify-between border-b border-slate-700/10 pb-3">
                  <h4 className={`font-bold text-sm ${c.textColorPrimary} uppercase`}>
                    🌡️ Piyasa Barometresi (Duygu Analizi)
                  </h4>
                  <span className="text-xs bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                    Aşırı Açgözlülük
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Sosyal medya, Telegram kanalları, işlem hacimleri ve kozmik frekansların matematiksel harmonikleriyle 
                  hesaplanan piyasa duyarlılık barometresi.
                </p>

                {/* Meter visualizer */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Aşırı Korku (0)</span>
                    <span className="text-yellow-400 font-bold">Nötr (50)</span>
                    <span className="text-emerald-400 font-bold">Açgözlülük (100)</span>
                  </div>
                  
                  {/* Slider bar with pointer */}
                  <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 rounded-full">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-900 rounded-full shadow-md flex items-center justify-center font-bold text-[9px] text-black transition-all duration-1000"
                      style={{ left: `calc(${energyLevel}% - 12px)` }}
                    >
                      {energyLevel}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center font-mono pt-1">
                    Son güncelleme: Az Önce (Enerji Yoğunluğuna göre dalgalanmaktadır)
                  </p>
                </div>

                <div className="p-3 bg-black/15 rounded-xl text-xs text-slate-300">
                  <strong className="text-white block mb-1">💡 Matrix Analiz Notu:</strong>
                  Şu anki {energyLevel > 70 ? "yüksek açgözlülük" : "temkinli nötr"} seviyesi, kozmik enerjilerin 
                  BIST 100 hisselerine para girişini desteklediğini gösteriyor. Kripto varlıklarda kaldıraçlı işlemlere dikkat edilmelidir.
                </div>
              </div>

              {/* 2. COMPARING MODULE */}
              <div className={`p-5 rounded-2xl ${c.cardBg} border space-y-4`}>
                <div className="flex items-center justify-between border-b border-slate-700/10 pb-3">
                  <h4 className={`font-bold text-sm ${c.textColorPrimary} uppercase`}>
                    ⚖️ Finansal Karşılaştırıcı (Side by Side)
                  </h4>
                  <span className="text-xs text-slate-400">Performans Analizi</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">A Varlığı</label>
                    <select
                      value={compareAssetA}
                      onChange={(e) => setCompareAssetA(e.target.value)}
                      className={`w-full p-2.5 rounded-lg text-xs font-bold border ${c.inputBg}`}
                    >
                      {assets.map((a) => (
                        <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">B Varlığı</label>
                    <select
                      value={compareAssetB}
                      onChange={(e) => setCompareAssetB(e.target.value)}
                      className={`w-full p-2.5 rounded-lg text-xs font-bold border ${c.inputBg}`}
                    >
                      {assets.map((b) => (
                        <option key={b.id} value={b.id}>{b.id} - {b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Side-by-side specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  
                  {/* Asset A Specs */}
                  <div className="p-3 bg-black/15 rounded-xl border border-white/5 space-y-1">
                    <div className="font-bold text-blue-400 text-sm border-b border-white/5 pb-1 mb-1">{assetAObj.id}</div>
                    <div><span className="text-slate-400">Fiyat:</span> {assetAObj.basePrice.toLocaleString("tr-TR")} {assetAObj.currency}</div>
                    <div>
                      <span className="text-slate-400">Değişim:</span>{" "}
                      <span className={assetAObj.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {assetAObj.change24h}%
                      </span>
                    </div>
                    <div><span className="text-slate-400">Hacim:</span> {assetAObj.volume}</div>
                    <div><span className="text-slate-400">Bölge:</span> {assetAObj.category}</div>
                  </div>

                  {/* Asset B Specs */}
                  <div className="p-3 bg-black/15 rounded-xl border border-white/5 space-y-1">
                    <div className="font-bold text-purple-400 text-sm border-b border-white/5 pb-1 mb-1">{assetBObj.id}</div>
                    <div><span className="text-slate-400">Fiyat:</span> {assetBObj.basePrice.toLocaleString("tr-TR")} {assetBObj.currency}</div>
                    <div>
                      <span className="text-slate-400">Değişim:</span>{" "}
                      <span className={assetBObj.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {assetBObj.change24h}%
                      </span>
                    </div>
                    <div><span className="text-slate-400">Hacim:</span> {assetBObj.volume}</div>
                    <div><span className="text-slate-400">Bölge:</span> {assetBObj.category}</div>
                  </div>

                </div>

                <div className="text-[11px] text-center text-slate-400 italic">
                  * Varlıkların canlı fiyat güncellemeleri anlık olarak yukarıdaki tablolarda simüle edilmektedir.
                </div>
              </div>

            </div>

            {/* TECHNICAL MATRIX SCREENER */}
            <div className={`p-5 rounded-2xl ${c.cardBg} border`}>
              <h3 className={`font-bold text-md mb-2 ${c.textColorPrimary} flex items-center gap-1.5`}>
                📊 Canlı Teknik Göstergeler & Sinyal Tarama Motoru
              </h3>
              <p className={`text-xs ${c.textColorSecondary} mb-4`}>
                Hareketli Ortalamalar (EMA, SMA) ve RSI indikatörleri temel alınarak boyutsal dalgalarla hesaplanmıştır.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/10 text-xs text-slate-400 font-mono">
                      <th className="pb-3">Sembol</th>
                      <th className="pb-3 text-right">RSI (14)</th>
                      <th className="pb-3 text-right">EMA (20)</th>
                      <th className="pb-3 text-right">Stochastic</th>
                      <th className="pb-3 text-center">Teknik Özet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/5 text-xs font-mono">
                    {assets.slice(0, 8).map((asset) => {
                      const rsiVal = Math.floor(40 + (asset.change24h * 5) + (Math.random() * 8));
                      const limitedRsi = Math.min(95, Math.max(10, rsiVal));
                      
                      let signal = "NÖTR";
                      let color = "bg-slate-500/15 text-slate-400";
                      
                      if (limitedRsi > 70) {
                        signal = "AŞIRI ALIM (SAT)";
                        color = "bg-rose-500/15 text-rose-400";
                      } else if (limitedRsi < 35) {
                        signal = "AŞIRI SATIM (AL)";
                        color = "bg-emerald-500/15 text-emerald-400";
                      } else if (asset.change24h > 1.5) {
                        signal = "AL";
                        color = "bg-emerald-500/15 text-emerald-400";
                      } else if (asset.change24h < -1.5) {
                        signal = "SAT";
                        color = "bg-rose-500/15 text-rose-400";
                      }

                      return (
                        <tr key={asset.id} className="hover:bg-slate-500/5">
                          <td className="py-2.5 font-bold font-sans">{asset.id}</td>
                          <td className="py-2.5 text-right font-bold text-slate-300">
                            <span className={c.textColorPrimary}>{limitedRsi}</span>
                          </td>
                          <td className="py-2.5 text-right text-slate-400">
                            {(asset.basePrice * 0.995).toLocaleString("tr-TR", { maximumFractionDigits: 3 })}
                          </td>
                          <td className="py-2.5 text-right text-slate-400">
                            {Math.floor(20 + Math.random() * 70)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
                              {signal}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB: REHBER (APK & GITHUB GUIDE) ----------------- */}
        {activeTab === "guide" && (
          <div className="space-y-6">
            
            <div className={`p-6 rounded-2xl ${c.cardBg} border space-y-6`}>
              
              <div className="border-b border-slate-700/10 pb-4">
                <span className="bg-blue-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  Adım Adım Başlangıç Kılavuzu (Türkçe)
                </span>
                <h3 className={`text-2xl font-black mt-2 ${c.textColorPrimary}`}>
                  GitHub Bilmeyenler İçin: Vercel, Neon DB ve Mobil APK Yapma Rehberi
                </h3>
                <p className={`text-xs ${c.textColorSecondary} mt-1`}>
                  Bu kılavuz, hazırladığımız bu projeyi GitHub hesabınıza yükleme, Vercel/Neon ile canlıda tutma ve Android telefonunuz için APK dosyası üretme adımlarını en acemi seviyede anlatır.
                </p>
              </div>

              {/* STEP 1 */}
              <div className="space-y-2">
                <h4 className={`font-bold text-sm ${c.textColorPrimary} flex items-center gap-2`}>
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  GitHub Hesabı Oluşturma ve Kodu Yükleme
                </h4>
                <div className={`text-xs ${c.textColorSecondary} space-y-2 pl-8 leading-relaxed`}>
                  <p>
                    <strong>GitHub nedir?</strong> GitHub, kodlarınızı internette güvenle saklamanızı ve Vercel gibi platformların bu kodları otomatik olarak okuyup web sitesine dönüştürmesini sağlayan bir kütüphanedir.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">github.com</a> adresine gidin ve ücretsiz bir hesap açın.</li>
                    <li>Sitede sağ üstteki yeşil <strong>"New" (Yeni)</strong> butonuna basarak yeni bir "Repository" (Depo) oluşturun.</li>
                    <li>Deponuzun ismine <code className="bg-black/20 px-1 py-0.5 rounded text-white font-mono">alpha-finans-app</code> yazın, "Public" (Açık) olarak işaretleyin ve oluşturun.</li>
                    <li>Kullanmakta olduğunuz bu editördeki kodları indirmek veya yüklemek için, tarayıcınızın veya bilgisayarınızın terminalinden birkaç basit Git komutunu sırayla kopyalayıp yapıştırabilirsiniz. (Git yazılımını bilgisayarınıza kurup sırasıyla <code className="bg-black/20 text-white px-1">git init</code>, <code className="bg-black/20 text-white px-1">git add .</code>, <code className="bg-black/20 text-white px-1">git commit -m "ilk sürüm"</code> ve oluşturduğunuz github linkini bağlayarak <code className="bg-black/20 text-white px-1">git push</code> yapmanız yeterlidir).</li>
                  </ol>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="space-y-2">
                <h4 className={`font-bold text-sm ${c.textColorPrimary} flex items-center gap-2`}>
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  Vercel ve Neon Tech (PostgreSQL) Bağlantısı
                </h4>
                <div className={`text-xs ${c.textColorSecondary} space-y-2 pl-8 leading-relaxed`}>
                  <p>
                    Uygulamanızın canlı borsa verilerini ve portföy/izleme listesi gibi verileri kaydetmesi için bir veritabanı gerekir. Neon Tech bunu ücretsiz sunar.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><a href="https://neon.tech" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">neon.tech</a> adresine gidin ve üye olun.</li>
                    <li>Tek tıkla yeni bir <strong>PostgreSQL</strong> veritabanı projesi oluşturun.</li>
                    <li>Neon size bir bağlantı adresi verecektir (<code className="bg-black/20 text-white px-1">postgresql://...</code> ile başlar). Bu adresi kopyalayın.</li>
                    <li><a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">vercel.com</a> adresine gidip üye olun ve GitHub hesabınızı bağlayın.</li>
                    <li>Vercel panelinde <strong>"Add New Project"</strong> diyerek GitHub'daki <code className="bg-black/20 text-white px-1">alpha-finans-app</code> projenizi seçip <strong>Import</strong> edin.</li>
                    <li>Dağıtımdan önce "Environment Variables" (Çevre Değişkenleri) kısmına isim olarak <code className="text-yellow-400 font-mono">DATABASE_URL</code> yazın ve değer kısmına Neon'dan kopyaladığınız bağlantı adresini yapıştırın.</li>
                    <li><strong>Deploy</strong> butonuna basın. Saniyeler içinde siteniz dünya çapında erişilebilir bir <code className="text-blue-400">vercel.app</code> adresinde canlıya çıkacaktır!</li>
                  </ol>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="space-y-2">
                <h4 className={`font-bold text-sm ${c.textColorPrimary} flex items-center gap-2`}>
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  Bu Web Sitesini Telefonunuzda APK Olarak Çalıştırmak (En Kolay Yöntem)
                </h4>
                <div className={`text-xs ${c.textColorSecondary} space-y-2 pl-8 leading-relaxed`}>
                  <p>
                    Uygulamanızı Google Play Store standartlarında bir Android APK dosyasına dönüştürmek için <strong>3 kolay seçeneğiniz</strong> var:
                  </p>

                  <div className="space-y-3 mt-2">
                    <div className="p-3 bg-black/15 rounded-lg border border-white/5">
                      <strong className="text-white block text-xs">Yöntem A: Ücretsiz Online WebView Dönüştürücüler (Acemiler için En Kolayı)</strong>
                      <p className="mt-1">
                        Hiçbir yazılım yüklemeden, sitenizin Vercel linkini (<code className="text-blue-400">https://projeniz.vercel.app</code>) tarayıcınızda açıp 
                        web-to-apk servislerinden birine yapıştırarak saniyeler içinde APK dosyanızı indirebilirsiniz:
                      </p>
                      <ul className="list-disc pl-4 mt-1.5 space-y-1">
                        <li><a href="https://www.webintoapp.com" target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline">WebIntoApp</a>: Ücretsizce uygulamanıza logo ekleyip APK indirmenizi sağlar.</li>
                        <li><a href="https://gonative.io" target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline">Median.co (GoNative)</a>: Çok profesyonel bir web view sarmalayıcısıdır.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-black/15 rounded-lg border border-white/5">
                      <strong className="text-white block text-xs">Yöntem B: CapacitorJS (Profesyonel ve Hibrit Sürüm)</strong>
                      <p className="mt-1">
                        Next.js projenizin içerisine CapacitorJS kütüphanesini kurarak gerçek bir Android Studio projesi oluşturabilirsiniz.
                      </p>
                      <pre className="bg-black/40 text-cyan-300 p-2 rounded text-[10px] font-mono mt-1 overflow-x-auto leading-tight">
{`npm install @capacitor/core @capacitor/cli
npx cap init "Alpha Finans" "com.alphafinans.app" --web-dir=out
npx cap add android
npx cap open android`}
                      </pre>
                      <p className="mt-1 text-[11px]">
                        Bu komutlardan sonra <strong>Android Studio</strong> açılacak ve tek tıkla "Build APK" diyerek telefonunuz için orijinal APK çıktısını alabileceksiniz!
                      </p>
                    </div>

                    <div className="p-3 bg-black/15 rounded-lg border border-white/5">
                      <strong className="text-white block text-xs">Yöntem C: PWA (Aşamalı Web Uygulaması) Olarak Yüklemek</strong>
                      <p className="mt-1">
                        APK üretmeden de telefonunuzun tarayıcısından (Chrome veya Safari) sitenize girip sağ üstteki seçeneklerden 
                        <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> butonuna basarak, siteyi telefonunuza tıpkı bir mobil uygulama gibi 
                        logosuyla yükleyebilirsiniz. Çevrimdışı desteğiyle tam ekran çalışacaktır!
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* LEAVE SUGGESTIONS SECTION TO PERSIST ON NEON TECH DB */}
            <div className={`p-6 rounded-2xl ${c.cardBg} border space-y-4`}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className={`font-bold text-md ${c.textColorPrimary}`}>
                  Geliştirici Geri Bildirim ve İstek Kutusu (Canlı DB)
                </h3>
              </div>
              <p className={`text-xs ${c.textColorSecondary}`}>
                Uygulama hakkında sorularınız, eklenmesini istediğiniz özellikler veya borsa önerileriniz varsa aşağıdan yazın. 
                Mesajınız doğrudan Neon PostgreSQL veritabanına kaydedilecektir!
              </p>

              {feedbackStatus.show && (
                <div className={`p-3 rounded-lg text-xs font-bold ${
                  feedbackStatus.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {feedbackStatus.message}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Adınız veya Takma Adınız</label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Can"
                      value={feedbackInput.userName}
                      onChange={(e) => setFeedbackInput({ ...feedbackInput, userName: e.target.value })}
                      className={`w-full p-2.5 rounded-lg text-xs border ${c.inputBg}`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Mesajınız / Öneriniz</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: BIST 30 hisselerine daha fazla indikatör ekleyelim..."
                      value={feedbackInput.message}
                      onChange={(e) => setFeedbackInput({ ...feedbackInput, message: e.target.value })}
                      className={`w-full p-2.5 rounded-lg text-xs border ${c.inputBg}`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
                >
                  Kozmik Sunucuya Gönder
                </button>
              </form>

              {/* Feedbacks Listing from db */}
              <div className="mt-4 pt-4 border-t border-slate-700/10">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Canlı Geri Bildirimler</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin text-xs">
                  {feedbacks.length === 0 ? (
                    <p className="text-slate-500 italic text-[11px]">Henüz hiçbir geri bildirim gönderilmedi. İlkini siz yazın!</p>
                  ) : (
                    feedbacks.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-black/10 border border-white/5">
                        <div className="flex justify-between items-center mb-1 text-[10px]">
                          <span className="font-bold text-blue-400">{f.userName}</span>
                          <span className="text-slate-500 font-mono">
                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString("tr-TR") : "Yeni"}
                          </span>
                        </div>
                        <p className={`text-xs ${c.textColorPrimary}`}>{f.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER - MOBILE FIRST DESIGN NAVIGATION BOTTOM BAR (Matches exact photos) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 ${c.bottomNavBg} border-t py-2 px-3 transition-colors duration-300`}>
        <div className="max-w-md mx-auto flex items-center justify-between text-center">
          
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "home" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <Home className="w-5 h-5 mx-auto" />
            <span className="text-[10px] font-bold block mt-0.5">Ana Sayfa</span>
          </button>

          <button 
            onClick={() => setActiveTab("watchlist")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "watchlist" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <Star className="w-5 h-5 mx-auto" />
            <span className="text-[10px] font-bold block mt-0.5">İzleme</span>
          </button>

          <button 
            onClick={() => setActiveTab("markets")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "markets" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <BarChart2 className="w-5 h-5 mx-auto" />
            <span className="text-[10px] font-bold block mt-0.5">Piyasalar</span>
          </button>

          <button 
            onClick={() => setActiveTab("cosmic")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "cosmic" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
            title="Kozmik Sinyaller"
          >
            <Cpu className="w-5 h-5 mx-auto text-purple-400 animate-spin-slow" />
            <span className="text-[10px] font-bold block mt-0.5 text-purple-400">Boyutlar</span>
          </button>

          <button 
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "portfolio" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <Briefcase className="w-5 h-5 mx-auto" />
            <span className="text-[10px] font-bold block mt-0.5">Portföy</span>
          </button>

          <button 
            onClick={() => setActiveTab("tools")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "tools" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <Settings className="w-5 h-5 mx-auto" />
            <span className="text-[10px] font-bold block mt-0.5">Araçlar</span>
          </button>

          <button 
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-1 rounded-xl transition ${activeTab === "guide" ? c.bottomNavActive : "text-slate-400 hover:text-slate-300"}`}
          >
            <BookOpen className="w-5 h-5 mx-auto text-blue-400" />
            <span className="text-[10px] font-bold block mt-0.5 text-blue-400">Rehber</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
