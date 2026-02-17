import { Form, Image, Input } from "@heroui/react";
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";
import AppButton from "../../Shared/AppButton/AppButton";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptos } from "../../Shared/axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { sayHello } from "../../../util";

export default function CreateComment({id}) {
  const { userData:{photo, name} } = useContext(AuthUserContext);

  const {handleSubmit, register, reset} = useForm({
    defaultValues: {
        content: ""
    }
  });

  const queryClient = useQueryClient()

  function sendUserComment(data) {
    console.log("send")
    const myForm = new FormData();
    myForm.append('content' ,data.content)
    return axiosInterceptos.post(`posts/${id}/comments`, myForm)
  }

  const {mutateAsync,data, isPending} = useMutation({
    mutationFn:sendUserComment,
    onSuccess: function() {
        reset()
        queryClient.invalidateQueries({queryKey: ['allPosts']})
    }
    
  })

  function hamada(data) {
    toast.promise(
        mutateAsync(data),
        {
            loading: "Comment Creating...",
            success: function(data) {
                return data.data.message
            }
        }
    )
  }

  return (
    <Form onSubmit={handleSubmit(hamada)} className="bg-gray-600 p-7 rounded-4xl">
      <div className="flex items-center gap-4 w-full">
        <Image
          alt="heroui logo"
          className="bg-gray-400 rounded-full"
          height={30}
          radius="sm"
          //   src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          src={photo}
          width={40}
        />

    <Input type="text" {...register("content")} placeholder={`Enter Your Comment: ${name}`}/>
      </div>
      <AppButton isloading={isPending} type="submit" color="primary" className="w-full mt-3" variant="shadow">Submit</AppButton>
    </Form>
  );
}
