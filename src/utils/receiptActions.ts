import { Receipt } from "@/types/receipt";
import html2canvas from "html2canvas";
import { getTemplateById } from './templates';

const getReceiptHTML = (receipt: Receipt) => {
  const settings = JSON.parse(localStorage.getItem("companySettings") || "{}");
  const templateId = localStorage.getItem(`template_${receipt.id}`) || 
                    localStorage.getItem('defaultTemplate') || 
                    'modern-minimal';
  const template = getTemplateById(templateId);
  
  if (!template) {
    throw new Error('Template not found');
  }
  
  return template.generateHTML(receipt, settings);
};

export const printReceipt = async (receipt: Receipt) => {
  const html = getReceiptHTML(receipt);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
};

export const downloadReceipt = async (receipt: Receipt) => {
  const container = document.createElement('div');
  container.innerHTML = getReceiptHTML(receipt);
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      width: 148 * 3.78, // A5 width in pixels (96 DPI)
      height: 210 * 3.78, // A5 height in pixels (96 DPI)
      backgroundColor: null,
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
