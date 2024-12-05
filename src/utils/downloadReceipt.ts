import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      width: 559, // 148mm in pixels at 96 DPI
      height: 794, // 210mm in pixels at 96 DPI
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: 559,
      windowHeight: 794,
      foreignObjectRendering: true,
      removeContainer: true,
      allowTaint: true,
    });
    
    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(container);
  }
};

export const downloadReceiptAsJson = (receipt: Receipt) => {
  const data = JSON.stringify(receipt, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${receipt.invoiceNo}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};