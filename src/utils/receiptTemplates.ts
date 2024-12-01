import { Receipt } from "@/types/receipt";
import { CompanySettings } from "@/types/companySettings";

export type TemplateStyle = {
  id: string;
  name: string;
  description: string;
  preview: string; // Base64 image preview
  generateHTML: (receipt: Receipt, settings: CompanySettings) => string;
};

export const receiptTemplates: TemplateStyle[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional receipt style with clean layout",
    preview: "", // Add base64 preview image
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', monospace;
              width: 148mm; /* A6 width */
              height: 105mm; /* A6 height */
              padding: 10mm;
              margin: 0;
            }
            .header { text-align: center; margin-bottom: 10px; }
            .details { margin: 15px 0; }
            .signature { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${settings.companyName || 'Company Name'}</h2>
            <p>${settings.address || ''}</p>
          </div>
          <div class="details">
            <p>Invoice #: ${receipt.invoiceNo}</p>
            <p>Date: ${receipt.timestamp}</p>
            <p>Driver: ${receipt.driverName}</p>
            <p>Horse Reg: ${receipt.horseReg}</p>
            <p>Wash Type: ${receipt.washType}</p>
          </div>
          <div class="signature">
            <img src="${receipt.signature}" style="max-width: 200px;" />
          </div>
        </body>
      </html>
    `
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with gradient accents",
    preview: "", // Add base64 preview image
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <html>
        <head>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              width: 148mm;
              height: 105mm;
              padding: 10mm;
              margin: 0;
              background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              color: #6E59A5;
            }
            .details {
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .signature {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${settings.companyName || 'Company Name'}</h2>
            <p>${settings.address || ''}</p>
          </div>
          <div class="details">
            <p>Invoice #: ${receipt.invoiceNo}</p>
            <p>Date: ${receipt.timestamp}</p>
            <p>Driver: ${receipt.driverName}</p>
            <p>Horse Reg: ${receipt.horseReg}</p>
            <p>Wash Type: ${receipt.washType}</p>
          </div>
          <div class="signature">
            <img src="${receipt.signature}" style="max-width: 200px;" />
          </div>
        </body>
      </html>
    `
  }
];