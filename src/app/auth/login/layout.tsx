import { Quicksand } from "next/font/google";
import "../../../styles/globals.css";
import { Metadata } from "next";
import VerifyDevice from "@/components/VerifyDevice";

const quicksand = Quicksand({ weight: ['300', '400', '500', '700'], subsets: ["latin"] });

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
        <html lang="pt-br">
            <body className={quicksand.className}>
                <div className="relative">
                    <VerifyDevice>
                        {children}
                    </VerifyDevice>
                </div>
            </body>
        </html>
    );
}
