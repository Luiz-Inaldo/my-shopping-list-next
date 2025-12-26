'use client';

import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";

interface FloatingAlertProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "warning" | "info" | "success";
}

export function FloatingAlert({
  title,
  description,
  icon,
  variant = "default",
}: FloatingAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  return ReactDOM.createPortal(
        <motion.div
          key={title}
          initial={{ y: "-110%", x: "-50%" }}
          animate={{ y: isVisible ? 10 : "-110%", x: "-50%" }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30
         }}
          className="fixed top-0 left-1/2 z-50 w-full max-w-sm"
        >
          <Alert variant={variant} className="relative pr-12 shadow-lg">
            {icon}
            <AlertTitle>{title}</AlertTitle>
            {description && <AlertDescription>{description}</AlertDescription>}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </Alert>
        </motion.div>,
    document.body
  );
}

