import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EzShop | Notificações",
  description: "Acompanhe as notificações das suas listas.",
  openGraph: {
    title: "EzShop | Notificações",
    description: "Acompanhe as notificações das suas listas.",
  }
};

export default function NotificationsLayout({
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
