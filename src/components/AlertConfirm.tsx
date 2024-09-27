import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

type AlertDelete = {
  isOpen: boolean;
  title: string;
  text: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AlertConfirm({
  isOpen,
  title,
  text,
  onClose,
  onConfirm,
}: AlertDelete) {
  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      backdrop="opaque"
      placement="top"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}>
      <ModalContent className="border bg-red-50 border-red-500 text-red-500">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="font-medium">{text}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
