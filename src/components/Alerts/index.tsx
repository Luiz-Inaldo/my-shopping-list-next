import { Mail } from "lucide-react";
import { ReactNode } from "react";
import { StaticAlert } from "./StaticAlert";
import { cn } from "@/lib/utils";

const alerts: Record<string, ReactNode> = {
    email: (
        <StaticAlert
            icon={<Mail />}
            title="E-mail pendente"
            description="Por favor, verifique seu e-mail para continuar utilizando o aplicativo."
            variant="warning"
        />
    )
}

export function AppAlert({ type, className }: { type: keyof typeof alerts, className?: string }) {
    return (
        <div className={cn(className)}>
            {alerts[type]}
        </div>
    );
}
