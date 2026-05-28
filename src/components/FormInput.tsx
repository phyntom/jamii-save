import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { HTMLInputTypeAttribute } from "react";
import { useWatch } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

// ── shared ────────────────────────────────────────────────────────────────────

type Base<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  /** Applied to the outer `FormItem` wrapper */
  className?: string;
  disabled?: boolean;
};

// ── input variant ─────────────────────────────────────────────────────────────

type InputVariant<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = Base<TFieldValues, TName> & {
  variant?: "input";
  type?: HTMLInputTypeAttribute;
  placeHolder?: string;
  autoComplete?: string;
  inputClassName?: string;
};

// ── textarea variant ──────────────────────────────────────────────────────────

type TextareaVariant<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = Base<TFieldValues, TName> & {
  variant: "textarea";
  placeHolder?: string;
  rows?: number;
  maxLength?: number;
  /**
   * When `true` and `maxLength` is provided, renders a live `current / max`
   * counter below the field. Uses `useWatch` so no external state needed.
   */
  showCharCount?: boolean;
  textareaClassName?: string;
};

// ── public union ──────────────────────────────────────────────────────────────

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = InputVariant<TFieldValues, TName> | TextareaVariant<TFieldValues, TName>;

// ── char-count helper ─────────────────────────────────────────────────────────

function CharCount<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  maxLength,
}: {
  control: Control<TFieldValues>;
  name: TName;
  maxLength: number;
}) {
  const value = useWatch({ control, name });
  const len =
    typeof value === "string" ? value.length : String(value ?? "").length;
  return (
    <div className="flex justify-end">
      <span className="text-xs text-muted-foreground">
        {len}/{maxLength}
      </span>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

const textareaBase =
  "w-full min-h-20 px-3 py-2 text-sm border border-input rounded-md bg-background resize-y outline-none focus:ring-1 focus:ring-ring leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed";

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>(props: FormInputProps<TFieldValues, TName>) {
  const { control, name, label, description, className, disabled } = props;

  if (props.variant === "textarea") {
    const { placeHolder, rows, maxLength, showCharCount, textareaClassName } =
      props;

    return (
      <FormField
        control={control}
        name={name}
        disabled={disabled}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <textarea
                {...field}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeHolder}
                disabled={disabled}
                className={cn(textareaBase, textareaClassName)}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {showCharCount && maxLength != null && (
              <CharCount control={control} name={name} maxLength={maxLength} />
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // default: input
  const { type = "text", placeHolder, autoComplete, inputClassName } = props;

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeHolder}
              autoComplete={autoComplete}
              disabled={disabled}
              className={inputClassName}
              {...field}
              onChange={
                type === "number"
                  ? (e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : e.target.valueAsNumber,
                      )
                  : field.onChange
              }
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
