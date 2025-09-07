'use client'
import { Inter, Itim, Quicksand } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import useCheckRoute from "@/hooks/useCheckRoute";
import { usePathname } from "next/navigation";
import VerifyDevice from "@/components/VerifyDevice";
import { PageOverlayProvider } from "@/context/PageOverlayContext";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from "@/utils/queryClient";

const inter = Inter({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPrivateRoute = useCheckRoute(pathname);

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <PageOverlayProvider>
            <div className="relative">
              {isPrivateRoute ? (
                <VerifyDevice>
                  {children}
                </VerifyDevice>
              ) : (
                <>
                  {children}
                </>
              )}

            </div>
          </PageOverlayProvider>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
