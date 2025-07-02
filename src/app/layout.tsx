import Navbar from "@/components/Navbar";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html >
      <StoreProvider>
      <body>
        <Navbar/>
        {children}
      </body>
      <Footer/>
      </StoreProvider>
    </html>
  );
}
