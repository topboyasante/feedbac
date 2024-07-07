import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { auth } from "@/lib/firebase";
import normalizeFirebaseErrorMessage from "@/utils/firebase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Hero from "../../assets/hero.png";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignInForm() {
  const navigate = useNavigate();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      const friendlyMessage = normalizeFirebaseErrorMessage(error.code);
      setError(friendlyMessage);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-between items-center">
      <div className="hidden md:block w-full md:w-1/2 min-h-screen bg-primary p-8 text-white">
        <h3>Feedbac</h3>
        <p>The ultimate app for gathering user feedback.</p>
        <div>
          <img src={Hero} alt="hero" />
        </div>
      </div>
      <div className="w-full md:w-1/2 px-5 py-8 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-5">
            <h5 className="text-primary">Sign In</h5>
            <p className="text-neutral-500">
              Enter your credentials to use Feedbac
            </p>
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-500 px-4 py-2">
              <p className="text-center">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <p className="w-fit mt-5 text-sm text-neutral-600 hover:text-red-500 hover:underline hover:underline-offset-4 hover:text-foreground ease duration-150">
            <Link to={`/forgot-password`}>Forgot Password?</Link>
          </p>
          <br />
          <Button
            type="submit"
            className="w-full"
            size={"sm"}
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : <div>Sign In</div>}
          </Button>
          <p className="text-sm text-neutral-600 mt-4">
            By signing in, you agree to the{" "}
            <span className="text-primary hover:underline font-semibold ease duration-150 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary hover:underline font-semibold ease duration-150 cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-primary">
              <Link to={`/sign-up`} className="hover:underline">
                Sign Up
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
