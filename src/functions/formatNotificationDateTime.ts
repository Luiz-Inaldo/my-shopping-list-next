import { Timestamp } from 'firebase/firestore';

/**
 * @description Formata um Timestamp do Firebase com data e hora para exibição nas notificações.
 * @param {Timestamp | null | undefined} dateTime - Data e hora da notificação.
 * @returns {string} Data e hora formatadas.
 */
export function formatNotificationDateTime(dateTime: Timestamp | null | undefined): string {
  if (!dateTime) return '';

  return dateTime.toDate().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}