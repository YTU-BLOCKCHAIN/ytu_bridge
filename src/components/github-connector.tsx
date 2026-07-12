"use client";

import { useState, useEffect } from "react";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { scoreProjectFit } from "@/lib/seed-projects";

interface GhRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  html_url: string;
  topics: string[];
  updated_at?: string;
  // API'den gelen sınıflandırma
  chains: string[];
  tracks: string[];
  tech: string[];
  isBlockchain: boolean;
  signalCount: number;
}

const TOKEN_KEY = "gh_token";

export function GitHubConnector() {
  const [token, setToken] = useState<string | null>(null);
  const [login, setLogin] = useState<string | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [totalRepos, setTotalRepos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      fetchRepos(saved);
    }
    const params = new URLSearchParams(window.location.search);
    const ghToken = params.get("gh_token");
    if (ghToken) {
      localStorage.setItem(TOKEN_KEY, ghToken);
      setToken(ghToken);
      fetchRepos(ghToken);
      window.history.replaceState({}, "", "/projects");
    }
  }, []);

  async function fetchRepos(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repos?token=${encodeURIComponent(t)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error === "gh_unauthorized" ? "GitHub yetkisi geçersiz" : "Repo'lar çekilemedi");
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } else {
        setLogin(data.login);
        setRepos(data.repos);
        setTotalRepos(data.totalRepos ?? data.repos.length);
      }
    } catch {
      setError("Bağlantı hatası");
    }
    setLoading(false);
  }

  function handleConnect() {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirect = `${window.location.origin}/api/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=repo&state=/projects`;
  }

  function handleDisconnect() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setLogin(null);
    setRepos([]);
    setSelectedRepo(null);
  }

  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming")
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());

  const selectedRepoData = repos.find((r) => r.name === selectedRepo);
  // API'den gelen sınıflandırma (chains/tracks/tech) — inferRepoMeta gerekmez
  const selectedMeta = selectedRepoData
    ? { chains: selectedRepoData.chains, tracks: selectedRepoData.tracks, tech: selectedRepoData.tech }
    : null;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-text">GitHub projelerini getir</h2>
          <p className="text-xs text-text-faint mt-0.5">
            Hesabını bağla, repolarını çek ve hackathon uygunluğunu test et.
          </p>
        </div>
        {token ? (
          <button onClick={handleDisconnect} className="text-xs text-text-faint hover:text-warn transition-colors">
            Çöz @{login}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2 hover:bg-ink-bright transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.21.08 1.85 1.22 1.85 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.2.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.28-1.52 3.28-1.2 3.28-1.2.65 1.66.24 2.88.12 3.18.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.22.68.83.56C20.57 21.88 24 17.48 24 12.29 24 5.78 18.63.5 12 .5Z" />
            </svg>
            GitHub'a bağla
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs text-warn bg-warn/8 border border-warn/20 rounded-lg p-2.5 mb-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-6 text-text-faint text-sm">Repo'lar çekiliyor…</div>
      )}

      {/* Repo listesi — sadece blockchain projeleri */}
      {token && !loading && repos.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-xs text-text-faint mb-2">
            {repos.length} blockchain proje
            {totalRepos > repos.length && <span> · {totalRepos - repos.length} blockchain dışı elendi</span>}
            {" · tıkla ve uygunluk test et"}
          </div>
          <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {repos.map((r) => (
              <button
                key={r.name}
                onClick={() => setSelectedRepo(r.name)}
                className={`text-left rounded-lg border p-3 transition-colors ${
                  selectedRepo === r.name ? "border-ink bg-ink/5" : "border-line hover:border-ink-soft"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text truncate">{r.name}</span>
                  {r.language && (
                    <span className="text-[0.6rem] text-text-faint shrink-0">{r.language}</span>
                  )}
                </div>
                {r.description && (
                  <div className="text-xs text-text-faint mt-0.5 truncate">{r.description}</div>
                )}
                {/* API'den gelen zincir/track chip'leri */}
                {(r.chains.length > 0 || r.tracks.length > 0) && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.chains.slice(0, 2).map((c) => (
                      <span key={c} className="chip chip-ink text-[0.6rem] px-1.5 py-0.5">{c}</span>
                    ))}
                    {r.tracks.slice(0, 2).map((t) => (
                      <span key={t} className="chip chip-good text-[0.6rem] px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1.5 text-[0.65rem] text-text-faint">
                  <span>★ {r.stars}</span>
                  {r.topics.slice(0, 2).map((t) => (
                    <span key={t} className="chip chip-dim text-[0.6rem] px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain proje yok */}
      {token && !loading && repos.length === 0 && !error && (
        <div className="text-center py-6 text-text-faint text-sm">
          {totalRepos > 0
            ? `${totalRepos} repo bulundu ama hiçbiri blockchain/web3 projesi değil.`
            : "Hiç repo bulunamadı."}
        </div>
      )}


      {/* Uygunluk testi — seçili repo */}
      {selectedRepoData && selectedMeta && (
        <div className="border-t border-line-soft pt-4 mt-2">
          <div className="mb-3">
            <div className="text-sm font-medium text-text">{selectedRepoData.name}</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selectedMeta.chains.map((c) => (
                <span key={c} className="chip chip-ink text-[0.6rem]">{c}</span>
              ))}
              {selectedMeta.tracks.map((t) => (
                <span key={t} className="chip chip-good text-[0.6rem]">{t}</span>
              ))}
              {selectedMeta.tech.map((t) => (
                <span key={t} className="chip chip-dim text-[0.6rem]">{t}</span>
              ))}
              {selectedMeta.chains.length === 0 && selectedMeta.tracks.length === 0 && (
                <span className="text-xs text-text-faint">Web3 işareti bulunamadı — manuel etiketleme gerekebilir</span>
              )}
            </div>
          </div>

          <div className="text-xs text-text-faint mb-2">Hackathon uygunluk skorları (yaklaşan, tarihe göre)</div>
          <div className="space-y-2">
            {upcoming.slice(0, 6).map((h) => {
              const fit = scoreProjectFit(
                {
                  id: selectedRepoData.name,
                  title: selectedRepoData.name,
                  description: selectedRepoData.description || "",
                  techStack: selectedMeta.tech,
                  chains: selectedMeta.chains,
                  tracks: selectedMeta.tracks,
                  status: "prototype",
                  reusePotential: "medium",
                  tags: [],
                  outcome: "",
                } as any,
                h
              );
              return (
                <div key={h.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-text truncate">{h.name}</div>
                    {fit.gaps.length > 0 && (
                      <div className="text-[0.65rem] text-warn truncate">{fit.gaps[0]}</div>
                    )}
                    {fit.matchedTracks.length > 0 && (
                      <div className="text-[0.65rem] text-text-faint truncate">
                        eşleşen: {fit.matchedTracks.join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-line overflow-hidden">
                      <div
                        className={`h-full ${fit.score >= 60 ? "bg-ink" : fit.score >= 30 ? "bg-warn" : "bg-line"}`}
                        style={{ width: `${fit.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text w-8 text-right">{fit.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <a
            href={selectedRepoData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink hover:underline mt-3 inline-block"
          >
            GitHub'da aç ↗
          </a>
        </div>
      )}
    </div>
  );
}

