import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);

  // Set container styles with padding
  container.style.width = '559px';
  container.style.height = '794px';
  container.style.padding = '20px'; // Add padding to ensure content is not cut off
  container.style.boxSizing = 'border-box'; // Include padding in width and height
  container.style.position = 'relative';
  container.style.background = 'white';

  document.body.appendChild(container);

  try {
    console.log('Generated HTML:', container.innerHTML); // Debug

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Adjust canvas size to account for padding
    const canvas = await html2canvas(container, {
      scale: 2,
      width: container.offsetWidth,
      height: container.offsetHeight,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true,
    });

    // Download the generated image
    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
  } finally {
    // Cleanup
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
