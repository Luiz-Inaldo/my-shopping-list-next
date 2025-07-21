import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EzShop | Autenticação",
  description: "Faça login ou cadastre-se.",
  openGraph: {
    title: "EzShop | Autenticação",
    description: "Faça login ou cadastre-se.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
