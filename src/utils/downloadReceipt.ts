import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.width = '559px'; // 148mm at 96 DPI
  container.style.height = '794px'; // 210mm at 96 DPI
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.background = 'white';
  
  // Generate and insert HTML
  const htmlContent = generateReceiptHTML(receipt);
  container.innerHTML = htmlContent;
  document.body.appendChild(container);
  
  try {
    console.log('Generating receipt for:', receipt); // Debug log
    
    const canvas = await html2canvas(container, {
      scale: 2,
      width: 559,
      height: 794,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true, // Enable logging for debugging
      windowWidth: 559,
      windowHeight: 794,
      foreignObjectRendering: true,
      removeContainer: true,
      allowTaint: true,
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
  } finally {
    // Clean up
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