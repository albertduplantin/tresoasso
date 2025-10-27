import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatDate = (date: Date | number | Timestamp | any, formatStr: string = 'dd/MM/yyyy'): string => {
  // Convertir Timestamp Firestore en Date si nécessaire
  let dateToFormat: Date | number = date;
  
  if (date && typeof date === 'object' && 'toDate' in date) {
    // C'est un Timestamp Firestore
    dateToFormat = date.toDate();
  } else if (typeof date === 'string') {
    // C'est une string, la convertir en Date
    dateToFormat = new Date(date);
  }
  
  return format(dateToFormat, formatStr, { locale: fr });
};

export const formatDateTime = (date: Date | number): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
  return `Il y a ${Math.floor(diffInDays / 365)} ans`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

