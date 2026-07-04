// Geçici seed verisi — Supabase bağlanana kadar frontend'de.
// Kaynak: supabase/migrations/0002_seed.sql ile birebir.
// Supabase bağlanınca bu dosya → server-side fetch ile değişecek.

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface SeedSkill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SeedMember {
  id: string;
  fullName: string;
  studentEmail: string;
  walletAddress: string;
  internalRating: number; // 0-100
  availability: { status: AvailabilityStatus; until?: string };
  skills: SeedSkill[];
  tags: string[];
  role: "member" | "admin";
  hackathonCount: number; // geçmiş katılım sayısı (özet)
  bestResult?: string; // "1st", "top10" vs.
}

export const SEED_MEMBERS: SeedMember[] = [
  {
    id: "m1",
    fullName: "Ahmet Yılmaz",
    studentEmail: "ahmet.yilmaz@std.yildiz.edu.tr",
    walletAddress: "0x71C7aA3f2c4B9eD8fE1a9c3D2b7E5f9A8bC1dE2F",
    internalRating: 92,
    availability: { status: "available" },
    skills: [
      { name: "Solidity", level: 5 },
      { name: "Smart Contract Development", level: 5 },
      { name: "Security & Smart Contract Auditing", level: 4 },
    ],
    tags: ["güvenilir", "SC uzmanı"],
    role: "admin",
    hackathonCount: 4,
    bestResult: "1st",
  },
  {
    id: "m2",
    fullName: "Zeynep Kaya",
    studentEmail: "zeynep.kaya@std.yildiz.edu.tr",
    walletAddress: "0xA4B2c9D1eF8a3B7cD2E6f9A1b8C4dE3f2A7B9C0",
    internalRating: 88,
    availability: { status: "available" },
    skills: [
      { name: "Next.js / React", level: 5 },
      { name: "UI/UX Design", level: 4 },
      { name: "Pitching & Presentation", level: 5 },
    ],
    tags: ["hızlı prototipçi", "pitch"],
    role: "admin",
    hackathonCount: 3,
    bestResult: "top10",
  },
  {
    id: "m3",
    fullName: "Can Demir",
    studentEmail: "can.demir@std.yildiz.edu.tr",
    walletAddress: "0xE8F312B7aD4c9E6fA2B8C1D3e7F5a9B2c4D8E0F1",
    internalRating: 79,
    availability: { status: "limited", until: "2026-02-28" },
    skills: [
      { name: "Project Management", level: 5 },
      { name: "Research & Analysis", level: 4 },
      { name: "Solidity", level: 3 },
    ],
    tags: ["PM"],
    role: "member",
    hackathonCount: 2,
    bestResult: "participated",
  },
  {
    id: "m4",
    fullName: "Ece Şahin",
    studentEmail: "ece.sahin@std.yildiz.edu.tr",
    walletAddress: "0xB9D44E8A3cF1d2E6bA8f7C9D0E3A1B2C4F5D6E7A",
    internalRating: 85,
    availability: { status: "available" },
    skills: [
      { name: "Next.js / React", level: 4 },
      { name: "DeFi & Tokenomics", level: 4 },
      { name: "Smart Contract Development", level: 3 },
    ],
    tags: ["DeFi"],
    role: "member",
    hackathonCount: 2,
    bestResult: "finalist",
  },
  {
    id: "m5",
    fullName: "Burak Özdemir",
    studentEmail: "burak.ozdemir@std.yildiz.edu.tr",
    walletAddress: "0x3F9177C2bE8aD4f1C9E2B3A5d7F8C6E0A9B1D2F3",
    internalRating: 94,
    availability: { status: "available" },
    skills: [
      { name: "zk-Proofs & Cryptography", level: 5 },
      { name: "Solidity", level: 4 },
      { name: "Security & Smart Contract Auditing", level: 4 },
    ],
    tags: ["zk", "security"],
    role: "admin",
    hackathonCount: 5,
    bestResult: "2nd",
  },
  {
    id: "m6",
    fullName: "Selin Aksoy",
    studentEmail: "selin.aksoy@std.yildiz.edu.tr",
    walletAddress: "0xC2E899F47aD1b3C6E8F9A2B4d5C7E0F1A8B9D2C3",
    internalRating: 81,
    availability: { status: "unavailable" },
    skills: [
      { name: "Pitching & Presentation", level: 4 },
      { name: "Community Management / DevRel", level: 5 },
      { name: "Technical Writing & Documentation", level: 4 },
    ],
    tags: ["devrel", "içerik"],
    role: "member",
    hackathonCount: 1,
    bestResult: "participated",
  },
];
