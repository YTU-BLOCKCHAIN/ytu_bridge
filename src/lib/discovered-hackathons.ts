// ============================================================================
// Keşfedilen Hackathonlar — VERİ KAYNAĞI
// ============================================================================
// Bu dosya, hackathon keşif akışının tek kaynağıdır.
//
// AKIŞ:
//   1. Sen Twitter'da hackathon duyurusu görürsün → metni kopyalarsın
//      (site adı, tarih, konum, ödül, link vs.)
//   2. O metni sohbette bana (AI'ye) yapıştırırsın
//   3. Ben parse edip bu dosyaya yeni bir kayıt eklerim (id, name, organizer,
//      dateStart, dateEnd, location, tracks, chains, prizePool, externalLink,
//      source, status, notes)
//   4. Commit + push → Vercel otomatik yeniden deploy eder
//   5. Site build sırasında bu dosyayı okur → /discovery ve /directory'de gösterir
//
// KURALLAR (ben eklerken uygularım):
//   - id: h1, h2, h3... (artan)
//   - status: bugünün tarihine göre upcoming/ongoing/computed otomatik (ama elle de yazılır)
//   - tracks: spec'teki HackathonTrack enum'ından seç
//   - chains: Ethereum, Base, Monad, Solana, Stellar, Polygon, Arbitrum, Optimism, Other
//   - Tarihler ISO: YYYY-MM-DD
//   - Bilinmeyen alanları boş bırak (prizePool?: string, dateEnd?: string)
//   - source: nereden buldun (Twitter @hesap, DoraHacks, ETHGlobal, vs.)
// ============================================================================

export type HackathonTrack =
  | "DeFi"
  | "NFT/Gaming"
  | "Infra/Tooling"
  | "ZK/Privacy"
  | "AI×Web3"
  | "Public Goods"
  | "Social/Consumer"
  | "Other";

export type Chain =
  | "Ethereum"
  | "Base"
  | "Monad"
  | "Solana"
  | "Stellar"
  | "Polygon"
  | "Arbitrum"
  | "Optimism"
  | "Algorand"
  | "Casper"
  | "Sui"
  | "Injective"
  | "NEAR"
  | "BNB"
  | "Other";

export type HackathonStatus = "upcoming" | "ongoing" | "completed";

export interface DiscoveredHackathon {
  id: string;
  name: string;
  organizer: string;
  dateStart: string; // ISO YYYY-MM-DD
  dateEnd?: string;
  location: string; // "online", "İstanbul", "Lisbon"...
  status: HackathonStatus;
  tracks: HackathonTrack[];
  chains: Chain[];
  idealTeamSize: number;
  prizePool?: string;
  applicationDeadline?: string;
  externalLink?: string;
  source: string; // "Twitter @ethglobal", "DoraHacks", vs.
  notes?: string; // AI/notlar
  discoveredAt: string; // ne zaman eklendi
}

// --- Bugünün tarihine göre status hesapla (build time) ---
function computeStatus(h: Pick<DiscoveredHackathon, "dateStart" | "dateEnd" | "status">): HackathonStatus {
  const today = new Date();
  const start = new Date(h.dateStart);
  const end = h.dateEnd ? new Date(h.dateEnd) : new Date(h.dateStart);
  // çoktan bitmişse completed
  if (end < today) return "completed";
  // başlamış ama bitmemişse ongoing
  if (start <= today && end >= today) return "ongoing";
  return "upcoming";
}

