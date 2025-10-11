import React from "react";
import { Calendar } from "@/components/ui/calendar";
import "react-day-picker/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fi } from "date-fns/locale";

interface DateControllerProps {
  name: string;
  label: string;
  control?: any;
  disabled?: boolean;
  rules?: any;
  dateFormat?: string;
  allowFutureDates?: boolean;
}

const DateController: React.FC<DateControllerProps> = ({
  name,
  label,
  control,
  disabled = false,
  rules,
  dateFormat = "yyyy-MM-dd",
  allowFutureDates = true,
}) => {
  const today = new Date();
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      rules={rules}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              {label}
              {rules?.required && <span className="text-destructive"> *</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 px-3 py-1 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), dateFormat) // format only for UI
                    ) : (
                      <span>{label}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  disabled={allowFutureDates ? undefined : (date) => date > today}
                  fromDate={allowFutureDates ? undefined : new Date(1900, 0, 1)}
                  toDate={allowFutureDates ? new Date(2100, 11, 31) : today}
                  fromYear={allowFutureDates ? 1900 : 1900}
                  toYear={allowFutureDates ? 2100 : new Date().getFullYear()}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DateController;
