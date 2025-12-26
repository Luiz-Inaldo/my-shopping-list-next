import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StaticAlertProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "warning" | "info" | "success";
}

export function StaticAlert({
  title,
  description,
  icon,
  variant = "default",
}: StaticAlertProps) {
  return (
    <Alert variant={variant}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

