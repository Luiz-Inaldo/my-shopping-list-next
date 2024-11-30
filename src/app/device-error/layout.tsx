import { Quicksand } from "next/font/google";
import "../../styles/globals.css";
import { Metadata } from "next";

const quicksand = Quicksand({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erro de dispositivo",
  description: "Parece que a aplicação não está disponível no seu dispositivo.",
  openGraph: {
    title: "Erro de dispositivo",
    description: "Parece que a aplicação não está disponível no seu dispositivo.",
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-br">
      <body className={quicksand.className}>
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
