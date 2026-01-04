import { ItemCategories } from "@/enums/categories";
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
    name: ItemCategories.MERCEARIA,
    icon: UtensilsCrossed,
    backgroundColor: "var(--category-1)"
  },
  {
    name: ItemCategories.LIMPEZA,
    icon: SprayCan,
    backgroundColor: "var(--category-2)"
  },
  {
    name: ItemCategories.FRIOS_E_LATICINIOS,
    icon: Milk,
    backgroundColor: "var(--category-3)"
  },
  {
    name: ItemCategories.CARNES_E_PEIXES,
    icon: Beef,
    backgroundColor: "var(--category-4)"
  },
  {
    name: ItemCategories.PADARIA,
    icon: CakeSlice,
    backgroundColor: "var(--category-5)"
  },
  {
    name: ItemCategories.HIGIENE_PESSOAL,
    icon: Sparkles,
    backgroundColor: "var(--category-6)"
  },
  {
    name: ItemCategories.BEBIDAS,
    icon: Wine,
    backgroundColor: "var(--category-7)"
  },
  {
    name: ItemCategories.CONGELADOS,
    icon: ThermometerSnowflake,
    backgroundColor: "var(--category-8)"
  },
  {
    name: ItemCategories.HORTIFRUTI,
    icon: Apple,
    backgroundColor: "var(--category-9)"
  },
  {
    name: ItemCategories.OUTROS,
    icon: ShoppingBasket,
    backgroundColor: "var(--category-10)"
  }
];
