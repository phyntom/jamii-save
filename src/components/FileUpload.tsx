import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface FileUploadProps {
  name: string;
  label?: string;
  accept?: string;
}

export function FileUpload({
  name,
  label,
  accept = "image/*",
}: FileUploadProps) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        const file: File | undefined = value;
        const previewUrl = file ? URL.createObjectURL(file) : undefined;

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div>
                <input
                  {...field}
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) onChange(selected);
                    // reset so re-selecting same file triggers onChange
                    e.target.value = "";
                  }}
                />

                {file ? (
                  // Preview
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onChange(undefined)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  // Drop zone
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dropped = e.dataTransfer.files?.[0];
                      if (dropped) onChange(dropped);
                    }}
                    className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border border-dashed border-border bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer text-muted-foreground"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs">Click or drag to upload</span>
                  </button>
                )}

                {/* Change button when file is selected */}
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-7 text-xs text-muted-foreground px-2"
                    onClick={() => inputRef.current?.click()}
                  >
                    Change
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
