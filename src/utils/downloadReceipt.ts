import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";
import html2canvas from "html2canvas";

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);

  // Add padding and adjust styles
  container.style.width = '559px'; // Match canvas width
  container.style.padding = '20px'; // Add padding
  container.style.boxSizing = 'border-box'; // Include padding in the box model
  container.style.background = 'white'; // Ensure white background
  container.style.display = 'inline-block'; // Avoid width auto-adjustments

  document.body.appendChild(container);

  try {
    console.log('Generated HTML:', container.innerHTML); // Debug

    // Dynamically calculate height
    const containerHeight = container.offsetHeight + 40; // Adjust for extra padding

    const canvas = await html2canvas(container, {
      scale: 2, // Increase resolution
      width: container.offsetWidth, // Match container width
      height: containerHeight, // Match calculated height
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true,
    });

    // Download the canvas as an image
    const link = document.createElement('a');
    link.download = `receipt-${receipt.invoiceNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
  } finally {
    // Cleanup the container
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
