import { modernTemplates } from './modernTemplates';
import { softTemplates } from './softTemplates';
import { TemplateStyle } from '@/types/receipt';

export const receiptTemplates: TemplateStyle[] = [
  ...modernTemplates,
  ...softTemplates
];

export const getTemplateById = (templateId: string): TemplateStyle | undefined => {
  return receiptTemplates.find(template => template.id === templateId);
};