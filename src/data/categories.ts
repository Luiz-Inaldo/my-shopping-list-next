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
    backgroundColor: "var(--category-1)"
  },
  {
    name: "Limpeza",
    icon: SprayCan,
    backgroundColor: "var(--category-2)"
  },
  {
    name: "Frios e Laticínios",
    icon: Milk,
    backgroundColor: "var(--category-3)"
  },
  {
    name: "Carnes e Peixes",
    icon: Beef,
    backgroundColor: "var(--category-4)"
  },
  {
    name: "Padaria",
    icon: CakeSlice,
    backgroundColor: "var(--category-5)"
  },
  {
    name: "Higiene Pessoal",
    icon: Sparkles,
    backgroundColor: "var(--category-6)"
  },
  {
    name: "Bebidas",
    icon: Wine,
    backgroundColor: "var(--category-7)"
  },
  {
    name: "Congelados",
    icon: ThermometerSnowflake,
    backgroundColor: "var(--category-8)"
  },
  {
    name: "Hortifruti",
    icon: Apple,
    backgroundColor: "var(--category-9)"
  },
  {
    name: "Outros",
    icon: ShoppingBasket,
    backgroundColor: "var(--category-10)"
  }
];
