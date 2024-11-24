import { type FC, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";

interface DialogButtonProps {
  tooltipTitle: string;
  submitButtonTitle: string;
  dialogInputPlaceholder: string;
  buttonContent: string;
  onSubmit: (value: string) => void;
}

export const DialogButton: FC<DialogButtonProps> = ({
  tooltipTitle,
  submitButtonTitle,
  dialogInputPlaceholder,
  buttonContent,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Dialog.Trigger className="toolbar-button">
              {buttonContent}
            </Dialog.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content>{tooltipTitle}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={dialogInputPlaceholder}
              className="dialog-input"
            />
            <div className="dialog-buttons">
              <Dialog.Close className="button secondary">Cancel</Dialog.Close>
              <button type="submit" className="button primary">
                {submitButtonTitle}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogButton;
