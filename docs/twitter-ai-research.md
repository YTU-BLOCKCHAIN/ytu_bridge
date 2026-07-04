# Twitter → AI → Bridge: Hackathon Otomatik Keşif Araştırması

**Soru:** Twitter'dan bulduğum hackathonları tek yerde toplayıp AI ile siteye ekletemem mümkün mü?
**Cevap:** Evet — 3 mimari, maliyet/effort'a göre sıralı.

---

## Mimari 1 — Yapıştır & AI Parse (Önerilen, en ucuz, hemen) ⭐

**Akış:**
1. Sen Twitter'da hackathon duyurusu görürsün → tweet linkini veya metnini Bridge'e yapıştırır
2. Bridge bir Edge Function çağırır → LLM (Claude/GPT) tweet'i yapısal JSON'a çevirir
3. Önizleme: name, organizer, dateStart, dateEnd, location, tracks, chains, prizePool, externalLink, source
4. Sen "Onayla" → `hackathons` tablosuna insert

**Maliyet:** ~$0 (LLM ~$0.01/tweet, ayda 20 tweet = ~$0.20)
**Efor:** Düşük — bir Edge Function + bir modal + LLM API key
**Avantaj:** Senin kontrolünde, hatalı parse'ı düzeltirsin, ücretsiz practically
**Dezavantaj:** Tam otomatik değil (manuel yapıştırma)

**Teknik:**
- Supabase Edge Function `parse-tweet` (Deno)
- LLM: Claude Haiku ($1/MTok) veya GPT-4o-mini — yapısal çıktı (JSON mode / tool use)
- Prompt: "Bu tweet'ten hackathon bilgilerini çıkar: {name, organizer, dateStart, dateEnd, location, tracks[], chains[], prizePool, applicationDeadline, externalLink, source}. Boş bilinmeyen alanları null bırak."
- Frontend: "Tweet yapıştır" modalı → parse → önizleme formu → onayla

---

## Mimari 2 — Twitter Listesi + Cron (Semi-otomatik, orta)

**Akış:**
1. Twitter'da bir **Liste** kurarsın (hackathon duyuru hesapları: @ethglobal, @dorahacks, @solana, @monad, @devpost vs.)
2. Supabase Edge Function **cron** (her 6 saat) → Twitter API ile listenin son tweet'lerini çeker
3. LLM her tweet'i parse eder → `pending` hackathon olarak kaydeder
4. Admin panelinde "Bekleyen keşifler" — onayla/reddet

**Maliyet:**
- Twitter API: **Basic tier ~$200/mo** (recent search + list access). Free tier artık çok sınırlı (owned reads only, $0.001/request)
- LLM: ~$1-5/mo (cron sıklığına bağlı)
**Efor:** Orta — Twitter API entegrasyonu + cron + queue
**Avantaj:** Sürekli akış, kaç duyuru kaçmaz
**Dezavantaj:** $200/mo maliyet, API onay süreci, noise (ilgisiz tweet'ler)

**Teknik:**
- Twitter API v2: `GET /2/lists/:id/tweets` (Basic tier)
- Supabase Edge Function cron (pg_cron veya Vercel Cron)
- Queue tablosu: `discovery_queue` (status: pending/approved/rejected)
- LLM batch parse → insert to queue → admin onay

---

## Mimari 3 — Çoklu Kaynak Aggregator (Tam otomatik, en gelişmiş)

**Akış:**
1. Çoklu kaynak: Twitter API + Devpost scrape + DoraHacks RSS + ETHGlobal API + Superteam
2. Her kaynaktan cron ile çek → normalize et → LLM ile zenginleştir → dedup (link/hash)
3. Admin onay kuyruğu → otomatik eşleştirme motoru çalışır

**Maliyet:**
- Twitter API: $200/mo
- Scraper hosting: $0-20/mo (Vercel/Supabase free tier)
- LLM: $5-20/mo
**Efor:** Yüksek — her kaynak için ayrı connector
**Avantaj:** En kapsamlı, hiç kaçmaz
**Dezavantaj:** Bakım yükü, scrape'ler kırılır, maliyet

**Kaynaklar:**
- **Devpost:** Public API yok, HTML scrape (`devpost.com/hackathons` + sayfalama). Unofficial: `/hackathons?page=N&status[]=open` HTML parse
- **DoraHacks:** `dorahacks.io` — hackathon listesi, olası JSON API (araştırılmalı)
- **ETHGlobal:** `ethglobal.com/events` — scrape veya RSS
- **Solana Superteam:** `superteam.fun` — scrape
- **Monadboost:** blog/social

---

## Önerilen Yol (Aşamalı)

### Faz 2.5 — Yapıştır & Parse (Mimari 1) — hemen
- "Tweet yapıştır" modali Keşif akışına eklenir
- Edge Function + LLM (Claude Haiku)
- Maliyet ~$0
- Senin mevcut Twitter akışına tam uyuyor

### Faz 3.5 — Twitter List + Cron (Mimari 2) — istersen sonra
- Eğer $200/mo makul ise ve otomasyon istersen
- Liste kur → cron → onay kuyruğu

### Faz 4.5 — Çoklu kaynak (Mimari 3) — uzun vadede
- Kulüp büyüdüğünde, birden fazla kişi keşif yapınca

---

## LLM Structured Output Notları
- **Claude** (Anthropic): tool use ile structured JSON — stabil, az hallucination
- **GPT-4o-mini** (OpenAI): `response_format: { type: "json_object" }` veya function calling — ucuz, hızlı
- **Prompt mühendisliği:** "Sadece metinde kesin olarak bulunan bilgileri çıkar. Bilinmeyen alanları null bırak. Tarihleri ISO format (YYYY-MM-DD) ver. Tracks şunlardan biri: [DeFi, NFT/Gaming, Infra/Tooling, ZK/Privacy, AI×Web3, Public Goods, Social/Consumer, Other]."

## Supabase Edge Function Notları
- Deno runtime, TypeScript-first
- Cron: `pg_cron` extension veya Vercel Cron + webhook
- Secrets: Supabase project secrets (LLM API key)
- Limit: short-lived, idempotent — tweet parse için ideal
- Örnek: `supabase/functions/parse-tweet/index.ts`

## Sonuç
**Mimari 1 (Yapıştır & AI Parse) senin akışına tam uyuyor ve neredeyse ücretsiz.** Bunu Faz 2'ye ekleyebiliriz — Keşif akışına "Tweet yapıştır" butonu + Edge Function. Twitter API'nin $200/mo maliyetinden kaçınırız. İstersen Faz 3.5'te otomasyon ekleriz.
