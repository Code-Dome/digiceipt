import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";

interface HeaderSectionProps {
  invoiceNo: string;
  timestamp: string;
}

export const HeaderSection = ({ invoiceNo, timestamp }: HeaderSectionProps) => {
  const formatDate = (dateString: string) => {
    try {
      return formatInTimeZone(
        parseISO(dateString),
        'Africa/Johannesburg',
        'dd/MM/yyyy HH:mm:ss'
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
      <div>
        <p className="font-semibold text-primary text-lg">
          Invoice #{invoiceNo}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(timestamp)}
        </p>
      </div>
    </div>
  );
};