import { NextResponse, type NextRequest } from "next/server";

// Kullanıcının GitHub repo'larını çeker + blockchain sınıflandırması yapar.
// Sadece blockchain/web3 projelerini döndürür, diğerlerini eler.
// Token query param'dan gelir (client localStorage'dan gönderir).
// GitHub API: saatte 5000 istek ücretsiz.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "no_token" }, { status: 401 });
  }

  try {
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: "gh_unauthorized" }, { status: 401 });
    }
    const user = await userRes.json();

    const reposRes = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated&type=owner",
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
    );
    const reposData = await reposRes.json();

    const allRepos = Array.isArray(reposData) ? reposData : [];
    const classified = allRepos
      .filter((r: any) => !r.fork)
      .map((r: any) => classifyRepo(r))
      .filter((r: any) => r.isBlockchain); // sadece blockchain projeleri

    return NextResponse.json({
      login: user.login,
      repos: classified,
      totalRepos: allRepos.filter((r: any) => !r.fork).length,
      blockchainRepos: classified.length,
    });
  } catch {
    return NextResponse.json({ error: "gh_failed" }, { status: 500 });
  }
}

// --- Blockchain sınıflandırma ---
// Repo adı, açıklama, topics, dil ve README'den blockchain/web3 işaretleri çıkarır.
// Zincir, track, tech stack ve blockchain mi diye etiketler.
const CHAIN_PATTERNS: { chain: string; patterns: RegExp }[] = [
  { chain: "Solana", patterns: /solana|anchor|metaplex|magic\s?eden|jito|helius/i },
  { chain: "Ethereum", patterns: /ethereum|eth|solidity|evm|foundry|hardhat|wagmi|viem|ethers|erc-20|erc-721|erc-1155|openzeppelin/i },
  { chain: "Base", patterns: /\bbase\b|base\.org|basechain/i },
  { chain: "Monad", patterns: /monad/i },
  { chain: "Stellar", patterns: /stellar|soroban/i },
  { chain: "Polygon", patterns: /polygon|matic|pol/i },
  { chain: "Arbitrum", patterns: /arbitrum|arb/i },
  { chain: "Optimism", patterns: /optimism|op\s?stack/i },
  { chain: "Algorand", patterns: /algorand|algo/i },
  { chain: "Sui", patterns: /\bsui\b|sui\s?move/i },
  { chain: "NEAR", patterns: /near\s?protocol|\bnear\b/i },
  { chain: "Injective", patterns: /injective/i },
  { chain: "BNB", patterns: /bnb|binance\s?chain|bsc/i },
  { chain: "Aptos", patterns: /aptos/i },
  { chain: "Avalanche", patterns: /avalanche|\bavax\b/i },
  { chain: "zkSync", patterns: /zksync/i },
  { chain: "Linea", patterns: /linea/i },
  { chain: "Scroll", patterns: /scroll/i },
];

const TRACK_PATTERNS: { track: string; patterns: RegExp }[] = [
  { track: "DeFi", patterns: /defi|lending|borrow|swap|amm|liquidity|yield|staking|vault|dex|protocol|tokenomics|\btoken\b|governance|dao/i },
  { track: "NFT/Gaming", patterns: /nft|erc-721|erc-1155|game|gaming|collectible|marketplace|mint|onchain\s?game/i },
  { track: "Infra/Tooling", patterns: /sdk|api|tooling|infra|bridge|indexer|oracle|rpc|node|explorer|wallet|devex|cli/i },
  { track: "AI×Web3", patterns: /\bai\b|ml|machine\s?learning|llm|agent|tensorflow|inference|autonomous/i },
  { track: "ZK/Privacy", patterns: /zk|zero-?knowledge|privacy|stealth|cryptography|encryption/i },
  { track: "Social/Consumer", patterns: /social|consumer|identity|reputation|creator/i },
];

const TECH_PATTERNS: { tech: string; patterns: RegExp }[] = [
  { tech: "Next.js / React", patterns: /next\.?js|react|tsx|jsx/i },
  { tech: "Solidity", patterns: /solidity|\.sol\b/i },
  { tech: "Rust", patterns: /\brust\b|cargo/i },
  { tech: "TypeScript", patterns: /typescript|\.ts\b/i },
  { tech: "Tailwind", patterns: /tailwind/i },
  { tech: "Move", patterns: /\bmove\b|sui\s?move/i },
  { tech: "Cairo", patterns: /cairo/i },
  { tech: "Viem/wagmi", patterns: /viem|wagmi|ethers\.js/i },
];

// Genel blockchain/web3 işaretleri — bunlardan biri yoksa repo elenir
const BLOCKCHAIN_SIGNALS = /blockchain|web3|crypto|solidity|smart\s?contract|evm|defi|nft|dao|token|wallet|onchain|decentralized|dapp|erc-|solana|ethereum|polygon|arbitrum|optimism|base|monad|stellar|sui|near|injective|bnb|algorand|aptos|avalanche|zksync|anchor|hardhat|foundry|wagmi|viem|ethers|openzeppelin|soroban|cairo|move|zk|starknet/i;

function classifyRepo(r: any) {
  const text = `${r.name} ${r.description || ""} ${(r.topics || []).join(" ")} ${r.language || ""}`;

  // Zincir tespiti
  const chains: string[] = [];
  for (const { chain, patterns } of CHAIN_PATTERNS) {
    if (patterns.test(text)) chains.push(chain);
  }

  // Track tespiti
  const tracks: string[] = [];
  for (const { track, patterns } of TRACK_PATTERNS) {
    if (patterns.test(text)) tracks.push(track);
  }

  // Tech stack tespiti
  const tech: string[] = [];
  for (const { tech: tName, patterns } of TECH_PATTERNS) {
    if (patterns.test(text)) tech.push(tName);
  }

  // Blockchain mi? — zincir bulundu veya genel blockchain işareti var
  const isBlockchain = chains.length > 0 || BLOCKCHAIN_SIGNALS.test(text);

  // Güven skoru: kaç işaret bulundu
  const signalCount = chains.length + tracks.length + tech.length;

  return {
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    html_url: r.html_url,
    topics: r.topics || [],
    updated_at: r.updated_at,
    chains,
    tracks,
    tech,
    isBlockchain,
    signalCount,
  };
}

