import KitForm from "@/Components/forms/KitForm";

const ContactPage = () => {
  return (
    <div>
      <main className="flex flex-col gap-[32px] items-center justify-center min-h-screen bg-orange-400">
        <KitForm />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
};

export default ContactPage;
