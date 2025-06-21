import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Lista | Menu",
  description: "Acesso ao menu principal.",
  openGraph: {
    title: "Minha Lista | Menu",
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