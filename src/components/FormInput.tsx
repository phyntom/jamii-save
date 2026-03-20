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
import { Paperclip } from "lucide-react";

// ── shared ────────────────────────────────────────────────────────────────────

type Base<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
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

// ── file variant ──────────────────────────────────────────────────────────────

type FileVariant<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = Base<TFieldValues, TName> & {
  variant: "file";
  /** Passed to the native `accept` attribute, e.g. `"image/*"` or `".pdf,.docx"` */
  accept?: string;
  multiple?: boolean;
  inputClassName?: string;
};

// ── public union ──────────────────────────────────────────────────────────────

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> =
  | InputVariant<TFieldValues, TName>
  | TextareaVariant<TFieldValues, TName>
  | FileVariant<TFieldValues, TName>;

// ── file label helper ─────────────────────────────────────────────────────────

function FileLabel<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  multiple,
}: {
  control: Control<TFieldValues>;
  name: TName;
  multiple?: boolean;
}) {
  const value = useWatch({ control, name }) as FileList | File | null | undefined;

  if (!value) return <span>Choose file{multiple ? "s" : ""}…</span>;

  if (value instanceof FileList) {
    return (
      <span className="truncate">
        {value.length === 1 ? value[0].name : `${value.length} files selected`}
      </span>
    );
  }

  return <span className="truncate">{(value as File).name}</span>;
}

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
  const len = typeof value === "string" ? value.length : String(value ?? "").length;
  return (
    <div className="flex justify-end">
      <span className="text-xs text-muted-foreground">{len}/{maxLength}</span>
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

  if (props.variant === "file") {
    const { accept, multiple, inputClassName } = props;

    return (
      <FormField
        control={control}
        name={name}
        disabled={disabled}
        render={({ field: { onChange, onBlur, ref } }) => (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50",
                  inputClassName,
                )}
              >
                <Paperclip className="size-4 shrink-0" />
                <input
                  ref={ref}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  disabled={disabled}
                  onBlur={onBlur}
                  onChange={(e) =>
                    onChange(multiple ? e.target.files : e.target.files?.[0] ?? null)
                  }
                  className="sr-only"
                />
                <FileLabel control={control} name={name} multiple={multiple} />
              </label>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (props.variant === "textarea") {
    const { placeHolder, rows, maxLength, showCharCount, textareaClassName } = props;

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
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
