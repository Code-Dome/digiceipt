import { baseStyles } from './baseTemplate';
import { Receipt } from '@/types/receipt';
import { CompanySettings } from '@/types/companySettings';
import { TemplateStyle } from '@/types/receipt';

export const softTemplates: TemplateStyle[] = [
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    description: "Gentle gradient background with rounded corners",
    icon: "palette",
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
            <p style="margin: 5px 0;">Signature</p>
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "soft-black",
    name: "Soft Black",
    description: "Elegant black background with soft white details",
    icon: "moon",
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
    id: "soft-white",
    name: "Soft White",
    description: "Elegant white background with soft details",
    icon: "sun",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: white; padding: 20px; border-radius: 12px; border: 1px solid #ccc;">
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
];
