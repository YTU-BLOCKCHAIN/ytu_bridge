import { GitHubConnector } from "@/components/github-connector";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Projeler</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          GitHub hesabını bağla, projelerini otomatik sınıflandıralım ve
          hackathon uygunluğunu test edelim. Sadece blockchain/web3 projeleri gösterilir.
        </p>
      </div>

      {/* GitHub entegrasyonu — kendi projelerini getir */}
      <GitHubConnector />
    </div>
  );
}


