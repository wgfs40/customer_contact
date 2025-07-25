import KitForm from "@/Components/forms/KitForm";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] items-center justify-center min-h-screen bg-orange-400">
        <KitForm />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
