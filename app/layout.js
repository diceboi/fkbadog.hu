import "@fontsource-variable/mona-sans";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalBodyPadding from "@/components/ConditionalBodyPadding";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "FK Tető – Bádogos és Tetőfedő Anyag Kereskedés",
  description:
    "Minőségi bádogos és tetőfedő anyagok, tetőszellőzők, trapézlemezek és kiegészítők legjobb árakon. Lefoglalás és anyagszükséglet kalkulátor.",
  openGraph: {
    title: "FK Tető – Bádogos és Tetőfedő Anyag Kereskedés",
    description: "Minőségi bádogos és tetőfedő anyagok a legjobb árakon.",
    siteName: "FK Tető",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>
        <ConditionalNavbar />
        <ConditionalBodyPadding />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
