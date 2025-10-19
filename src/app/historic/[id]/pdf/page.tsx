import { ShoplistProvider } from "@/context/ShoplistContext";
import { HistoricListPDF } from "./_components/PDFGenerator";

export default function HistoricDetailsPDF() {
  return (
    <ShoplistProvider>
      <HistoricListPDF />
    </ShoplistProvider>
  );
}