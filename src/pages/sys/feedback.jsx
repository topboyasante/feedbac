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
import { deleteDoc, doc } from "firebase/firestore";
import { EyeIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Feedback() {
  const { feedbackContainers, loading } = useFeedbackContainers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContainers = feedbackContainers.filter((container) =>
    container.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteContainer = async (id) => {
    try {
      const containerRef = doc(db, "feedback-containers", id);
      await deleteDoc(containerRef);

      toast.success("Container deleted successfully.");
    } catch (error) {
      toast.error("Error deleting container.");
      console.error("Error deleting container:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader variant="secondary" />
      </div>
    );
  }

  return (
    <>
      {!loading && (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h3>Feedback</h3>
              <p>View all your Feedback Containers here.</p>
            </div>
            <Link to={`/feedback/new-container`}>
              <Button size="sm">New Container</Button>
            </Link>
          </div>
          <br />
          <div>
            <Input
              type="text"
              placeholder="Search for a container"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-2 w-3/4"
            />
          </div>
          <br />
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="table-cell">ID</TableHead>
                  <TableHead className="table-cell">Name</TableHead>
                  <TableHead className="table-cell">Created At</TableHead>
                  <TableHead className="table-cell">Status</TableHead>
                  <TableHead className="table-cell">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContainers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell className="table-cell">{container.id}</TableCell>
                    <TableCell className="table-cell">
                      {container.name}
                    </TableCell>
                    <TableCell className="table-cell">
                      {convertTimestampToDate(container.createdAt)}
                    </TableCell>
                    <TableCell className="table-cell">
                      {container.status === "active" ? "Active" : "Disabled"}
                    </TableCell>
                    <TableCell className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link to={`/feedback/${container.id}`}>
                          <EyeIcon />
                        </Link>
                        <Button
                          onClick={() => handleDeleteContainer(container.id)}
                          variant="danger"
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedback;
