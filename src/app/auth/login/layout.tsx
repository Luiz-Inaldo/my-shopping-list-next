import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Faça login e começe | Minha Lista",
    description: "Entre na sua conta e comece a usar o aplicativo.",
    openGraph: {
        title: "Faça login e começe | Minha Lista",
        description: "Entre na sua conta e comece a usar o aplicativo.",
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
