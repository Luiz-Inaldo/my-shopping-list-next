import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EzShop | Início",
  description: "Página inicial.",
  openGraph: {
    title: "EzShop | Início",
    description: "Página inicial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
