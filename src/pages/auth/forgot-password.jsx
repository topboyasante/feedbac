import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import normalizeFirebaseErrorMessage from "@/utils/firebase-errors";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
});

function ForgotPasswordForm() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, data.email);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      const friendlyMessage = normalizeFirebaseErrorMessage(error.code);
      setError(friendlyMessage);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-w-lg bg-white px-5 py-8 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-5">
            <h5 className="text-primary">Forgot Password</h5>
            <p className="text-neutral-500">
              Enter your email to receive a password reset link.
            </p>
          </div>
          {message && (
            <div className="mb-4 text-sm bg-green-200 px-4 py-2 rounded-md">
              <p className="text-center">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
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
          <Button
            type="submit"
            className="w-full"
            size={"sm"}
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : <div>Send Reset Link</div>}
          </Button>
          <p className="text-sm text-neutral-600 mt-4">
            Remembered your password?{" "}
            <span className="font-semibold text-primary">
              <Link to={`/sign-in`} className="hover:underline">
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
