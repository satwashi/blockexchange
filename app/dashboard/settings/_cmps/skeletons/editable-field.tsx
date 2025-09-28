import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "number";
  className?: string;
}

const EditableField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  className,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTempValue(String(value));
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(tempValue);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTempValue(String(value));
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      {isEditing ? (
        <Input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className={cn(
            "transition-all duration-200 ring-2 ring-editing",
            error && "border-destructive ring-destructive"
          )}
        />
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            "min-h-10 px-3 py-2 border rounded-md cursor-pointer",
            "transition-all duration-200 hover:border-editing hover:bg-editing-light/20",
            "flex items-center font-mono text-sm",
            error && "border-destructive"
          )}
        >
          {value}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default EditableField;
