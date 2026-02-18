import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Image,
} from "@heroui/react";
import { DocumentUpload } from "iconsax-reactjs";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePost } from "../../Shared/ApiServices/postsApi";
import AppButton from "../../Shared/AppButton/AppButton";

export default function EditPostModal({
  isOpen,
  onOpenChange,
  post,
}) {
  const imageUploadRef = useRef(null);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(post?.image || null);
  const queryClient = useQueryClient();

  const { handleSubmit, register, reset, watch } = useForm({
    defaultValues: {
      body: post?.body || "",
    },
  });

  const body = watch("body");

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      updatePost({
        id: post._id,
        body: data.body,
        image: image,
      }),
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      setImage(null);
      setPreviewImage(null);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleClose = () => {
    reset();
    setImage(null);
    setPreviewImage(post?.image || null);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Post
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(mutate)}>
                <div className="space-y-4">
                  <Textarea
                    {...register("body")}
                    label="Post Content"
                    placeholder="What's on your mind?"
                    minRows={3}
                  />

                  <div className="flex items-center gap-4">
                    {previewImage && (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-auto rounded-lg"
                      />
                    )}
                  </div>

                  <div
                    onClick={() => imageUploadRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50"
                  >
                    <DocumentUpload size="24" className="text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Click to upload or change image
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    ref={imageUploadRef}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={handleClose}>
                Cancel
              </Button>
              <AppButton
                color="primary"
                onPress={handleSubmit(mutate)}
                isLoading={isPending}
                disabled={isPending || !body}
              >
                Update Post
              </AppButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}