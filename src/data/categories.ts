import {
  UtensilsCrossed,
  Milk,
  Beef,
  CakeSlice,
  Sparkles,
  Wine,
  ThermometerSnowflake,
  ShoppingBasket,
  Apple,
  SprayCan,
} from "lucide-react";

export const CATEGORIES_LIST = [
  {
    name: "Mercearia",
    icon: UtensilsCrossed,
    backgroundColor: "bg-green-300 dark:bg-green-500"
  },
  {
    name: "Limpeza",
    icon: SprayCan,
    backgroundColor: "bg-blue-300 dark:bg-blue-500"
  },
  {
    name: "Frios e Laticínios",
    icon: Milk,
    backgroundColor: "bg-orange-200 dark:bg-orange-500"
  },
  {
    name: "Carnes e Peixes",
    icon: Beef,
    backgroundColor: "bg-red-300 dark:bg-red-500"
  },
  {
    name: "Padaria",
    icon: CakeSlice,
    backgroundColor: "bg-amber-200 dark:bg-amber-500"
  },
  {
    name: "Higiene Pessoal",
    icon: Sparkles,
    backgroundColor: "bg-purple-300 dark:bg-purple-500"
  },
  {
    name: "Bebidas",
    icon: Wine,
    backgroundColor: "bg-blue-200 dark:bg-blue-500"
  },
  {
    name: "Congelados",
    icon: ThermometerSnowflake,
    backgroundColor: "bg-indigo-200 dark:bg-indigo-500"
  },
  {
    name: "Hortifruti",
    icon: Apple,
    backgroundColor: "bg-emerald-200 dark:bg-emerald-500"
  },
  {
    name: "Outros",
    icon: ShoppingBasket,
    backgroundColor: "bg-gray-300 dark:bg-gray-500"
  }
];
