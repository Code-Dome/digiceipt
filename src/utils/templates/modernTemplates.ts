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
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%); padding: 20px; min-height: 100%;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #6E59A5; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
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
        ${settings.termsAndConditions ? `
          <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
            ${settings.termsAndConditions}
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "emerald-fresh",
    name: "Emerald Fresh",
    description: "Fresh green design with modern accents",
    icon: "leaf",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%); padding: 20px; min-height: 100%;">
        <div style="text-align: center; margin-bottom: 20px; background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px;">
          <h2 style="margin: 0; color: #2F855A; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Driver:</strong> ${receipt.driverName}</p>
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Horse Reg:</strong> ${receipt.horseReg}</p>
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Company:</strong> ${receipt.companyName}</p>
          <p style="margin: 5px 0;"><strong style="color: #2F855A;">Wash Type:</strong> ${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</p>
          ${receipt.customFields.map(field => `
            <p style="margin: 5px 0;"><strong style="color: #2F855A;">${field.label}:</strong> ${field.value}</p>
          `).join('')}
        </div>
        ${receipt.signature ? `
          <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
            <img src="${receipt.signature}" style="max-width: 200px; margin: 10px 0;" />
            <p style="margin: 5px 0; color: #666;">Signature</p>
          </div>
        ` : ''}
        ${settings.termsAndConditions ? `
          <div style="margin-top: 20px; font-size: 12px; color: #1F573D; text-align: center; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px;">
            ${settings.termsAndConditions}
          </div>
        ` : ''}
      </div>
    `
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Elegant purple design with gradient accents",
    icon: "crown",
    generateHTML: (receipt: Receipt, settings: CompanySettings) => `
      <style>${baseStyles}</style>
      <div style="font-family: system-ui, sans-serif; max-width: 128mm; margin: 0 auto; background: linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%); padding: 20px; min-height: 100%;">
        <div style="text-align: center; margin-bottom: 20px; background: rgba(255,255,255,0.95); padding: 15px; border-radius: 8px;">
          <h2 style="margin: 0; color: #6B46C1; font-size: 24px;">${settings.companyName || 'Company Name'}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address || ''}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Invoice #:</strong> ${receipt.invoiceNo}</p>
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Date:</strong> ${receipt.timestamp}</p>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Driver:</strong> ${receipt.driverName}</p>
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Horse Reg:</strong> ${receipt.horseReg}</p>
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Company:</strong> ${receipt.companyName}</p>
          <p style="margin: 5px 0;"><strong style="color: #6B46C1;">Wash Type:</strong> ${receipt.washType}${receipt.otherWashType ? ` - ${receipt.otherWashType}` : ''}</p>
          ${receipt.customFields.map(field => `
            <p style="margin: 5px 0;"><strong style="color: #6B46C1;">${field.label}:</strong> ${field.value}</p>
          `).join('')}
        </div>
        ${receipt.signature ? `
          <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
            <img src="${receipt.signature}" style="max-width: 200px; margin: 10px 0;" />
            <p style="margin: 5px 0; color: #666;">Signature</p>
          </div>
        ` : ''}
        ${settings.termsAndConditions ? `
          <div style="margin-top: 20px; font-size: 12px; color: #553C9A; text-align: center; background: rgba(255,255,255,0.95); padding: 10px; border-radius: 8px;">
            ${settings.termsAndConditions}
          </div>
        ` : ''}
      </div>
    `
  }
];