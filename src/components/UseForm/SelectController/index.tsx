import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface IndexProps {
  name: string;
  label: string;
  options: { value: string; label: string }[] | [];
  control: any;
  disabled?: boolean;
  rules?: any;
  onChange?: (value: string) => void;
  defaultValue?: string;
  onBlur?: () => void;
  isLoading?: boolean;
}

const Index: React.FC<IndexProps> = ({
  name,
  label,
  options = [],
  control,
  disabled = false,
  rules,
  defaultValue = "",
  onChange,
  onBlur,
  isLoading = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => {
        const isRequired = rules?.required;
        return (
          <FormItem>
            <FormLabel>
              {label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) {
                  onChange(value);
                }
              }}
              defaultValue={field.value}
              disabled={disabled}
              value={field.value || ""}
              onOpenChange={() => {
                if (onBlur) {
                  onBlur();
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>
                    No options available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default Index;
