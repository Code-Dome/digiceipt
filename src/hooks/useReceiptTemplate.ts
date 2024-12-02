import { useState, useEffect } from 'react';
import { getTemplateById } from '@/utils/templates';
import { Receipt } from '@/types/receipt';
import { TemplateStyle } from '@/types/receipt';

export const useReceiptTemplate = (receipt: Receipt) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle | undefined>();

  useEffect(() => {
    const templateId = localStorage.getItem(`template_${receipt.id}`) || 
                      localStorage.getItem('defaultTemplate') || 
                      'modern-minimal';
    const template = getTemplateById(templateId);
    setSelectedTemplate(template);
  }, [receipt.id]);

  const updateTemplate = (template: TemplateStyle) => {
    if (receipt.id !== 'preview') {
      localStorage.setItem(`template_${receipt.id}`, template.id);
    } else {
      localStorage.setItem('defaultTemplate', template.id);
    }
    setSelectedTemplate(template);
  };

  return {
    selectedTemplate,
    updateTemplate
  };
};