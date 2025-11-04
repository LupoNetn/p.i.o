import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../schemas/signUpSchema";
import { z } from "zod";
import api  from "../../lib/axios";
import { toast } from "sonner";

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // validates when user leaves input
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log("Form Data:", data);
      const res = await api.post('/auth/signup',data)
      toast.success("Account created successfully!")
      console.log(res)
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Signup failed. Try again!")
    }
  };

  const handleGoogleSignUp = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  return (
    <section className="mt-30 font-audio">
      <Card className="border-1 border-border max-w-xl mx-auto">
        <CardHeader>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Sign up – Let’s create magic!
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Input Your Name...."
                {...register("name")}
                className="border-b border-border w-full p-3 rounded-xl placeholder:text-xs hover:border-accent focus:border-accent"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Input Your Username (Stage Name)...."
                {...register("username")}
                className="border-b border-border w-full p-3 rounded-xl placeholder:text-xs hover:border-accent focus:border-accent"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Input Your Email...."
                {...register("email")}
                className="border-b border-border w-full p-3 rounded-xl placeholder:text-xs hover:border-accent focus:border-accent"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Input Your Password...."
                {...register("password")}
                className="border-b border-border w-full p-3 rounded-xl placeholder:text-xs hover:border-accent focus:border-accent"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="bg-accent p-5 w-full hover:opacity-80 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="flex items-center mt-5 w-full mx-auto gap-4 text-border">
            <hr className="flex-1" />
            <span className="text-gray-400">or</span>
            <hr className="flex-1" />
          </div>

          {/* Google Signup */}
          <div className="mt-5 w-full">
            <Button
              onClick={handleGoogleSignUp}
              type="button"
              className="border border-border w-full p-5 flex gap-2 justify-center items-center font-heading cursor-pointer hover:bg-accent transition"
            >
              <FcGoogle className="text-lg" />
              <span>Continue With Google</span>
            </Button>
          </div>

          {/* Login Redirect */}
          <div className="mt-5 text-xs text-gray-400 text-center mx-auto">
            <Link to="/auth/login" className="hover:text-accent transition">
              Already have an account? Log in!
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SignUp;
