import { Receipt } from "@/types/receipt";
import html2canvas from "html2canvas";
import { CompanySettings } from "@/types/companySettings";

const generateReceiptHTML = (receipt: Receipt) => {
  const settings: CompanySettings = JSON.parse(localStorage.getItem("companySettings") || "{}");
  
  return `
    <div style="font-family: system-ui, sans-serif; width: 148mm; min-height: 210mm; margin: 0; padding: 20px; background: linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
        <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
      </div>
      
      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
      </div>
      
      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="margin: 5px 0;"><strong>Driver:</strong> ${receipt.driverName}</p>
        <p style="margin: 5px 0;"><strong>Horse Reg:</strong> ${receipt.horseReg}</p>
        <p style="margin: 5px 0;"><strong>Company:</strong> ${receipt.companyName}</p>
        <p style="margin: 5px 0;"><strong>Wash Type:</strong> ${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</p>
        ${receipt.customFields.map(field => `
          <p style="margin: 5px 0;"><strong>${field.label}:</strong> ${field.value}</p>
        `).join('')}
      </div>
      
      ${receipt.signature ? `
        <div style="text-align: center;">
          <img src="${receipt.signature}" style="max-width: 200px; margin: 10px 0;" />
          <p style="margin: 5px 0; color: #666;">Signature</p>
        </div>
      ` : ''}
      
      ${settings.termsAndConditions ? `
        <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
          ${settings.termsAndConditions}
        </div>
      ` : ''}
    </div>
  `;
};

export const printReceipt = async (receipt: Receipt) => {
  const html = generateReceiptHTML(receipt);
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

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = generateReceiptHTML(receipt);
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '148mm';
  container.style.height = '210mm';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.transform = 'scale(1)';
  container.style.transformOrigin = 'top left';
  
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      width: 559,  // 148mm in pixels at 96 DPI
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

export const archiveReceipt = (receipt: Receipt) => {
  const archivedReceipts = JSON.parse(localStorage.getItem('archivedReceipts') || '[]');
  const receiptExists = archivedReceipts.some((r: Receipt) => r.id === receipt.id);
  
  if (!receiptExists) {
    archivedReceipts.push(receipt);
    localStorage.setItem('archivedReceipts', JSON.stringify(archivedReceipts));
  }
  
  const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  const updatedReceipts = activeReceipts.filter((r: Receipt) => r.id !== receipt.id);
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
};

export const unarchiveReceipt = (receipt: Receipt) => {
  const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  activeReceipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(activeReceipts));
  
  const archivedReceipts = JSON.parse(localStorage.getItem('archivedReceipts') || '[]');
  const updatedArchived = archivedReceipts.filter((r: Receipt) => r.id !== receipt.id);
  localStorage.setItem('archivedReceipts', JSON.stringify(updatedArchived));
};

export const deleteReceipt = (receipt: Receipt, isArchived: boolean = false) => {
  const storageKey = isArchived ? 'archivedReceipts' : 'receipts';
  const existingReceipts = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updatedReceipts = existingReceipts.filter((r: Receipt) => r.id !== receipt.id);
  localStorage.setItem(storageKey, JSON.stringify(updatedReceipts));
};
