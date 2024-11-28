import { Receipt } from "@/types/receipt";
import html2canvas from "html2canvas";

const getCompanySettings = () => {
  const settings = localStorage.getItem('companySettings');
  return settings ? JSON.parse(settings) : {
    name: "TruckWash Pro",
    termsAndConditions: "Terms & Conditions: All services are provided as-is. Payment is due upon completion of service."
  };
};

const createReceiptHTML = (receipt: Receipt, settings: any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${receipt.invoiceNo}</title>
        <style>
          @page { size: 105mm 148mm; margin: 0; }
          body {
            font-family: Arial, sans-serif;
            padding: 10mm;
            max-width: 85mm;
            margin: 0 auto;
            color: #333;
          }
          .header { text-align: center; margin-bottom: 5mm; }
          .company-name { font-size: 14pt; margin: 0; color: #7E69AB; }
          .invoice-number { font-size: 12pt; margin: 2mm 0; color: #7E69AB; }
          .timestamp { font-size: 10pt; color: #888; }
          .details { margin: 5mm 0; }
          .field { margin: 2mm 0; }
          .field-label { font-weight: bold; color: #6E59A5; }
          .signature { margin-top: 5mm; border-top: 1px solid #eee; padding-top: 5mm; }
          .footer { margin-top: 5mm; font-size: 8pt; text-align: center; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-name">${settings.name}</h1>
          <p class="invoice-number">Receipt #${receipt.invoiceNo}</p>
          <p class="timestamp">${receipt.timestamp}</p>
        </div>
        <div class="details">
          <div class="field">
            <span class="field-label">Driver:</span> ${receipt.driverName}
          </div>
          <div class="field">
            <span class="field-label">Horse Reg:</span> ${receipt.horseReg}
          </div>
          <div class="field">
            <span class="field-label">Company:</span> ${receipt.companyName}
          </div>
          <div class="field">
            <span class="field-label">Wash Type:</span> ${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}
          </div>
          ${receipt.customFields.map(field => `
            <div class="field">
              <span class="field-label">${field.label}:</span> ${field.value}
            </div>
          `).join('')}
        </div>
        <div class="signature">
          <span class="field-label">Signature:</span><br>
          <img src="${receipt.signature}" alt="Signature" style="max-width: 100%; margin-top: 2mm;">
        </div>
        <div class="footer">
          ${settings.termsAndConditions}
        </div>
      </body>
    </html>
  `;
};

export const downloadReceiptAsA6 = async (receipt: Receipt) => {
  const settings = getCompanySettings();
  const html = createReceiptHTML(receipt, settings);
  
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      width: 396, // A6 width in pixels at 96 DPI
      height: 559, // A6 height in pixels at 96 DPI
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
  // Check if receipt already exists in archived receipts
  const receiptExists = archivedReceipts.some((r: Receipt) => r.id === receipt.id);
  
  if (!receiptExists) {
    archivedReceipts.push(receipt);
    localStorage.setItem('archivedReceipts', JSON.stringify(archivedReceipts));
  }
  
  // Remove from active receipts
  const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  const updatedReceipts = activeReceipts.filter((r: Receipt) => r.id !== receipt.id);
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
};

export const unarchiveReceipt = (receipt: Receipt) => {
  // Add to active receipts
  const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  activeReceipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(activeReceipts));
  
  // Remove from archived receipts
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
