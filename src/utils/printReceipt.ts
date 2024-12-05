import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";

export const printReceipt = async (receipt: Receipt) => {
  const html = generateReceiptHTML(receipt);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};