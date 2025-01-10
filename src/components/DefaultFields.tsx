import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Receipt } from "@/types/receipt";
import { CompanySelect } from "./ReceiptForm/CompanySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DefaultFieldsProps } from "./ReceiptForm/FieldTypes";

export const DefaultFields = ({
  fields,
  values,
  removedFields,
  onInputChange,
  onRemoveField,
}: DefaultFieldsProps) => {
  return (
    <>
      {fields.map(
        ({ key, label }) =>
          !removedFields.includes(key) && (
            <div key={key} className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={key} className="text-foreground">
                  {label}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveField(key)}
                  className="hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {key === "companyName" ? (
                <CompanySelect
                  value={values[key]}
                  onChange={(value) => onInputChange(key, value)}
                />
              ) : key === "washType" && !removedFields.includes("washType") ? (
                <Select
                  value={values[key]}
                  onValueChange={(value) => onInputChange(key, value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select wash type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Side Tipper">Side Tipper</SelectItem>
                    <SelectItem value="Full Wash">Full Wash</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={key}
                  value={values[key as keyof Receipt] as string || ""}
                  onChange={(e) => onInputChange(key, e.target.value)}
                  className="bg-background"
                />
              )}
            </div>
          )
      )}
    </>
  );
};