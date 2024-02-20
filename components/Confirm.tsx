import { Button, Modal } from '@mantine/core';

export default function Confirm({
  title,
  message,
  opened,
  close,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
}: {
  title: string;
  message: string;
  opened: boolean;
  close: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  return (
    <Modal opened={opened} onClose={close} title={title} centered>
      <div className="my-2">{message}</div>
      <div className="flex flex-row gap-8">
        <Button onClick={close} fullWidth color="gray" c="blue">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} fullWidth>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
