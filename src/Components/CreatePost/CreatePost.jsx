import { Card, CardBody, CardFooter, CardHeader, Divider, Form, Image, Input } from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";
import AppButton from "../../Shared/AppButton/AppButton";
import { DocumentUpload } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export default function CreatePost() {
    const imageUpload = useRef()
   const {userData} =  useContext(AuthUserContext);

   const [image, setImage] = useState(null);

   const {handleSubmit, register, reset} = useForm({
    defaultValues: {
        body: ""
    }
   })

   const [userImage, setUserImage] = useState(null)

   function handleImageUpload(e) {
    setImage(e.target.files[0])
    setUserImage(URL.createObjectURL(e.target.files[0]))
   }

  //  async function sendPost(data) {
  //   const myFormData = new FormData()
  //   myFormData.append("body", data.body)
  //   if(image) myFormData.append("image", image);

  //   toast.promise(
  //     axios.post(`${import.meta.env.VITE_BASE_URL}/posts`,myFormData, {
  //       headers: {
  //           token: localStorage.getItem('token')
  //       }
  //   }),
  //   {
  //     loading: "Post Creating....",
  //     success: function({data}) {
  //       reset()
  //       setUserImage(null)
  //       return data.message
  //     },
  //     error: function({response:{data:{error}}}) {
  //       console.log(error)
  //     }
  //   }
  //   )
  //  }

  function sendPost(data) {
      const myFormData = new FormData()
    myFormData.append("body", data.body)
    if(image) myFormData.append("image", image);

    return axios.post(`${import.meta.env.VITE_BASE_URL}/posts`,myFormData, {
        headers: {
            token: localStorage.getItem('token')
        }
    })
  }

  const {mutate, data, isError, error, isPending} = useMutation({
    mutationFn:sendPost,
    onSuccess: function({data}) {
      toast.success(data.message)
      reset()
       setUserImage(null)
    },
    onError: function({response}) {
      toast.error(response.data.error)
    }
  })

  console.log(data)

  return (
    <Card className="bg-gray-400/60">
      <CardHeader className="flex gap-3">
        <h2>Create Post {userData.name}</h2>
        
        <div className="flex flex-col">
          <p className="text-md font-semibold capitalize"></p>
          <p className="text-small text-default-500"></p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="text-center">
        
        <Form onSubmit={handleSubmit(mutate)}>
            <div className="flex w-full gap-5 items-center">
                <Image
          alt="heroui logo"
          className="bg-gray-400 rounded-full"
          height={40}
          radius="sm"
          src={userData.photo}
        // src = {photo}
          width={40}
        />
                <Input type="text" className="" {...register('body')} placeholder="What In YOur Mind"/>
            <DocumentUpload size="32"  onClick={function() {imageUpload.current.click()}} className="text-blue-500 cursor-pointer"/>
            </div>
            <img src={userImage} alt="" />
            <AppButton color="primary" isLoading={isPending} type="submit" className="w-full mt-5" variant="shadow">Post</AppButton>
        </Form>
        {/* <img src={image ? image : "https://heroui.com/images/hero-card-complete.jpeg"} alt={name} /> */}
      </CardBody>
      <Divider />
      <CardFooter className=" flex justify-between">
        </CardFooter>
        <input type="file" className="hidden" onChange={handleImageUpload} ref={imageUpload}/>
    </Card>
  )
}
