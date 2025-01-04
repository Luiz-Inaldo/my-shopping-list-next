import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórico | Menu",
  description: "Acesso ao menu principal.",
  openGraph: {
    title: "Histórico | Menu",
    description: "Acesso ao menu principal.",
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