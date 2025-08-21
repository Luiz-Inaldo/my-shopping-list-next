import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EzShoplist | Lista",
  description: "Lista individual de compras",
  openGraph: {
    title: "EzShoplist | Lista",
    description: "Lista individual de compras",
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