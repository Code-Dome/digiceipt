import { Receipt } from "@/types/receipt";

// Company settings can be stored in localStorage
const getCompanySettings = () => {
  const settings = localStorage.getItem('companySettings');
  return settings ? JSON.parse(settings) : {
    name: "TruckWash Pro",
    termsAndConditions: "Terms & Conditions: All services are provided as-is. Payment is due upon completion of service."
  };
};

export const printReceipt = (receipt: Receipt) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const { name: companyName, termsAndConditions } = getCompanySettings();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${receipt.invoiceNo}</title>
        <style>
          @page {
            margin: 0;
            size: A4;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            @page { margin: 0; }
            @page :footer { display: none }
            @page :header { display: none }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            color: #333;
            position: relative;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #9b87f5;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 32px;
            color: #7E69AB;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .invoice-details {
            margin: 20px 0;
            padding: 20px;
            background: #f8f8f8;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .field {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .field:last-child {
            border-bottom: none;
          }
          .field-label {
            font-weight: bold;
            color: #6E59A5;
            min-width: 150px;
          }
          .field-value {
            text-align: right;
            flex: 1;
          }
          .signature-section {
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .signature {
            max-width: 300px;
            margin: 20px 0;
            border: 1px solid #eee;
            padding: 10px;
            background: white;
          }
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .terms {
            margin-top: 10px;
            font-style: italic;
            color: #888;
          }
          .invoice-number {
            font-size: 18px;
            color: #7E69AB;
            margin: 10px 0;
          }
          .timestamp {
            color: #888;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-name">${companyName}</h1>
          <p class="invoice-number">Receipt #${receipt.invoiceNo}</p>
          <p class="timestamp">${receipt.timestamp}</p>
        </div>

        <div class="invoice-details">
          <div class="field">
            <span class="field-label">Driver:</span>
            <span class="field-value">${receipt.driverName}</span>
          </div>
          <div class="field">
            <span class="field-label">Horse Registration:</span>
            <span class="field-value">${receipt.horseReg}</span>
          </div>
          <div class="field">
            <span class="field-label">Company:</span>
            <span class="field-value">${receipt.companyName}</span>
          </div>
          <div class="field">
            <span class="field-label">Wash Type:</span>
            <span class="field-value">${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</span>
          </div>
          ${receipt.customFields.map(field => `
            <div class="field">
              <span class="field-label">${field.label}:</span>
              <span class="field-value">${field.value}</span>
            </div>
          `).join('')}
        </div>

        <div class="signature-section">
          <p class="field-label">Signature:</p>
          <img src="${receipt.signature}" alt="Signature" class="signature" />
        </div>

        <div class="footer">
          <div>${companyName}</div>
          <div class="terms">${termsAndConditions}</div>
        </div>

        <script>
          window.onload = () => {
            window.print();
            document.title = '${receipt.invoiceNo}';
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const downloadReceipt = (receipt: Receipt) => {
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
