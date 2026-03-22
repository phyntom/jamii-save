import {
  FormControl,
  FormDescription,
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
import type { Control, FieldValues, Path } from "react-hook-form";

export type SelectOption = {
  value: string;
  label: string;
};

export type FormSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export function FormSelect<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  placeholder,
  description,
  className,
  triggerClassName,
  disabled,
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
