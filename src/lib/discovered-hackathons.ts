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
