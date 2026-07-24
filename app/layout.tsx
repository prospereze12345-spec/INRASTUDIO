import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import {  Bebas_Neue, Playfair_Display, Poppins, Archivo_Black } from "next/font/google";

const inter        = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas        = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const playfair     = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins      = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });



const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'INRASTUDIO | African AI Marketing Studio',
  description: 'Generate stunning AI Flyers, Captions, and Promo Videos.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#030712] text-slate-50 font-sans antialiased selection:bg-cyan-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

  
