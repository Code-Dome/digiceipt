import { Receipt } from "@/types/receipt";
import { CompanySettings } from "@/types/companySettings";

export const generateReceiptHTML = (receipt: Receipt) => {
  const settings: CompanySettings = JSON.parse(localStorage.getItem("companySettings") || "{}");
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            background: white;
            width: 519px; /* 148mm - 40px padding */
            height: 754px; /* 210mm - 40px padding */
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
            padding-bottom: 10px;
            border-bottom: 2px solid #6E59A5;
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
            margin-top: 30px;
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
            ${settings.address ? `<p>${settings.address}</p>` : ''}
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
            ${receipt.driverName ? `
              <div class="field">
                <strong>Driver:</strong>
                <span>${receipt.driverName}</span>
              </div>
            ` : ''}
            ${receipt.horseReg ? `
              <div class="field">
                <strong>Horse Reg:</strong>
                <span>${receipt.horseReg}</span>
              </div>
            ` : ''}
            ${receipt.companyName ? `
              <div class="field">
                <strong>Company:</strong>
                <span>${receipt.companyName}</span>
              </div>
            ` : ''}
            ${receipt.washType ? `
              <div class="field">
                <strong>Wash Type:</strong>
                <span>${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</span>
              </div>
            ` : ''}
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