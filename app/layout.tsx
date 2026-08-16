import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

import {
  Bebas_Neue,
  Playfair_Display,
  Poppins,
  Archivo_Black,
  Roboto,
  Montserrat,
  Oswald,
  Raleway,
  Lato,
  Merriweather,
  Nunito,
} from 'next/font/google';

import { PWAProvider } from '@/components/pwa/PWAProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo',
});
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'INRASTUDIO | African AI Marketing Studio',
  description:
    'Generate stunning AI Flyers, Captions, and Promo Videos.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
  lang="en"
  className={`${inter.variable} ${spaceGrotesk.variable} ${bebas.variable} ${playfair.variable} ${poppins.variable} ${archivoBlack.variable} ${roboto.variable} ${montserrat.variable} ${oswald.variable} ${raleway.variable} ${lato.variable} ${merriweather.variable} ${nunito.variable}`}
>
      <body
        className="bg-[#030712] text-slate-50 font-sans antialiased selection:bg-cyan-500 selection:text-white"
        suppressHydrationWarning
      >
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}