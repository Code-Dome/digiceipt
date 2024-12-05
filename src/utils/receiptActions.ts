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
            size: A5 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 20px;
            width: 148mm;
            height: 210mm;
            font-family: system-ui, sans-serif;
            background: white;
          }
          .receipt-container {
            padding: 20px;
            height: calc(100% - 40px);
            display: flex;
            flex-direction: column;
            gap: 20px;
            background: white;
          }
          .header {
            text-align: center;
          }
          .header h2 {
            margin: 0;
            color: #6E59A5;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .field {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .field strong {
            width: 120px;
            color: #666;
          }
          .field span {
            flex: 1;
          }
          .signature {
            margin-top: auto;
            padding-top: 20px;
            text-align: center;
          }
          .signature img {
            max-width: 200px;
            margin: 0 auto;
            display: block;
          }
          .signature p {
            margin: 5px 0;
            color: #666;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h2>${settings.companyName || 'Company Name'}</h2>
            <p>${settings.address || ''}</p>
          </div>
          
          <div class="content">
            <div class="field">
              <strong>Invoice #:</strong>
              <span>${receipt.invoiceNo}</span>
            </div>
            <div class="field">
              <strong>Date:</strong>
              <span>${receipt.timestamp}</span>
            </div>
            <div class="field">
              <strong>Driver:</strong>
              <span>${receipt.driverName}</span>
            </div>
            <div class="field">
              <strong>Horse Reg:</strong>
              <span>${receipt.horseReg}</span>
            </div>
            <div class="field">
              <strong>Company:</strong>
              <span>${receipt.companyName}</span>
            </div>
            <div class="field">
              <strong>Wash Type:</strong>
              <span>${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</span>
            </div>
            ${receipt.customFields.map(field => `
              <div class="field">
                <strong>${field.label}:</strong>
                <span>${field.value}</span>
              </div>
            `).join('')}
          </div>
          
          ${receipt.signature ? `
            <div class="signature">
              <img src="${receipt.signature}" alt="Signature" />
              <p>Signature</p>
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