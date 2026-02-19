import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

const schema = zod
  .object({

    email: zod.email("Email not valid"),
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Valid Password",
      ),
    
  })
 ;

export default function Login() {
  const {setUserData} = useContext(AuthUserContext)
  const myNavigate = useNavigate()
  const [isloading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    control,
  } = useForm({
    defaultValues: {
     
      email: "",
      password: "",
      
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  // console.log(errors);
  // console.log(watch("password"));

  async function sendUserLogin(x) {
    setIsLoading(true);

    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}users/signin`, x),
      {
        loading: "Sigin...",
        success: function (x) {

          localStorage.setItem('token', x.data.data.token);
          setUserData(x.data.data.user)
          
          myNavigate('/')
          
          return <p className="text-green-600">{x.data.message}</p>;
        },
        error: function (msgs) {
          // console.log(msgs.response)
          return <p className="text-red-600 capitalize">{msgs.response.data.message}</p>;
        },
      },
    );
    // try {
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_BASE_URL}/users/signup`,
    //     x,
    //   );
    //   console.log(response);

    // } catch (error) {
    //   console.log(error.response);

    // }
    setIsLoading(false);
  }

  return (
    <Form
      onSubmit={handleSubmit(sendUserLogin)}
      className="w-full max-w-xl flex flex-col mx-auto mt-8 gap-4 bg-white p-6 border-2 border-gray-500 rounded-4xl shadow-2xl"
    >
      <h1 className="text-5xl font-semibold self-center mb-2">Login</h1>

     

      <Input
        // isRequired

        label="Email"
        labelPlacement="outside"
        {...register("email")}
        // {...register("email", {
        //     required: {value: true, message: "Email Is Required"},
        //     pattern: {value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , message: "Please enter a valid email"}
        // })}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        classNames={{
          inputWrapper: "bg-green-200",
          label: errors.email ? "text-red-500!" : "text-green-600!",
        }}
        placeholder="Enter your email"
        type="email"
      />

      <Input
        // isRequired
        label="Password"
        {...register("password")}
        // {...register("password", {
        //     required: {value: true, message: "Email Is Required"},
        //     pattern: {value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ , message: "Please enter a valid Password"}
        // })}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        classNames={{
          inputWrapper: "bg-green-200",
          label: errors.password ? "text-red-500!" : "text-green-600!",
        }}
        labelPlacement="outside"
        autoComplete="new-password"
        placeholder="Enter your Password"
        type="password"
      />

          <p>I Have Not Account? <Link to='/Register' className="text-blue-500 hover:underline font-semibold">Register</Link></p>

      <div className="flex flex-col w-full  gap-5">
        <Button color="primary" type="submit" isLoading={isloading}>
          Submit
        </Button>
        <Button type="reset" color="danger" variant="flat">
          Reset
        </Button>
      </div>

      
    </Form>
  );
}
