import type { Metadata } from "next";
import { Itim } from "next/font/google";
import "../styles/globals.css";
import { ProductsProvider } from "@/context/ProductsContext";

const itim = Itim({ weight: '400', subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minha lista de compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={itim.className}>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </body>
    </html>
  );
}
