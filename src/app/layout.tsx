'use client'
import { Inter, Kalam, Patrick_Hand } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import useCheckRoute from "@/hooks/useCheckRoute";
import { usePathname } from "next/navigation";
import VerifyDevice from "@/components/VerifyDevice";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from "@/utils/queryClient";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CustomToastProvider } from "@/context/CustomToastContext";

const inter = Inter({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sketch-heading",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sketch-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isPrivateRoute = useCheckRoute(pathname);

  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} ${kalam.variable} ${patrickHand.variable}`}
      >
        <QueryClientProvider client={queryClient}>
          <CustomToastProvider>
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
          </CustomToastProvider>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
