import { Receipt } from "@/types/receipt";
import html2canvas from "html2canvas";
import { CompanySettings } from "@/types/companySettings";

const generateReceiptHTML = (receipt: Receipt) => {
  const settings: CompanySettings = JSON.parse(localStorage.getItem("companySettings") || "{}");
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page {
            size: A5;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 20px;
            width: 148mm;
            height: 210mm;
            font-family: system-ui, sans-serif;
            background: white;
            box-sizing: border-box;
          }
          .receipt-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
          }
          .content {
            padding: 15px;
            flex-grow: 1;
          }
          .field {
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .field strong {
            color: #666;
            min-width: 120px;
            display: inline-block;
          }
          .signature {
            margin-top: 30px;
            text-align: center;
          }
          .signature img {
            max-width: 200px;
            margin: 10px auto;
          }
          .footer {
            margin-top: 20px;
            padding: 10px;
            font-size: 12px;
            color: #666;
            text-align: center;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
            <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
          </div>
          
          <div class="content">
            <div class="field"><strong>Invoice #:</strong> ${receipt.invoiceNo}</div>
            <div class="field"><strong>Date:</strong> ${receipt.timestamp}</div>
            <div class="field"><strong>Driver:</strong> ${receipt.driverName}</div>
            <div class="field"><strong>Horse Reg:</strong> ${receipt.horseReg}</div>
            <div class="field"><strong>Company:</strong> ${receipt.companyName}</div>
            <div class="field"><strong>Wash Type:</strong> ${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</div>
            ${receipt.customFields.map(field => `
              <div class="field"><strong>${field.label}:</strong> ${field.value}</div>
            `).join('')}
          </div>
          
          ${receipt.signature ? `
            <div class="signature">
              <img src="${receipt.signature}" style="max-width: 200px; margin: 10px auto;" />
              <p style="margin: 5px 0; color: #666;">Signature</p>
            </div>
          ` : ''}
          
          ${settings.termsAndConditions ? `
            <div class="footer">
              ${settings.termsAndConditions}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
};

export const printReceipt = async (receipt: Receipt) => {
  const html = generateReceiptHTML(receipt);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
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