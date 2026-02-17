import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import AppButton from "../../Shared/AppButton/AppButton";

const schema = zod
  .object({
    name: zod
      .string("Name Must Be Text")
      .regex(/[a-zA-Z][a-zA-Z ]{3,19}/, "Enter Valiad Name")
      .nonempty("Name is Required"),
      username: zod.string(),
    email: zod.email("Email not valid"),
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Valid Password",
      ),
    rePassword: zod.string(),
    dateOfBirth: zod.coerce
      .date()
      .refine(
        function (value) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          if (age > 18) {
            return true;
          }
          return false;
        },
        {
          error: "User Age Must Be Above 18 years old",
        },
      )
      .transform(function (value) {
        return value.toLocaleDateString("en-CA");
      }),
    gender: zod.enum(["male", "female"]),
  })
  .refine(
    function ({ password, rePassword }) {
      if (password == rePassword) {
        return true;
      }

      return false;
    },
    {
      error: "Password and Confirm Password Should Be Same",
      path: ["rePassword"],
    },
  );

export default function Register() {
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
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  // console.log(errors);
  // console.log(watch("password"));

  async function sendUserRegister(x) {
    setIsLoading(true);

    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}users/signup`, x),
      {
        loading: "Saving...",
        success: function (msgs) {
          myNavigate('/login')
          return <p className="text-green-600">{msgs.data.message}</p>;
        },
        error: function (msgs) {
          return <p className="text-red-600">{msgs.response.data.errors}</p>;
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
      onSubmit={handleSubmit(sendUserRegister)}
      className="w-full max-w-xl flex flex-col mx-auto mt-8 gap-4 bg-white p-6 border-2 border-gray-500 rounded-4xl shadow-2xl"
    >
      <h1 className="text-5xl font-semibold self-center mb-2">Register</h1>

      <Input
        classNames={{
          inputWrapper: "bg-green-200",
          label: errors.name ? "text-red-500!" : "text-green-600!",
        }}
        {...register("name")}
        // {...register("name", {
        //   required: { value: true, message: "Name is Required" },
        //   pattern: {
        //     value: /[a-zA-Z][a-zA-Z ]{3,20}/,
        //     message: "Please enter a valid username",
        //   },
        // })}
        // isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        label="Name"
        labelPlacement="outside"
        placeholder="Enter your name"
        type="text"
      />

      
      <Input
        classNames={{
          inputWrapper: "bg-green-200",
          label: errors.username ? "text-red-500!" : "text-green-600!",
        }}
        {...register("username")}
        // {...register("name", {
        //   required: { value: true, message: "Name is Required" },
        //   pattern: {
        //     value: /[a-zA-Z][a-zA-Z ]{3,20}/,
        //     message: "Please enter a valid username",
        //   },
        // })}
        // isRequired
        isInvalid={!!errors.username}
        errorMessage={errors.username?.message}
        label="User Name"
        labelPlacement="outside"
        placeholder="Enter your User Name"
        type="text"
      />

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

      

      <Input
        // isRequired
        label="Confirm Password"
        {...register("rePassword")}
        // {...register("rePassword", {
        //   validate: function(value) {
        //     if(value === watch("password")) {
        //       return true
        //     }

        //     return "Password and Repassword not same"
        //   }
        // })}
        labelPlacement="outside"
        autoComplete="new-password"
        classNames={{
          inputWrapper: "bg-green-200",
          label: "text-green-400!",
        }}
        isInvalid={!!errors.rePassword}
        errorMessage={errors.rePassword?.message}
        placeholder="Enter your Confirm Password"
        type="password"
      />

      <Input
        // isRequired
        label="Date Of Birth"
        {...register("dateOfBirth")}
        // {...register("dateOfBirth", {
        //     valueAsDate: true,
        //     validate: function(value) {
        //         const today = new Date()
        //         const birthDate = value;

        //         if(today.getFullYear() - birthDate.getFullYear() > 18) {
        //             return true;
        //         }

        //         return "User Age Must Be Above 18 Years Old"
        //     }
        // })}
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors.dateOfBirth?.message}
        labelPlacement="outside"
        autoComplete="new-password"
        classNames={{
          inputWrapper: "bg-green-200",
          label: "text-green-600!",
        }}
        placeholder="Enter your Confirm Password"
        type="date"
      />

      <Controller
        name="gender"
        control={control}
        render={function (x) {
          return (
            <Select
              className="max-w-xl"
              labelPlacement="outside"
              label="Gender"
              {...x.field}
              placeholder="Select Your Gender"
              classNames={{
                trigger: "bg-green-200",
                label: "text-green-400!",
              }}
              selectedKeys={[x.field.value]}
            >
              <SelectItem key={"male"}>male</SelectItem>
              <SelectItem key={"female"}>female</SelectItem>
            </Select>
          );
        }}
      />

      <p>Already Have Account? <Link to='/login' className="text-blue-500 hover:underline font-semibold">Login</Link></p>

      <div className="flex flex-col w-full  gap-5">
        <AppButton color="primary" type="submit" isLoading={isloading}>Submit</AppButton>
        <AppButton type="reset" color="danger" variant="flat">Reset</AppButton>
      
      </div>
    </Form>
  );
}
