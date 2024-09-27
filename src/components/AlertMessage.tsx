import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

type AlertMessage = {
  isOpen: boolean;
  title: string;
  text: string;
  onAction: () => void;
};

export default function AlertMessage({
  isOpen,
  title,
  text,
  onAction,
}: AlertMessage) {
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
      <ModalContent className="border bg-green-50 border-green-500 text-green-500">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="font-medium">{text}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onPress={onAction}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
