import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFeedbackContainers } from "@/context/feedback-context";
import { db } from "@/lib/firebase";
import { convertTimestampToDate } from "@/utils/time";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Clipboard } from "lucide-react";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function FeedbackDetails() {
  const params = useParams();
  const containerId = params.id;
  const { fetchFeedbackContainerById } = useFeedbackContainers();
  const [container, setContainer] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchContainer = async () => {
      try {
        const containerData = await fetchFeedbackContainerById(containerId);
        setContainer(containerData);
        await fetchFeedbacks(containerId);
      } catch (error) {
        console.error("Error fetching container:", error);
        toast.error("Error fetching container.");
      } finally {
        setLoading(false);
      }
    };

    fetchContainer();
  }, [containerId, fetchFeedbackContainerById]);

  const fetchFeedbacks = async (containerId) => {
    try {
      const feedbacksCollectionRef = collection(db, "feedback");
      const q = query(
        feedbacksCollectionRef,
        where("container", "==", containerId)
      );
      const querySnapshot = await getDocs(q);
      const feedbackList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      feedbackList.sort((a, b) => b.createdAt - a.createdAt);
      setFeedbacks(feedbackList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Error fetching feedbacks.");
    }
  };

  const filteredFeedback = feedbacks.filter((container) =>
    container.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleContainerState = async () => {
    try {
      const containerRef = doc(db, "feedback-containers", containerId);
      await updateDoc(containerRef, {
        status: container.status === "active" ? "disabled" : "active",
      });
      toast.success(
        `Container ${
          container.status === "active" ? "disabled" : "activated"
        } successfully.`
      );
      setContainer((prevContainer) => ({
        ...prevContainer,
        status: prevContainer.status === "active" ? "disabled" : "active",
      }));
    } catch (error) {
      console.error("Error toggling container state:", error);
      toast.error("Failed to toggle container state. Please try again.");
    }
  };

  function handleCopy() {
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 3000);
  }

  if (loading || !container) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Loader variant="secondary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row  justify-between md:items-center gap-5">
        <h3>{container.name}</h3>
        <div className="flex gap-3 items-center">
          <CopyToClipboard
            text={`https://feedbac-teal.vercel.app/send-feedback/${containerId}`}
            onCopy={handleCopy}
          >
            <Button size="sm" className="gap-2">
              <Clipboard />
              {isCopied ? "Copied!" : " Feedback Link"}
            </Button>
          </CopyToClipboard>
          <Button
            onClick={handleToggleContainerState}
            size="sm"
            variant="outline"
          >
            {container.status === "active" ? "Disable" : "Activate"}
          </Button>
        </div>
      </div>
      <br />
      <div>
        <Input
          type="text"
          placeholder="Search feedback by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2 w-full md:w-3/4 "
        />
      </div>
      <br />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="table-cell text-nowrap">ID</TableHead>
              <TableHead className="table-cell text-nowrap">Name</TableHead>
              <TableHead className="table-cell text-nowrap">Feedback</TableHead>
              <TableHead className="table-cell text-nowrap">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="table-cell text-nowrap">{feedback.id}</TableCell>
                <TableCell className="table-cell text-nowrap">{feedback.name}</TableCell>
                <TableCell className="table-cell text-nowrap">
                  {feedback.feedback}
                </TableCell>
                <TableCell className="table-cell text-nowrap">
                  {convertTimestampToDate(feedback.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default FeedbackDetails;
