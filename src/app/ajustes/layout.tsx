import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajustes • EzShoplist",
  description: "Ajustes de acordo com a preferência do usuário.",
  openGraph: {
    title: "Ajustes • EzShoplist",
    description: "Ajustes de acordo com a preferência do usuário.",
  },
  applicationName: "EzShoplist"
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