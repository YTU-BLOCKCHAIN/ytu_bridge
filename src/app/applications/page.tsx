import { ApplicationsList } from "@/components/applications-list";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Başvurularım</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Gönderdiğin başvurular ve joker takım davetlerinin durumu.
        </p>
      </div>

      <ApplicationsList />
    </div>
  );
}
