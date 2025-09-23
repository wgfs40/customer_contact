import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <Header />
      {/* Main content area */}
      <main className="grow h-3/4">
        <CookieBanner />
        {children}
      </main>
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Layout;
