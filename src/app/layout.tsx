import type { Metadata } from "next";
import { Itim } from "next/font/google";
import "../styles/globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { Toaster } from "@/components/ui/toaster";

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
        <div className="relative flex flex-col gap-10 w-[430px] mx-auto bg-gray-background">
          <ProductsProvider>
            {children}
          </ProductsProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
