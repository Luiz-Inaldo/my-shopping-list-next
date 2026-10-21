"use client";
import React, { createContext, useContext } from "react";
import { INotificationsContextProps } from "@/types/notifications";
import { useAllNotificationsQuery } from "@/hooks/queries/notifications";
import { handleMarkNotificationAsRead } from "@/services/notificationsServices";

export const NotificationsContext = createContext<INotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryData = useAllNotificationsQuery();

  return (
    <NotificationsContext.Provider
      value={{
        queryData,
        markAsRead: handleMarkNotificationAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider");
  }
  return context;
}
