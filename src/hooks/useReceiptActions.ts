import { useNavigate } from 'react-router-dom';
import { Receipt } from '@/types/receipt';
import { printReceipt, downloadReceipt } from '@/utils/receiptActions';

export const useReceiptActions = () => {
  const navigate = useNavigate();

  const navigateToTemplates = (receipt: Receipt) => {
    navigate('/templates', { state: { receipt } });
  };

  return {
    printReceipt,
    downloadReceipt,
    navigateToTemplates,
  };
};