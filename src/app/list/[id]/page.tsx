"use client";
import ShoppingList from "@/components/ShoppingList";
import { ShoplistProvider } from "@/context/ShoplistContext";

export default function Statistics() {

    return (
        <ShoplistProvider>
            <ShoppingList />
        </ShoplistProvider>
    )
}
