import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Lista | Validar E-mail",
  description: "Valide seu e-mail para usar o aplicativo.",
  openGraph: {
    title: "Minha Lista | Validar E-mail",
    description: "Valide seu e-mail para usar o aplicativo.",
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