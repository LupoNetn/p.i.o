import { Link } from "react-router";
import { Button } from "./../ui/button";
import { Card, CardContent, CardHeader } from "./../ui/card";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";
import type { LoginFormData } from "../../schemas/loginSchema";
import useAuthStore from "../../stores/useAuthStore";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const login = useAuthStore((state: any) => state.login)

  const onSubmit = async (data: LoginFormData) => {
   login(data)
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  return (
    <section className="mt-30 font-audio">
      <Card className="border-1 border-border max-w-xl mx-auto">
        <CardHeader>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Log In – Let’s create magic!
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Enter your username..."
                {...register("username")}
                className="border-b border-border w-full p-3 rounded-xl placeholder:text-xs hover:border-accent focus:border-accent"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Enter your password..."
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
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="flex items-center mt-5 w-full mx-auto gap-4 text-border">
            <hr className="flex-1" />
            <span className="text-gray-400">or</span>
            <hr className="flex-1" />
          </div>

          {/* Google Login */}
          <div className="mt-5 w-full">
            <Button
              onClick={handleGoogleLogin}
              type="button"
              className="border border-border w-full p-5 flex gap-2 justify-center items-center font-heading cursor-pointer hover:bg-accent transition"
            >
              <FcGoogle className="text-lg" />
              <span>Continue with Google</span>
            </Button>
          </div>

          {/* Signup Redirect */}
          <div className="mt-5 text-xs text-gray-400 text-center mx-auto">
            <Link to="/auth" className="hover:text-accent transition">
              Don’t have an account? Sign up!
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
