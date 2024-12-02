import { useNavigate } from 'react-router-dom';
import { Receipt } from '@/types/receipt';
import html2canvas from 'html2canvas';
import { receiptTemplates } from '@/utils/receiptTemplates';

export const useReceiptActions = () => {
  const navigate = useNavigate();

  const getReceiptTemplate = (receipt: Receipt) => {
    const settings = JSON.parse(localStorage.getItem("companySettings") || "{}");
    const templateId = localStorage.getItem(`template_${receipt.id}`) || localStorage.getItem('defaultTemplate') || 'modern-minimal';
    const template = receiptTemplates.find(t => t.id === templateId) || receiptTemplates[0];
    return template.generateHTML(receipt, settings);
  };

  const printReceipt = async (receipt: Receipt) => {
    const html = getReceiptTemplate(receipt);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const downloadReceipt = async (receipt: Receipt) => {
    const container = document.createElement('div');
    container.innerHTML = getReceiptTemplate(receipt);
    document.body.appendChild(container);
    
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        width: 148 * 3.78, // Convert mm to pixels (96 DPI)
        height: 210 * 3.78,
      });
      
      const link = document.createElement('a');
      link.download = `receipt-${receipt.invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      document.body.removeChild(container);
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