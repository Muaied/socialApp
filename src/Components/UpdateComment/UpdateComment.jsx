import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInterceptos } from "../../Shared/axiosInterceptors/axiosInterceptors";
import { DocumentUpload } from "iconsax-reactjs";

export default function UpdateComment({ postId, commentId, currentContent, currentImage, onClose }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const imageUpload = useRef();
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const queryClient = useQueryClient();
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      content: currentContent,
    },
  });

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  async function updateCommentFn(data) {
    const formData = new FormData();
    formData.append("content", data.content);
    if (image) formData.append("image", image);

    const response = await axiosInterceptos.put(
      `/posts/${postId}/comments/${commentId}`,
      formData
    );
    return response.data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateCommentFn,
    onSuccess: (data) => {
      toast.success(data.message || "Comment updated successfully");
      queryClient.invalidateQueries(["comments", postId]);
      reset();
      setImage(null);
      setPreviewImage(currentImage);
      onOpenChange();
      if (onClose) onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to update comment";
      toast.error(errorMessage);
    },
  });

  const handleUpdateClick = () => {
    onOpen();
  };

  return (
    <>
      <Button
        isIconOnly
        className="text-blue-500 bg-transparent"
        onClick={handleUpdateClick}
        size="sm"
      >
        ✏️
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Comment</ModalHeader>
          <Divider />
          <ModalBody>
            <Form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
              <Input
                label="Comment Content"
                placeholder="Enter your comment..."
                {...register("content", { required: "Content is required" })}
                variant="bordered"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image (Optional)</label>
                <div
                  className="border-2 border-dashed border-blue-500 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50/10 transition"
                  onClick={() => imageUpload.current.click()}
                >
                  <DocumentUpload size="32" className="text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={imageUpload}
                  accept="image/*"
                />
              </div>

              {previewImage && (
                <div className="relative">
                  <img src={previewImage} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setImage(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </Form>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => onOpenChange()}>
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isPending}
              onClick={handleSubmit((data) => mutate(data))}
            >
              Update Comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
