import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Lista | Notificações",
  description: "Notificações e alertas relacionados à sua conta.",
  openGraph: {
    title: "Minha Lista | Notificações",
    description: "Notificações e alertas relacionados à sua conta.",
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