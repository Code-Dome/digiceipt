import { useNavigate } from 'react-router-dom';
import { Receipt } from '@/types/receipt';
import html2canvas from 'html2canvas';

export const useReceiptActions = () => {
  const navigate = useNavigate();

  const printReceipt = async (receipt: Receipt) => {
    const receiptElement = document.getElementById(`receipt-${receipt.id}`);
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement);
      const dataUrl = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Print Receipt</title></head>
            <body>
              <img src="${dataUrl}" onload="window.print();window.close()" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const downloadReceipt = async (receipt: Receipt) => {
    const receiptElement = document.getElementById(`receipt-${receipt.id}`);
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement);
      const link = document.createElement('a');
      link.download = `receipt-${receipt.invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const navigateToTemplates = (receipt: Receipt) => {
    navigate('/templates', { state: { receipt } });
  };

  return {
    printReceipt,
    downloadReceipt,
    navigateToTemplates,
  };
};