import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { auth, db } from "@/lib/firebase";
import normalizeFirebaseErrorMessage from "@/utils/firebase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import Hero from "../../assets/hero.png";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First Name must be more than 2 characters",
  }),
  last_name: z.string().min(2, {
    message: "Last Name must be more than 2 characters",
  }),
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignUpForm() {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.first_name,
      });

      const usersRef = collection(db, "users");

      await addDoc(usersRef, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        uid: userCredential.user.uid,
      });

      navigate("/sign-in");
      toast.success("User signed up successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
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
            <h5 className="text-primary">Welcome to Feedbac!</h5>
            <p className="text-neutral-500">
              Enter your credentials to create an account
            </p>
          </div>
          {error && (
            <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
              <p className="text-center">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input type="text" {...register("first_name")} />
            {errors.first_name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input type="text" {...register("last_name")} />
            {errors.last_name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.last_name.message}
              </p>
            )}
          </div>
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
          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : "Sign Up"}
          </Button>
          <p className="text-sm text-neutral-600 mt-4">
            By signing up, you agree to the{" "}
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
            Already have an account?{" "}
            <span className="font-semibold text-primary">
              <Link to="/sign-in" className="hover:underline">
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
