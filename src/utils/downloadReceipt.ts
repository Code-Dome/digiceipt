import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);
  container.style.width = '559px';
  container.style.height = '794px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.background = 'white';

  document.body.appendChild(container);

  try {
    console.log('Generated HTML:', container.innerHTML); // Debug

    await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure content is rendered

    const canvas = await html2canvas(container, {
      scale: 2,
      width: 559,
      height: 794,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true,
      windowWidth: 559,
      windowHeight: 794,
    });

    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
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
