import { Button, Modal } from '@mantine/core';

interface ConfirmProps {
  title: string;
  message: string;
  opened: boolean;
  close: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

export default function Confirm(props: ConfirmProps) {
  const cancelLabel = props.cancelLabel ?? 'Cancel';
  const confirmLabel = props.confirmLabel ?? 'Confirm';

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      title={props.title}
      centered
    >
      <div className="my-2">{props.message}</div>
      <div className="flex flex-row gap-8">
        <Button onClick={props.close} fullWidth variant="light">
          {cancelLabel}
        </Button>
        <Button onClick={props.onConfirm} fullWidth>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
