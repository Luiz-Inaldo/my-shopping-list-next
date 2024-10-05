'use client'
import { Itim, Quicksand } from "next/font/google";
import "../styles/globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { Toaster } from "@/components/ui/toaster";
import SessionVerifier from "@/components/SessionVerifier";
import useCheckRoute from "@/hooks/useCheckRoute";
import { usePathname } from "next/navigation";

const quicksand = Quicksand({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPrivateRoute = useCheckRoute(pathname);

  return (
    <html lang="en">
      <body className={quicksand.className}>
        <div className="relative flex flex-col gap-10 w-[430px] min-h-screen mx-auto bg-[#fafafa]">
          {isPrivateRoute ? (
            <ProductsProvider>
              <SessionVerifier>
                {children}
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
