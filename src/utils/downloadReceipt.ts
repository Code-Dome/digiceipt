import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '595px';
  container.style.height = '620px';
  container.style.padding = '20px';
  container.style.boxSizing = 'border-box';
  container.style.background = 'white';
  container.style.display = 'inline-block';

  document.body.appendChild(container);

  try {
    console.log('Generated HTML:', container.innerHTML);

    const containerHeight = container.offsetHeight + 40;

    const canvas = await html2canvas(container, {
      scale: 2,
      width: container.offsetWidth,
      height: containerHeight,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true,
    });

    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
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