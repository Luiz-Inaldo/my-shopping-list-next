import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erro de dispositivo",
  description: "Parece que a aplicação não está disponível no seu dispositivo.",
  openGraph: {
    title: "Erro de dispositivo",
    description: "Parece que a aplicação não está disponível no seu dispositivo.",
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
