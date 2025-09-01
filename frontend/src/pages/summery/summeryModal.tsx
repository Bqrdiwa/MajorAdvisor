import { Modal, ModalBody, ModalContent } from "@heroui/react";
import Summery from "./summery";
import { useNavigate } from "react-router-dom";

export default function SummerModal({
  isOpen,
  onClose,
  onOpenChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}) {
  const nav = useNavigate();
  const handleClose = () => {
    onClose();
    nav("/");
  };
  return (
    <Modal
      hideCloseButton
      onOpenChange={onOpenChange}
      onClose={handleClose}
      isOpen={isOpen}
    >
      <ModalContent className="max-w-3xl w-fit">
        <ModalBody className="w-fit max-w-full p-0">
          <Summery />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
