import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { getTemplateById } from '@/utils/templates';
import { Receipt } from '@/types/receipt';
import { CompanySettings } from '@/types/companySettings';

export const useReceiptActions = () => {
  const navigate = useNavigate();

  const getReceiptTemplate = (receipt: Receipt) => {
    const settings: CompanySettings = JSON.parse(localStorage.getItem("companySettings") || "{}");
    const templateId = localStorage.getItem(`template_${receipt.id}`);
    const template = getTemplateById(templateId || 'modern-minimal');
    return template.generateHTML(receipt, settings);
  };

  const printReceipt = async (receipt: Receipt) => {
    const html = getReceiptTemplate(receipt);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt #${receipt.invoiceNo}</title>
            <style>
              @page {
                size: 148mm 210mm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                width: 148mm;
                height: 210mm;
                overflow: hidden;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                @page {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const downloadReceipt = async (receipt: Receipt) => {
    const container = document.createElement('div');
    container.innerHTML = getReceiptTemplate(receipt);
    container.style.width = '148mm';
    container.style.height = '210mm';
    container.style.margin = '0';
    container.style.padding = '0';
    document.body.appendChild(container);
    
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        width: 148 * 3.78, // A5 width in pixels (96 DPI)
        height: 210 * 3.78, // A5 height in pixels (96 DPI)
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: 148 * 3.78,
        windowHeight: 210 * 3.78
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