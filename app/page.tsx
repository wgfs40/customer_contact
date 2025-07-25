import CustomerInfoForm from "@/Components/forms/CustomerInfoForm";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Bienbenido a dosis de marketing</h1>
        <p className="text-lg text-gray-600">
          Aquí puedes encontrar información sobre nuestros servicios y cómo
          contactarnos.
        </p>
        <CustomerInfoForm />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
