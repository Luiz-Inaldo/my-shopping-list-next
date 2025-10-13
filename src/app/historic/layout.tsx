import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EzShop | Histórico",
  description: "Navegue entre suas atividades passadas.",
  openGraph: {
    title: "EzShop | Histórico",
    description: "Navegue entre suas atividades passadas.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    {children}
    </>
  );
}