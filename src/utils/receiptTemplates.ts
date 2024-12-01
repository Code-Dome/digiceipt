import { Receipt } from "@/types/receipt";
import { CompanySettings } from "@/types/companySettings";

export type TemplateStyle = {
  id: string;
  name: string;
  description: string;
  generateHTML: (receipt: Receipt, settings: CompanySettings) => string;
};

export const receiptTemplates: TemplateStyle[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional receipt style with clean layout",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <div style="font-family: 'Courier New', monospace; max-width: 400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px; padding: 20px 0; border-bottom: 2px solid #eee;">
          <h2 style="margin: 0; color: #333;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
          <p style="margin: 5px 0;"><strong>Driver:</strong> ${receipt.driverName}</p>
          <p style="margin: 5px 0;"><strong>Horse Reg:</strong> ${receipt.horseReg}</p>
          <p style="margin: 5px 0;"><strong>Wash Type:</strong> ${receipt.washType}</p>
        </div>
        
        ${receipt.customFields.map(field => `
          <p style="margin: 5px 0;"><strong>${field.label}:</strong> ${field.value}</p>
        `).join('')}
        
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          ${receipt.signature ? `
            <div style="text-align: center;">
              <img src="${receipt.signature}" style="max-width: 200px; margin: 10px 0;" />
              <p style="margin: 5px 0; color: #666;">Signature</p>
            </div>
          ` : ''}
        </div>
        
        ${settings.termsAndConditions ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #666;">
            <p>${settings.termsAndConditions}</p>
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with gradient accents",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 10px 0; color: #666;">${settings.address || ''}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 10px 0; color: #333;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 10px 0; color: #333;"><strong>Date:</strong> ${receipt.timestamp}</p>
          <p style="margin: 10px 0; color: #333;"><strong>Driver:</strong> ${receipt.driverName}</p>
          <p style="margin: 10px 0; color: #333;"><strong>Horse Reg:</strong> ${receipt.horseReg}</p>
          <p style="margin: 10px 0; color: #333;"><strong>Wash Type:</strong> ${receipt.washType}</p>
        </div>
        
        ${receipt.customFields.length > 0 ? `
          <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            ${receipt.customFields.map(field => `
              <p style="margin: 10px 0; color: #333;"><strong>${field.label}:</strong> ${field.value}</p>
            `).join('')}
          </div>
        ` : ''}
        
        ${receipt.signature ? `
          <div style="text-align: center; margin-top: 30px;">
            <img src="${receipt.signature}" style="max-width: 200px; margin: 10px 0; border-radius: 5px;" />
            <p style="margin: 5px 0; color: #666;">Signature</p>
          </div>
        ` : ''}
        
        ${settings.termsAndConditions ? `
          <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 10px; font-size: 0.8em; color: #666;">
            <p>${settings.termsAndConditions}</p>
          </div>
        ` : ''}
      </div>
    `
  }
];