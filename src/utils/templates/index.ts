import { modernTemplates } from './modernTemplates';
import { softTemplates } from './softTemplates';
import { TemplateStyle } from '@/types/receipt';

export const receiptTemplates: TemplateStyle[] = [
  ...modernTemplates,
  ...softTemplates
];

export const getTemplateById = (templateId: string): TemplateStyle => {
  const template = receiptTemplates.find(t => t.id === templateId);
  if (!template) {
    // Return default template if none found
    return receiptTemplates[0];
  }
  return template;
};