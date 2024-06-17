import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/navigation/page";
import About from "./about/page";

export const metadata: Metadata = {
  title: "cleo miao",
  description: "cleo miao portfolio website",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;