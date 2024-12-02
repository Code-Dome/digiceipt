import { Receipt } from "@/types/receipt";
import { CompanySettings } from "@/types/companySettings";

export type TemplateStyle = {
  id: string;
  name: string;
  description: string;
  generateHTML: (receipt: Receipt, settings: CompanySettings) => string;
};

const baseStyles = `
  @page { 
    size: 148mm 210mm; /* A5 */
    margin: 10mm;
  }
  @media print {
    body {
      width: 148mm;
      height: 210mm;
      margin: 0;
      padding: 10mm;
    }
  }
`;

export const receiptTemplates: TemplateStyle[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and minimalist design with soft colors",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%); padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
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
      </div>
    `
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    description: "Gentle gradient background with rounded corners",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: linear-gradient(to top, #accbee 0%, #e7f0fd 100%); padding: 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
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
      </div>
    `
  },
  {
    id: "soft-black",
    name: "Soft Black",
    description: "Elegant black background with soft white details",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: black; color: white; padding: 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0;">${settings.address || ''}</p>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
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
            <p style="margin: 5px 0;">Signature</p>
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "A classic retro design with distressed background",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: 'Courier New', monospace; max-width: 128mm; margin: 0 auto; background: linear-gradient(to right, #e6dbdb, #d6cfcf); padding: 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px; text-decoration: underline;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
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
            <p style="margin: 5px 0;">Signature</p>
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "professional",
    name: "Professional",
    description: "A clean and professional look with black and white",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: 'Arial', sans-serif; max-width: 128mm; margin: 0 auto; background: white; padding: 20px; border: 1px solid #ccc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="padding: 15px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
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
            <p style="margin: 5px 0;">Signature</p>
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative design with artistic flair",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: 'Comic Sans MS', cursive, sans-serif; max-width: 128mm; margin: 0 auto; background: #f0f0f0; padding: 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px; color: #e67e22;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
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
            <p style="margin: 5px 0;">Signature</p>
          </div>
        ` : ''}
      </div>
    `
  }
];
