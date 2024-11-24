'use client'
import { Itim, Quicksand } from "next/font/google";
import "../styles/globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { Toaster } from "@/components/ui/toaster";
import SessionVerifier from "@/components/SessionVerifier";
import useCheckRoute from "@/hooks/useCheckRoute";
import { usePathname } from "next/navigation";
import { PurchasesProvider } from "@/context/PurchasesContext";

const quicksand = Quicksand({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPrivateRoute = useCheckRoute(pathname);

  return (
    <html lang="pt-br">
      <body className={quicksand.className}>
        <div className="relative">
          {isPrivateRoute ? (
            <ProductsProvider>
              <SessionVerifier>
                <PurchasesProvider>
                  {children}
                </PurchasesProvider>
              </SessionVerifier>
            </ProductsProvider>
          ) : (
            <>
              {children}
            </>
          )}

        </div>
        <Toaster />
      </body>
    </html>
  );
}
