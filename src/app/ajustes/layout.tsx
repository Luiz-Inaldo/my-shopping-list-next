import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações | Minha Lista",
  description: "Ajustes de acordo com a preferência do usuário.",
  openGraph: {
    title: "Configurações | Minha Lista",
    description: "Ajustes de acordo com a preferência do usuário.",
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