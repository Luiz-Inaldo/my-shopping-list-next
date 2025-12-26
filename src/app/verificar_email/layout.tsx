import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Lista | Verificação de E-mail",
  description: "Verifique seu e-mail para continuar.",
  openGraph: {
    title: "Minha Lista | Verificação de E-mail",
    description: "Verifique seu e-mail para continuar.",
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