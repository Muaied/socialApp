import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

const ChangePasswordSchema = z.object({
  password: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ChangePassword() {
  const router = useNavigate();
  const { setUserData, getUserData } = useContext(AuthUserContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data) => {
    const { password, newPassword } = data;
    
    try {
      const response = await toast.promise(
        axios.patch(
          `${import.meta.env.VITE_BASE_URL}users/change-password`,
          {
            password,
            newPassword,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        ),
        {
          loading: "Updating password...",
          success: (response) => {
            reset();
                        console.log(response);
            return response.data.message;
            
          },
          error: (error) => {
            return "old password is incorrect" ;
          },
        }
      );
      
      // Update token if provided in response
      if(response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      
      // Refresh user data with new token
      await getUserData();

      // Navigate to posts
      router("/posts");
    } catch (error) {
 return "Something went wrong. Please try again." ;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Change Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("password")}
              type="password"
              label="Old Password"
              placeholder="Enter your old password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              className="w-full"
            />
          </div>

          <div>
            <Input
              {...register("newPassword")}
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              className="w-full"
            />
          </div>

          <div>
            <Input
              {...register("confirmPassword")}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your new password"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
          >
            Update Password
          </Button>

          <Button
            type="button"
            variant="light"
            size="lg"
            className="w-full"
           
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
