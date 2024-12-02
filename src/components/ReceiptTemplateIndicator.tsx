import { useReceiptTemplate } from '@/hooks/useReceiptTemplate';
import { Receipt } from '@/types/receipt';
import { LayoutTemplate } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface ReceiptTemplateIndicatorProps {
  receipt: Receipt;
}

export const ReceiptTemplateIndicator = ({ receipt }: ReceiptTemplateIndicatorProps) => {
  const { selectedTemplate } = useReceiptTemplate(receipt);
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
      onClick={() => navigate('/templates', { state: { receipt } })}
    >
      <LayoutTemplate className="w-4 h-4" />
      <span>{selectedTemplate?.name || 'Choose Template'}</span>
    </Button>
  );
};