import { ShoplistProvider } from "@/context/ShoplistContext";
import { HistoricListDetails } from "@/app/historic/[id]/_components/Details";

export default function HistoricDetails() {
  return (
    <ShoplistProvider>
      <HistoricListDetails />
    </ShoplistProvider>
  );
}
