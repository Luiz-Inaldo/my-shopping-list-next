import { useEffect, useState } from "react";

export default function useLocalStorage() {

    const [purchaseActive, setPurchaseActive] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function setPurchase(name: string) {
        localStorage.setItem('purchase', JSON.stringify(name));
        setPurchaseActive(true);
    }

    function deletePurchase() {
        //TODO
    }

    useEffect(() => {
        if (!localStorage.getItem('purchase')) {
            setPurchaseActive(false);
        } else {
            setPurchaseActive(true);
        }
    }, [setPurchase]);

    return {
        purchaseActive,
        loading,
        setPurchaseActive,
        setPurchase
    };


}