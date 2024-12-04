import { useState, useEffect } from 'react';
import { getTemplateById } from '@/utils/templates';
import { Receipt } from '@/types/receipt';
import { TemplateStyle } from '@/types/receipt';

export const useReceiptTemplate = (receipt: Receipt) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle | undefined>();

  useEffect(() => {
    const storedTemplateId = localStorage.getItem(`template_${receipt.id}`);
    const defaultTemplateId = localStorage.getItem('defaultTemplate');
    const templateId = storedTemplateId || defaultTemplateId || 'modern-minimal';
    const template = getTemplateById(templateId);
    setSelectedTemplate(template);
  }, [receipt.id]);

  const updateTemplate = (template: TemplateStyle) => {
    localStorage.setItem(`template_${receipt.id}`, template.id);
    setSelectedTemplate(template);
  };

  return {
    selectedTemplate,
    updateTemplate
  };
};