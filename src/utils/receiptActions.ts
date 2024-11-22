import { Receipt } from "@/types/receipt";

export const printReceipt = (receipt: Receipt) => {
  const printWindow = window.open('', '', 'width=300,height=600');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${receipt.invoiceNo}</title>
        <style>
          body {
            font-family: monospace;
            width: 300px;
            padding: 20px;
            margin: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .field {
            margin-bottom: 10px;
          }
          .signature {
            margin-top: 20px;
            text-align: center;
          }
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Receipt #${receipt.invoiceNo}</h2>
          <p>${receipt.timestamp}</p>
        </div>
        <div class="field">Driver: ${receipt.driverName}</div>
        <div class="field">Horse Reg: ${receipt.horseReg}</div>
        <div class="field">Company: ${receipt.companyName}</div>
        <div class="field">Wash Type: ${receipt.washType}</div>
        ${receipt.customFields.map(field => 
          `<div class="field">${field.label}: ${field.value}</div>`
        ).join('')}
        <div class="signature">
          <img src="${receipt.signature}" alt="Signature" />
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
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
  archivedReceipts.push(receipt);
  localStorage.setItem('archivedReceipts', JSON.stringify(archivedReceipts));
  
  // Remove from active receipts
  const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  const updatedReceipts = activeReceipts.filter((r: Receipt) => r.id !== receipt.id);
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
};