import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePost } from "../../Shared/ApiServices/postsApi";

export default function DeleteConfirmationModal({
  isOpen,
  onOpenChange,
  postId,
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to delete post");
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Post
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this post?</p>
              <p className="text-small text-default-500">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => mutate()}
                isLoading={isPending}
                disabled={isPending}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}