import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  onClear,
  value,
  ...props
}: React.ComponentProps<"input"> & { onClear?: () => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={type}
        value={value}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      {onClear && String(value).length > 0 && (
        <button
          type="button"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => {
            onClear();
            inputRef.current?.focus();
          }}
          tabIndex={-1}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear input</span>
        </button>
      )}
    </div>
  );
}

export { Input };
