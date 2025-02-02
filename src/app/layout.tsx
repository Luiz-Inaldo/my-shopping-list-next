'use client'
import { Itim, Quicksand } from "next/font/google";
import "../styles/globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { Toaster } from "@/components/ui/toaster";
import SessionVerifier from "@/components/SessionVerifier";
import useCheckRoute from "@/hooks/useCheckRoute";
import { usePathname } from "next/navigation";
import { PurchasesProvider } from "@/context/PurchasesContext";
import VerifyDevice from "@/components/VerifyDevice";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const quicksand = Quicksand({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPrivateRoute = useCheckRoute(pathname);
  const queryClient = new QueryClient();

  return (
    <html lang="pt-br">
      <body className={quicksand.className}>
        <div className="relative">
          {isPrivateRoute ? (
            <VerifyDevice>
              <QueryClientProvider client={queryClient}>
                <ProductsProvider>
                  <SessionVerifier>
                    <PurchasesProvider>
                      {children}
                    </PurchasesProvider>
                  </SessionVerifier>
                </ProductsProvider>
              </QueryClientProvider>
            </VerifyDevice>
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
