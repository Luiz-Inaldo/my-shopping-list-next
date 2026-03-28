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
  className,
}: StaticAlertProps & { className?: string }) {
  return (
    <Alert variant={variant} className={className}>
      {icon}
      <AlertTitle className="font-sketchHeading text-lg">{title}</AlertTitle>
      {description && <AlertDescription className="font-sketch text-base">{description}</AlertDescription>}
    </Alert>
  );
}

