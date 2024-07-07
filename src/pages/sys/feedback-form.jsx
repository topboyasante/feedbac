import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useFeedbackContainers } from "@/context/feedback-context";
import { db } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import Logo from "../../assets/logo.png";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be more than 2 characters.",
  }),
  feedback: z.string().min(2, {
    message: "Feedback must be more than 2 characters",
  }),
});

function FeedbackForm() {
  const params = useParams();
  const containerId = params.id;
  const { fetchFeedbackContainerById } = useFeedbackContainers();
  const [container, setContainer] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        const containerData = await fetchFeedbackContainerById(containerId);
        setContainer(containerData);
        if (!containerData || containerData.status !== "active") {
          toast.error("The feedback container is not active.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching container:", error);
        toast.error("Error fetching container.");
        navigate("/");
      }
    };

    fetchContainer();
  }, [containerId, fetchFeedbackContainerById, navigate]);

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    try {
      const feedbackData = {
        name: data.name,
        feedback: data.feedback,
        container: containerId,
        createdAt: serverTimestamp(),
      };

      const feedbacksCollectionRef = collection(db, "feedback");
      await addDoc(feedbacksCollectionRef, feedbackData);

      toast.success("Feedback created successfully!");
      navigate("/");
      reset();
    } catch (error) {
      console.error("Error adding feedback:", error);
      toast.error("Failed to add feedback. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (!container) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center">
        <Loader variant="secondary" />
      </div>
    );
  }

  return (
    <div>
      <div class="absolute top-0 -z-10 h-full w-full bg-white">
        <div class="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(244,109,109,0.5)] opacity-50 blur-[80px]"></div>
      </div>
      <nav className=" border-y px-6 py-3 h-14">
        <div className="max-w-2xl mx-auto flex">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="logo" className="w-8 h-8" />
            <p>{container.name}</p>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-5">
            <h4 className="text-primary">{container.name}</h4>
            <p className="text-neutral-500">
              Send a feedback to {container.createdBy.name} for {container.name}
              .
            </p>
          </div>
          {error && (
            <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
              <p className="text-center">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Your Name
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Feedback
            </label>
            <Textarea
              {...register("feedback")}
              disabled={isSubmittingForm}
              rows={10}
              className="resize-none"
            />
            {errors.feedback && (
              <p className="mt-2 text-sm text-red-600">
                {errors.feedback.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
