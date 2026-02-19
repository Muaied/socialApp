import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInterceptos } from "../../Shared/axiosInterceptors/axiosInterceptors";

export default function DeleteComment({ postId, commentId, onClose }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  async function deleteCommentFn() {
    const response = await axiosInterceptos.delete(
      `/posts/${postId}/comments/${commentId}`
    );
    return response.data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCommentFn,
    onSuccess: (data) => {
      toast.success(data.message || "Comment deleted successfully");
      queryClient.invalidateQueries(["comments", postId]);
      onOpenChange();
      if (onClose) onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to delete comment";
      toast.error(errorMessage);
    },
  });

  const handleDeleteClick = () => {
    onOpen();
  };

  return (
    <>
      <Button
        isIconOnly
        className="text-red-500 bg-transparent"
        onClick={handleDeleteClick}
        size="sm"
      >
        🗑️
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-red-500">
            Delete Comment
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">Are you sure you want to delete this comment?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => onOpenChange()}>
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isPending}
              onClick={() => mutate()}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
