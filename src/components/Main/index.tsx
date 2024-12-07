'use client'
import React, {
  useContext,
} from "react";
import { ProductsContext } from "@/context/ProductsContext";
import NonPurchaseList from "../NonPurchaseList";
import ShoppingList from "../ShoppingList";

const Main = () => {
  const {
    data,
    user,
    currentPurchase,
  } = useContext(ProductsContext);

  return (
    <React.Fragment>
      <main
        className={`main-container py-28 px-5 flex flex-col gap-5`}
      >
        {(data.length === 0 && !currentPurchase) ? (
          <NonPurchaseList user={user} />
        ) : (
          <ShoppingList listname={currentPurchase?.list_name} />
        )}
      </main>
    </React.Fragment>
  );
};

export default Main;
