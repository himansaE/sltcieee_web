import { cn } from "@/lib/utils";
import { Input, type InputProps } from "../ui/input";
import { Textarea, type TextareaProps } from "../ui/textarea";
import { Label } from "../ui/label";

export interface Props {
  id: string;
  name?: string;
  value?: string;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
  instructionMessage?: string;
  containerClassName?: string;
  inputProps?: InputProps;
  textAreaProps?: TextareaProps;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const TextInput: React.FC<Props> = ({
  id,
  name,
  label,
  value,
  onBlur,
  onChange,
  inputProps,
  placeholder,
  errorMessage,
  defaultValue,
  textAreaProps,
  multiline = false,
  instructionMessage,
  containerClassName,
  disabled,
}) => {
  const textInputClassName = cn("bg-white", {
    "focus-visible:ring-0 border-status-red border focus:border-status-red":
      errorMessage,
  });
  const messageClassName = cn("text-xs text-dark-300 font-secondary");

  const commonProps = {
    id,
    value,
    onChange,
    onBlur,
    placeholder,
    defaultValue,
    name: name || id,
  };
  const textAreaMergedProps: TextareaProps = {
    ...textAreaProps,
    ...commonProps,
    className: cn(textInputClassName, textAreaProps?.className),
  };
  const inputMergedProps: InputProps = {
    ...inputProps,
    ...commonProps,
    className: cn(textInputClassName, inputProps?.className),
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 font-secondary",
        containerClassName
      )}
    >
      {label && (
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
      )}
      {multiline ? (
        <Textarea {...textAreaMergedProps} disabled={disabled} />
      ) : (
        <Input {...inputMergedProps} disabled={disabled} />
      )}
      {errorMessage && (
        <p className={cn(messageClassName, "text-red-600")}>{errorMessage}</p>
      )}
      {!errorMessage?.trim() && instructionMessage && (
        <p className={cn(messageClassName)}>{instructionMessage}</p>
      )}
    </div>
  );
};
