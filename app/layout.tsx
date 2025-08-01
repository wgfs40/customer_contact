// app/layout.tsx
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Configuración optimizada de fuentes
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Dosis de Marketing - Marketing Digital Profesional",
  description:
    "Especialistas en marketing digital, redes sociales, branding y desarrollo web. Transformamos tu negocio con estrategias efectivas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} font-smooth`}
      >
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
