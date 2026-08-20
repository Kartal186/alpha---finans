export interface Asset {
  id: string; // e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  category: "Crypto" | "Stocks-TR" | "Stocks-EU" | "Stocks-AS" | "Commodity";
  basePrice: number;
  currency: "TL" | "$" | "€";
  change24h: number; // e.g. 1.40
  volume: string; // e.g. "61,2 Mlr" or "33,6 Mn"
  logoColor: string; // Tailwind hex color
  subText?: string;
}

export const INITIAL_ASSETS: Asset[] = [
  // --- DOVIZ & EMTIA ---
  { id: "XU100", name: "Bist 100 Endeksi", category: "Stocks-TR", basePrice: 14111.22, currency: "TL", change24h: -0.15, volume: "61,2 Mlr", logoColor: "#0284c7", subText: "BIST 100 Endeksi" },
  { id: "XU030", name: "Bist 30 Endeksi", category: "Stocks-TR", basePrice: 16251.00, currency: "TL", change24h: 0.31, volume: "42,8 Mlr", logoColor: "#0369a1", subText: "BIST 30 Endeksi" },
  { id: "USDTRY", name: "Dolar / TL", category: "Commodity", basePrice: 47.92, currency: "TL", change24h: 0.12, volume: "12,4 Mlr", logoColor: "#16a34a", subText: "Dolar Kuru" },
  { id: "EURTRY", name: "Euro / TL", category: "Commodity", basePrice: 55.52, currency: "TL", change24h: 0.05, volume: "9,8 Mlr", logoColor: "#2563eb", subText: "Euro Kuru" },
  { id: "GRAMALTIN", name: "Gram Altın", category: "Commodity", basePrice: 6767.82, currency: "TL", change24h: -0.54, volume: "5,4 Mlr", logoColor: "#ca8a04", subText: "Gram Altın Fiyatı" },
  { id: "XAUUSD", name: "Ons Altın", category: "Commodity", basePrice: 4392.77, currency: "$", change24h: -0.55, volume: "18,2 Mlr", logoColor: "#eab308", subText: "Spot Gold" },
  { id: "XAGUSD", name: "Ons Gümüş", category: "Commodity", basePrice: 100.11, currency: "$", change24h: 1.27, volume: "3,1 Mlr", logoColor: "#94a3b8", subText: "Spot Silver" },

  // --- CRYPTO ---
  { id: "BTC", name: "Bitcoin", category: "Crypto", basePrice: 64262.34, currency: "$", change24h: 1.40, volume: "48,5 Mlr", logoColor: "#f59e0b", subText: "BTC / USDT" },
  { id: "ETH", name: "Ethereum", category: "Crypto", basePrice: 1899.88, currency: "$", change24h: 0.32, volume: "22,1 Mlr", logoColor: "#6366f1", subText: "ETH / USDT" },
  { id: "BNB", name: "BNB Chain", category: "Crypto", basePrice: 602.90, currency: "$", change24h: -0.35, volume: "3,8 Mlr", logoColor: "#eab308", subText: "BNB / USDT" },
  { id: "SOL", name: "Solana", category: "Crypto", basePrice: 76.14, currency: "$", change24h: 1.26, volume: "6,2 Mlr", logoColor: "#a855f7", subText: "SOL / USDT" },
  { id: "XRP", name: "Ripple", category: "Crypto", basePrice: 0.9969, currency: "$", change24h: -0.09, volume: "1,9 Mlr", logoColor: "#2563eb", subText: "XRP / USDT" },
  { id: "DOGE", name: "Dogecoin", category: "Crypto", basePrice: 0.06989, currency: "$", change24h: -0.23, volume: "920 Mn", logoColor: "#eab308", subText: "DOGE / USDT" },
  { id: "ADA", name: "Cardano", category: "Crypto", basePrice: 0.1730, currency: "$", change24h: -1.20, volume: "410 Mn", logoColor: "#0284c7", subText: "ADA / USDT" },
  { id: "AVAX", name: "Avalanche", category: "Crypto", basePrice: 6.33, currency: "$", change24h: 0.17, volume: "550 Mn", logoColor: "#ef4444", subText: "AVAX / USDT" },
  { id: "DOT", name: "Polkadot", category: "Crypto", basePrice: 0.7360, currency: "$", change24h: -3.03, volume: "280 Mn", logoColor: "#db2777", subText: "DOT / USDT" },
  { id: "LINK", name: "Chainlink", category: "Crypto", basePrice: 14.85, currency: "$", change24h: 0.85, volume: "340 Mn", logoColor: "#2563eb", subText: "LINK / USDT" },
  { id: "TON", name: "Telegram Open Network", category: "Crypto", basePrice: 5.42, currency: "$", change24h: 2.15, volume: "750 Mn", logoColor: "#06b6d4", subText: "TON / USDT" },

  // --- TURKISH STOCKS ---
  { id: "ECOGR", name: "Ecogreen Enerji A.Ş.", category: "Stocks-TR", basePrice: 36.74, currency: "TL", change24h: 0.93, volume: "33,6 Mn", logoColor: "#22c55e", subText: "ECOGR" },
  { id: "CANTE", name: "Çan2 Termik A.Ş.", category: "Stocks-TR", basePrice: 1.22, currency: "TL", change24h: -0.81, volume: "64,7 Mn", logoColor: "#f97316", subText: "CANTE" },
  { id: "KARCL", name: "Kardemir Çelik Sanayi", category: "Stocks-TR", basePrice: 95.70, currency: "TL", change24h: 10.00, volume: "112 Mn", logoColor: "#3b82f6", subText: "KARCL" },
  { id: "CITAS", name: "Çitaş Tarım Ürünleri", category: "Stocks-TR", basePrice: 81.05, currency: "TL", change24h: 9.97, volume: "84 Mn", logoColor: "#a855f7", subText: "CITAS" },
  { id: "NETAS", name: "Netaş Telekomünikasyon", category: "Stocks-TR", basePrice: 75.10, currency: "TL", change24h: 9.96, volume: "45 Mn", logoColor: "#06b6d4", subText: "NETAS" },
  { id: "TKNSA", name: "Teknosa İç ve Dış", category: "Stocks-TR", basePrice: 21.70, currency: "TL", change24h: 9.93, volume: "29 Mn", logoColor: "#f97316", subText: "TKNSA" },
  { id: "HKTM", name: "Hidropar Hareket Kontrol", category: "Stocks-TR", basePrice: 13.29, currency: "TL", change24h: 9.93, volume: "12 Mn", logoColor: "#ec4899", subText: "HKTM" },
  { id: "ISVEA", name: "Isvea Yapı Malzemeleri", category: "Stocks-TR", basePrice: 60.40, currency: "TL", change24h: 9.92, volume: "18 Mn", logoColor: "#14b8a6", subText: "ISVEA" },
  { id: "BJKAS", name: "Beşiktaş Futbol Yat.", category: "Stocks-TR", basePrice: 2.22, currency: "TL", change24h: 9.90, volume: "140 Mn", logoColor: "#0f172a", subText: "BJKAS" },
  { id: "OSMEN", name: "Osmanlı Menkul Değerler", category: "Stocks-TR", basePrice: 8.66, currency: "TL", change24h: 9.90, volume: "8,6 Mn", logoColor: "#4f46e5", subText: "OSMEN" },
  { id: "AKFIS", name: "Akfen GYO", category: "Stocks-TR", basePrice: 16.50, currency: "TL", change24h: 8.70, volume: "52 Mn", logoColor: "#a855f7", subText: "AKFIS" },
  { id: "GOLTS", name: "Göltaş Çimento", category: "Stocks-TR", basePrice: 320.75, currency: "TL", change24h: 7.91, volume: "14 Mn", logoColor: "#64748b", subText: "GOLTS" },
  { id: "BAGFS", name: "Bağfaş Gübre", category: "Stocks-TR", basePrice: 26.90, currency: "TL", change24h: 7.26, volume: "21 Mn", logoColor: "#ea580c", subText: "BAGFS" },
  { id: "DERHL", name: "Derlüks Yatırım Holding", category: "Stocks-TR", basePrice: 2.45, currency: "TL", change24h: 6.99, volume: "31 Mn", logoColor: "#e11d48", subText: "DERHL" },
  { id: "TSPOR", name: "Trabzonspor Sportif", category: "Stocks-TR", basePrice: 1.08, currency: "TL", change24h: 6.93, volume: "190 Mn", logoColor: "#0284c7", subText: "TSPOR" },
  { id: "PRZMA", name: "Prizma Pres Matbaacılık", category: "Stocks-TR", basePrice: 84.30, currency: "TL", change24h: 6.44, volume: "6,4 Mn", logoColor: "#16a34a", subText: "PRZMA" },

  // --- DUSENLER (TR) ---
  { id: "TMPOL", name: "Tempopol Polimer", category: "Stocks-TR", basePrice: 472.25, currency: "TL", change24h: -9.96, volume: "92 Mn", logoColor: "#06b6d4", subText: "TMPOL" },
  { id: "CRFSA", name: "CarrefourSA Ticaret", category: "Stocks-TR", basePrice: 274.25, currency: "TL", change24h: -9.93, volume: "34 Mn", logoColor: "#3b82f6", subText: "CRFSA" },
  { id: "KATMR", name: "Katmerciler Ekipman", category: "Stocks-TR", basePrice: 2.07, currency: "TL", change24h: -8.81, volume: "120 Mn", logoColor: "#b91c1c", subText: "KATMR" },
  { id: "ODINE", name: "Odine Teknoloji", category: "Stocks-TR", basePrice: 2770.00, currency: "TL", change24h: -7.97, volume: "5,4 Mn", logoColor: "#14b8a6", subText: "ODINE" },
  { id: "AZTEK", name: "Aztek Teknoloji", category: "Stocks-TR", basePrice: 4.18, currency: "TL", change24h: -7.73, volume: "16 Mn", logoColor: "#e11d48", subText: "AZTEK" },
  { id: "MEGMT", name: "Mega Metal Sanayi", category: "Stocks-TR", basePrice: 67.55, currency: "TL", change24h: -7.47, volume: "22 Mn", logoColor: "#0891b2", subText: "MEGMT" },
  { id: "LIDER", name: "Lider Filo Yönetim", category: "Stocks-TR", basePrice: 43.62, currency: "TL", change24h: -7.19, volume: "11 Mn", logoColor: "#d97706", subText: "LIDER" },
  { id: "ZGYO", name: "Ziraat GYO", category: "Stocks-TR", basePrice: 34.84, currency: "TL", change24h: -6.60, volume: "45 Mn", logoColor: "#ca8a04", subText: "ZGYO" },
  { id: "DIRIT", name: "Diriliş Tekstil", category: "Stocks-TR", basePrice: 27.00, currency: "TL", change24h: -6.57, volume: "1,2 Mn", logoColor: "#be185d", subText: "DIRIT" },
  { id: "BARMA", name: "Barem Ambalaj", category: "Stocks-TR", basePrice: 10.22, currency: "TL", change24h: -6.32, volume: "19 Mn", logoColor: "#1d4ed8", subText: "BARMA" },
  { id: "ULUSE", name: "Ulusoy Elektrik", category: "Stocks-TR", basePrice: 287.50, currency: "TL", change24h: -6.28, volume: "3,8 Mn", logoColor: "#0369a1", subText: "ULUSE" },
  { id: "FORTE", name: "Forte Bilgi İşlem", category: "Stocks-TR", basePrice: 134.30, currency: "TL", change24h: -6.08, volume: "8,1 Mn", logoColor: "#15803d", subText: "FORTE" },
  { id: "BESTE", name: "Beste Kimya", category: "Stocks-TR", basePrice: 34.16, currency: "TL", change24h: -5.90, volume: "2,4 Mn", logoColor: "#4d7c0f", subText: "BESTE" },
  { id: "KTLEV", name: "Katılımevim GYO", category: "Stocks-TR", basePrice: 49.96, currency: "TL", change24h: -5.74, volume: "15 Mn", logoColor: "#4338ca", subText: "KTLEV" },

  // --- EUROPE STOCKS ---
  { id: "SAP", name: "SAP SE", category: "Stocks-EU", basePrice: 178.40, currency: "€", change24h: 1.15, volume: "4,5 Mn", logoColor: "#0284c7", subText: "Almanya Teknoloji" },
  { id: "ASML", name: "ASML Holding", category: "Stocks-EU", basePrice: 842.10, currency: "€", change24h: -0.85, volume: "2,1 Mn", logoColor: "#2563eb", subText: "Hollanda Yarı İletken" },
  { id: "SHELL", name: "Shell PLC", category: "Stocks-EU", basePrice: 31.85, currency: "€", change24h: 0.42, volume: "12,1 Mn", logoColor: "#eab308", subText: "İngiltere Enerji" },
  { id: "MC", name: "LVMH Moët Hennessy", category: "Stocks-EU", basePrice: 785.00, currency: "€", change24h: -1.25, volume: "1,1 Mn", logoColor: "#7c3aed", subText: "Fransa Lüks Tüketim" },
  { id: "NESN", name: "Nestlé S.A.", category: "Stocks-EU", basePrice: 94.20, currency: "€", change24h: 0.18, volume: "3,5 Mn", logoColor: "#ef4444", subText: "İsviçre Gıda Dev" },
  { id: "AZN", name: "AstraZeneca", category: "Stocks-EU", basePrice: 118.60, currency: "€", change24h: 2.30, volume: "4,1 Mn", logoColor: "#0d9488", subText: "Avrupa İlaç Dev" },

  // --- ASIA STOCKS ---
  { id: "TSMC", name: "TSMC Co.", category: "Stocks-AS", basePrice: 142.30, currency: "$", change24h: 3.45, volume: "18,4 Mn", logoColor: "#db2777", subText: "Tayvan Yarı İletken" },
  { id: "SONY", name: "Sony Group Corp", category: "Stocks-AS", basePrice: 88.40, currency: "$", change24h: 0.75, volume: "3,8 Mn", logoColor: "#0f172a", subText: "Japonya Elektronik" },
  { id: "TCEHY", name: "Tencent Holdings", category: "Stocks-AS", basePrice: 48.90, currency: "$", change24h: -1.05, volume: "6,7 Mn", logoColor: "#2563eb", subText: "Çin İnternet Dev" },
  { id: "7203", name: "Toyota Motor Corp", category: "Stocks-AS", basePrice: 198.50, currency: "$", change24h: 1.12, volume: "9,2 Mn", logoColor: "#e11d48", subText: "Japonya Otomotiv" },
  { id: "BABA", name: "Alibaba Group", category: "Stocks-AS", basePrice: 76.80, currency: "$", change24h: -2.35, volume: "14,5 Mn", logoColor: "#ea580c", subText: "Çin E-Ticaret" },
  { id: "RELIANCE", name: "Reliance Industries", category: "Stocks-AS", basePrice: 32.10, currency: "$", change24h: 0.65, volume: "5,1 Mn", logoColor: "#15803d", subText: "Hindistan Telekom" }
];
