export const baseStyles = `
  @page { 
    size: 148mm 210mm; /* A5 */
    margin: 10mm;
  }
  @media print {
    body {
      width: 148mm;
      height: 210mm;
      margin: 0;
      padding: 10mm;
    }
  }
`;

export interface TemplateProps {
  id: string;
  name: string;
  description: string;
  icon: string;
}