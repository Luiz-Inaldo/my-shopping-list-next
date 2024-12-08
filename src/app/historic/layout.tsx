import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórico | Minha Lista",
  description: "Navegue entre suas atividades passadas.",
  openGraph: {
    title: "Histórico | Minha Lista",
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