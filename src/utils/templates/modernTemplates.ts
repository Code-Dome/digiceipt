import { baseStyles } from './baseTemplate';
import { Receipt } from '@/types/receipt';
import { CompanySettings } from '@/types/companySettings';
import { TemplateStyle } from '@/types/receipt';

export const modernTemplates: TemplateStyle[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and minimalist design with soft colors",
    icon: "layout",
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
  }
];