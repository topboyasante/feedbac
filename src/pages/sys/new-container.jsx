import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be more than 5 characters",
  }),
});

function NewFeedbackContainer() {
  const { currentUserDetails, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    setError("");
    try {
      const containerData = {
        name: data.name,
        createdAt: serverTimestamp(),
        createdBy: {
          name: `${currentUserDetails.first_name}`,
          email: currentUserDetails.email,
          uid: currentUserDetails.uid,
        },
        status: "active",
      };
      const fcRef = collection(db, "feedback-containers");
      await addDoc(fcRef, containerData);
      reset("");
      navigate("/feedback");
    } catch (error) {
      setError("Failed to create the feedback container. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center">
        <Loader variant="secondary" />
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <h4 className="text-primary">Create Feedback Container</h4>
          <p className="text-neutral-500">
            Create a container to store feedback for a specific product or
            service.
          </p>
        </div>
        {error && (
          <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
            <p className="text-center">{error}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Container Name
          </label>
          <Input
            type="text"
            {...register("name")}
            disabled={isSubmittingForm}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          size={"sm"}
          disabled={isSubmittingForm}
        >
          {isSubmittingForm ? <Loader /> : <div>Submit</div>}
        </Button>
      </form>
    </div>
  );
}

export default NewFeedbackContainer;
