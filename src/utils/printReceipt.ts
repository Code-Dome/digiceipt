import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";

import { Receipt } from "@/types/receipt";
import { generateReceiptHTML } from "./receiptTemplate";

export const printReceipt = async (receipt: Receipt) => {
  const html = generateReceiptHTML(receipt);
  
  // Add custom styles to remove header, footer, and page numbers
  const style = `
    <style>
      @page {
        margin: 0; /* Removes the browser's default margins */
      }
      body {
        margin: 0; /* Removes the body margin for precise alignment */
        -webkit-print-color-adjust: exact; /* Ensure color fidelity in printing */
      }
    </style>
  `;

  // Open a new window and set its content
  const printWindow = window.open('', 'ReceiptPrintWindow', 'width=800,height=600');
  if (printWindow) {
    // Write the styled HTML into the print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${receipt.invoiceNo}</title>
          ${style}
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);

    printWindow.document.close(); // Complete writing to the print window

    // Wait a moment before triggering print to ensure content is fully loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500); // Adjust the delay if necessary
  } else {
    console.error("Unable to open print window.");
  }
};