// --- KEŞFEDİLEN HACKATHONLAR (buraya ben eklerim) ---
const RAW: DiscoveredHackathon[] = [
  {
    id: "h1",
    name: "ETHGlobal İstanbul 2026",
    organizer: "ETHGlobal",
    dateStart: "2026-03-12",
    dateEnd: "2026-03-14",
    location: "İstanbul",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling"],
    chains: ["Ethereum", "Base"],
    idealTeamSize: 4,
    prizePool: "$1M+",
    applicationDeadline: "2026-02-20",
    externalLink: "https://ethglobal.com/events/istanbul2026",
    source: "Twitter @ethglobal",
    notes: "Büyük EVM hackathon'u. Mevcut refaktor ve TroyLayer projeleri Infra/Tooling track'ine uygun.",
    discoveredAt: "2026-07-04",
  },
  {
    id: "h2",
    name: "Solana Breakpoint Hackathon",
    organizer: "Solana Foundation",
    dateStart: "2026-04-08",
    dateEnd: "2026-04-10",
    location: "online",
    status: "upcoming",
    tracks: ["NFT/Gaming", "DeFi"],
    chains: ["Solana"],
    idealTeamSize: 4,
    prizePool: "$500K",
    applicationDeadline: "2026-03-25",
    externalLink: "https://solana.com/breakpoint",
    source: "Twitter @solana",
    notes: "ROLET projesi yüksek uygunluk — Solana working-demo.",
    discoveredAt: "2026-07-04",
  },
  // --- ETHGlobal'den araştırıldı (ethglobal.com/events) ---
  {
    id: "h3",
    name: "ETHGlobal Lisbon 2026",
    organizer: "ETHGlobal",
    dateStart: "2026-07-24",
    dateEnd: "2026-07-26",
    location: "Lisbon, Portekiz",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling", "Public Goods"],
    chains: ["Ethereum", "Base", "Optimism", "Arbitrum"],
    idealTeamSize: 4,
    prizePool: "$1M+",
    applicationDeadline: "2026-07-25",
    externalLink: "https://ethglobal.com/events/lisbon2026",
    source: "ETHGlobal (araştırıldı)",
    notes: "Büyük EVM hackathon'u. Mevcut refaktor ve TroyLayer projeleri Infra/Tooling track'ine uygun. EVM zinciri olduğu için catchcat-monad'a port gerekir.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h4",
    name: "ETHOnline 2026",
    organizer: "ETHGlobal",
    dateStart: "2026-09-04",
    dateEnd: "2026-09-16",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling", "AI×Web3"],
    chains: ["Ethereum", "Base", "Optimism", "Arbitrum"],
    idealTeamSize: 4,
    prizePool: "$500K+",
    applicationDeadline: "2026-09-03",
    externalLink: "https://ethglobal.com/events/ethonline2026",
    source: "ETHGlobal (araştırıldı)",
    notes: "Async online hackathon — 12 gün. Uzun süre olduğu için projelerin olgunlaştırılmasına uygun. AI×Web3 track'i catchcat-monad ile eşleşir.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h5",
    name: "ETHGlobal Tokyo 2026",
    organizer: "ETHGlobal",
    dateStart: "2026-09-25",
    dateEnd: "2026-09-27",
    location: "Tokyo, Japonya",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling", "Public Goods"],
    chains: ["Ethereum", "Base", "Optimism", "Arbitrum"],
    idealTeamSize: 4,
    prizePool: "$1M+",
    applicationDeadline: "2026-09-24",
    externalLink: "https://ethglobal.com/events/tokyo2026",
    source: "ETHGlobal (araştırıldı)",
    notes: "IRL hackathon — Tokyo. EVM odaklı, refaktor ve TroyLayer için uygun.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h6",
    name: "ETHGlobal Mumbai 2026",
    organizer: "ETHGlobal",
    dateStart: "2026-11-06",
    dateEnd: "2026-11-08",
    location: "Mumbai, Hindistan",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling", "Public Goods"],
    chains: ["Ethereum", "Base", "Optimism", "Arbitrum"],
    idealTeamSize: 4,
    prizePool: "$1M+",
    applicationDeadline: "2026-11-05",
    externalLink: "https://ethglobal.com/events/mumbai2026",
    source: "ETHGlobal (araştırıldı)",
    notes: "IRL hackathon — Mumbai. EVM odaklı.",
    discoveredAt: "2026-07-05",
  },
  // --- Algorand x402 Challenge (algorand.co/global-x402-challenge) ---
  {
    id: "h7",
    name: "Global x402 Challenge",
    organizer: "Algorand Foundation",
    dateStart: "2026-07-15",
    dateEnd: "2026-11-05",
    location: "online + Devcon 8 India (finalistler)",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling", "DeFi"],
    chains: ["Algorand"],
    idealTeamSize: 4,
    prizePool: "$100K USD + 500K ALGO",
    applicationDeadline: "2026-10-01",
    externalLink: "https://algorand.co/global-x402-challenge",
    source: "algorand.co (araştırıldı)",
    notes: "x402 protokolü — API endpoint'lerini pay-per-request servisine çevir (agentic commerce). Track'ler: veri satışı, compute, aksiyon, doğrulama. Top 5 finalist Devcon 8'de canlı sunum yapar. Mevcut projelerden doğrudan uygun olan yok — yeni proje gerekiyor ama AI×Web3 track'i catchcat-monad'ın AI tarafına yakın.",
    discoveredAt: "2026-07-05",
  },
  // --- DoraHacks Casper Agentic Buildathon (dorahacks.io) ---
  {
    id: "h8",
    name: "Casper Agentic Buildathon",
    organizer: "DoraHacks + Casper Network",
    dateStart: "2026-07-10",
    dateEnd: "2026-08-15",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling"],
    chains: ["Casper"],
    idealTeamSize: 4,
    prizePool: "TBD",
    applicationDeadline: "2026-08-10",
    externalLink: "https://dorahacks.io/hackathon/casper-agentic-buildathon/detail",
    source: "DoraHacks (kullanıcı gönderdi)",
    notes: "Casper blockchain (Pure Proof-of-Stake) üzerinde agentic/AI odaklı buildathon. Detay sayfası bot koruması yüzünden tam çekilemedi — prize/track detayları için resmi siteyi elle doğrula. Mevcut projelerden doğrudan uygun olan yok (Casper zinciri farklı).",
    discoveredAt: "2026-07-05",
  },
  // --- Twitter @Moon_strk tweet'inden (21 hackathon listesi) ---
  {
    id: "h9",
    name: "AI WARS: WEEX Alpha Awakens",
    organizer: "WEEX + XPRIZE + Gemini",
    dateStart: "2026-07-05",
    dateEnd: "2026-08-17",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$1,880,000",
    applicationDeadline: "2026-08-17",
    externalLink: "https://xprize.devpost.com/",
    source: "Twitter @Moon_strk",
    notes: "AI x Crypto competition + hackathon. Gemini XPRIZE ile. En büyük ödüllü yarışmalardan biri. AI×Web3 track'i catchcat-monad'ın AI tarafına yakın.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h10",
    name: "Solana Summer Camp",
    organizer: "Colosseum",
    dateStart: "2026-07-11",
    dateEnd: "2026-08-16",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Infra/Tooling", "Social/Consumer"],
    chains: ["Solana"],
    idealTeamSize: 4,
    prizePool: "$5M+ (ödül + seed funding)",
    applicationDeadline: "2026-08-16",
    externalLink: "https://www.colosseum.com",
    source: "Twitter @Moon_strk",
    notes: "Solana'nın amiral gemisi hackathon'u. Track'ler: Payments, DeFi, Web3, Gaming, DAOs, Mobile. ROLET projesi çok yüksek uygunluk — Solana working-demo, NFT/Gaming + DeFi track'leri.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h11",
    name: "Sui Overflow 2026",
    organizer: "Sui Network",
    dateStart: "2026-07-15",
    dateEnd: "2026-08-31",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "Social/Consumer", "Infra/Tooling", "AI×Web3"],
    chains: ["Sui"],
    idealTeamSize: 4,
    prizePool: "$500,000+",
    applicationDeadline: "2026-08-15",
    source: "Twitter @Moon_strk",
    notes: "Sui blockchain üzerinde. Track'ler: DeFi, consumer apps, infra, AI x Sui. Mevcut projelerden doğrudan uygun olan yok — Sui yeni zincir.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h12",
    name: "Web3 & Blockchain AdventureX 2026",
    organizer: "AdventureX + Injective",
    dateStart: "2026-07-22",
    dateEnd: "2026-07-26",
    location: "Hangzhou, Çin",
    status: "upcoming",
    tracks: ["Infra/Tooling", "DeFi", "NFT/Gaming"],
    chains: ["Injective"],
    idealTeamSize: 4,
    prizePool: "$150,000+",
    applicationDeadline: "2026-07-21",
    source: "Twitter @Moon_strk",
    notes: "Çin'in en büyük hackathon'u — 800+ hacker. Injective co-host. Seyahat gerektirir (Hangzhou).",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h13",
    name: "Arc Hackathon: Programmable Money",
    organizer: "Arc",
    dateStart: "2026-07-13",
    dateEnd: "2026-08-31",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "AI×Web3", "Infra/Tooling"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "TBD",
    applicationDeadline: "2026-07-13",
    source: "Twitter @Moon_strk",
    notes: "7 haftalık program. Arc L1 üzerinde programmable money. Track'ler: DeFi, enterprise finance, agent economies. AI×Web3 + DeFi kombinasyonu.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h14",
    name: "Chainlink Convergence",
    organizer: "Chainlink",
    dateStart: "2026-07-15",
    dateEnd: "2026-09-15",
    location: "online",
    status: "upcoming",
    tracks: ["Infra/Tooling", "AI×Web3", "DeFi"],
    chains: ["Ethereum", "Other"],
    idealTeamSize: 4,
    prizePool: "$120,000+",
    applicationDeadline: "2026-09-01",
    source: "Twitter @Moon_strk",
    notes: "Confidential compute, CRE, enterprise x Web3. Chainlink altyapısı. Mevcut TroyLayer ve refaktor projeleri Infra/Tooling track'ine yakın.",
    discoveredAt: "2026-07-05",
  },

  {
    id: "h15",
    name: "Common S3nse",
    organizer: "Taiko Network",
    dateStart: "2026-07-15",
    dateEnd: "2026-09-05",
    location: "online",
    status: "upcoming",
    tracks: ["Infra/Tooling", "ZK/Privacy"],
    chains: ["Ethereum", "Other"],
    idealTeamSize: 4,
    prizePool: "TBD",
    applicationDeadline: "2026-09-05",
    source: "Twitter @Moon_strk",
    notes: "Taiko üzerinde. Track'ler: blockchain, privacy, defense/security, crypto. ZK/Privacy track'i monad-stealth projesine yakın.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h16",
    name: "CROO Agent Hackathon",
    organizer: "DoraHacks",
    dateStart: "2026-06-20",
    dateEnd: "2026-07-12",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$10,000+",
    applicationDeadline: "2026-07-12",
    source: "Twitter @Moon_strk (DoraHacks)",
    notes: "Agent-to-agent sistemleri ve otonom iş akışları. AI×Web3 odaklı. Kısa süre — deadline yakın.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h17",
    name: "OKX AI Genesis Hackathon",
    organizer: "OKX + X Layer",
    dateStart: "2026-07-01",
    dateEnd: "2026-08-15",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$100,000",
    applicationDeadline: "2026-08-15",
    source: "Twitter @Moon_strk",
    notes: "X Layer üzerinde Agent Service Provider geliştirme. Canlı (live now). AI×Web3 track'i catchcat-monad'ın AI tarafına yakın.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h18",
    name: "Solana x402 Hackathon",
    organizer: "Solana",
    dateStart: "2026-07-10",
    dateEnd: "2026-08-15",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling", "DeFi"],
    chains: ["Solana"],
    idealTeamSize: 4,
    prizePool: "$20,000",
    applicationDeadline: "2026-08-15",
    source: "Twitter @Moon_strk",
    notes: "Otonom ajanlar, agent-to-agent ödemeleri, MCP server'lar. x402 protokolü. ROLET projesi Solana'da olduğu için altyapı uygun.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h19",
    name: "Web3 Hackfest: Unlimited Hacker",
    organizer: "NEAR Protocol",
    dateStart: "2026-07-15",
    dateEnd: "2026-09-01",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Social/Consumer"],
    chains: ["NEAR"],
    idealTeamSize: 4,
    prizePool: "$22,000+",
    applicationDeadline: "2026-08-25",
    source: "Twitter @Moon_strk",
    notes: "NEAR Protocol destekli. Track'ler: DeFi, NFT, Gaming, Metaverse, DAO, Web2-to-Web3. Geniş kapsam.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h20",
    name: "Tether Developers Cup",
    organizer: "Tether + DoraHacks",
    dateStart: "2026-07-14",
    dateEnd: "2026-07-28",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "Infra/Tooling"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$8,000",
    applicationDeadline: "2026-07-14",
    source: "Twitter @Moon_strk (DoraHacks)",
    notes: "Tether/USDT odaklı. Kısa süre. DoraHacks üzerinde.",
    discoveredAt: "2026-07-05",
  },

  {
    id: "h21",
    name: "ETH Lima Hackathon 2026",
    organizer: "Ethereum Lima",
    dateStart: "2026-08-01",
    dateEnd: "2026-08-31",
    location: "Lima, Peru",
    status: "upcoming",
    tracks: ["DeFi", "Infra/Tooling"],
    chains: ["Arbitrum"],
    idealTeamSize: 4,
    prizePool: "TBD",
    applicationDeadline: "2026-07-30",
    source: "Twitter @Moon_strk",
    notes: "Arbitrum üzerinde. Topluluk odaklı. Detaylar için kayıt açılmış.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h22",
    name: "Ethereum Uruguay 2026",
    organizer: "DoraHacks",
    dateStart: "2026-07-24",
    dateEnd: "2026-07-25",
    location: "Montevideo, Uruguay",
    status: "upcoming",
    tracks: ["DeFi", "Infra/Tooling"],
    chains: ["Ethereum"],
    idealTeamSize: 4,
    prizePool: "$1,500",
    applicationDeadline: "2026-07-23",
    source: "Twitter @Moon_strk (DoraHacks)",
    notes: "Küçük ödüllü ama IRL etkinlik. DoraHacks üzerinde. EVM odaklı.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h23",
    name: "HackIndia Web3 Hackathon 2026",
    organizer: "HackIndia",
    dateStart: "2026-08-01",
    dateEnd: "2026-09-15",
    location: "online",
    status: "upcoming",
    tracks: ["Infra/Tooling", "DeFi", "NFT/Gaming"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "TBD",
    applicationDeadline: "2026-08-01",
    source: "Twitter @Moon_strk",
    notes: "Saf Web3 track'i. Hindistan odaklı. Detaylar için kayıt açılmış.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h24",
    name: "Indonesia Web3 Hackathon 2026",
    organizer: "Binance Academy + BNB Chain",
    dateStart: "2026-07-15",
    dateEnd: "2026-08-30",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "DeFi", "Social/Consumer"],
    chains: ["BNB"],
    idealTeamSize: 4,
    prizePool: "$5,000",
    applicationDeadline: "2026-08-30",
    source: "Twitter @Moon_strk",
    notes: "BNB Chain üzerinde. Ücretsiz, online. AI Agents, Finance, Consumer Apps.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h25",
    name: "Injective Global Cup",
    organizer: "Injective + HackQuest",
    dateStart: "2026-07-03",
    dateEnd: "2026-07-19",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "AI×Web3", "Infra/Tooling"],
    chains: ["Injective"],
    idealTeamSize: 4,
    prizePool: "$1,000 USDT",
    applicationDeadline: "2026-07-19",
    source: "Twitter @Moon_strk",
    notes: "World Cup temalı. x402, USDC CCTP, MCP Server, Agent Skills. Kısa süre, küçük ödül.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h26",
    name: "KeeperHub Agents Onchain Hackathon",
    organizer: "KeeperHub",
    dateStart: "2026-07-10",
    dateEnd: "2026-08-13",
    location: "online",
    status: "upcoming",
    tracks: ["AI×Web3", "Infra/Tooling"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$5,000",
    applicationDeadline: "2026-08-13",
    source: "Twitter @Moon_strk",
    notes: "Onchain AI ajanları odaklı.",
    discoveredAt: "2026-07-05",
  },
  {
    id: "h27",
    name: "MUBA Hackathon",
    organizer: "Malaysia University Blockchain Association",
    dateStart: "2026-08-26",
    dateEnd: "2026-09-06",
    location: "online",
    status: "upcoming",
    tracks: ["DeFi", "NFT/Gaming", "Social/Consumer"],
    chains: ["Other"],
    idealTeamSize: 4,
    prizePool: "$7,000",
    applicationDeadline: "2026-08-26",
    source: "Twitter @Moon_strk",
    notes: "Ücretsiz, online. Üniversite odaklı blockchain hackathon'u.",
    discoveredAt: "2026-07-05",
  },

];

// status'ü build time'da otomatik güncelle
export const DISCOVERED_HACKATHONS: DiscoveredHackathon[] = RAW.map((h) => ({
  ...h,
  status: computeStatus(h),
}));

// --- Yardımcı: durum etiketleri ---
export const STATUS_LABELS: Record<HackathonStatus, { label: string; tone: "emerald" | "amber" | "faint" }> = {
  upcoming: { label: "Yaklaşan", tone: "emerald" },
  ongoing: { label: "Devam eden", tone: "amber" },
  completed: { label: "Tamamlandı", tone: "faint" },
};
