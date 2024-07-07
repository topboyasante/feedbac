import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

const FeedbackContainersContext = createContext();

export const useFeedbackContainers = () =>
  useContext(FeedbackContainersContext);

export const FeedbackContainersProvider = ({ children }) => {
  const [feedbackContainers, setFeedbackContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribe;

    const fetchFeedbackContainers = async () => {
      try {
        const feedbackContainersCollectionRef = collection(
          db,
          "feedback-containers"
        );
        const feedbackContainersQuery = query(
          feedbackContainersCollectionRef,
          where("createdBy.uid", "==", currentUser.uid)
        );

        unsubscribe = onSnapshot(
          feedbackContainersQuery,
          (querySnapshot) => {
            const containers = [];
            querySnapshot.forEach((doc) => {
              containers.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            setFeedbackContainers(containers);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching feedback containers:", error);
            setFeedbackContainers([]);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error fetching feedback containers:", error);
        setFeedbackContainers([]);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFeedbackContainers();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const fetchFeedbackContainerById = async (containerId) => {
    try {
      const containerRef = doc(db, "feedback-containers", containerId);
      const docSnap = await getDoc(containerRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.log("No such document exists!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching feedback container:", error);
      throw error;
    }
  };

  return (
    <FeedbackContainersContext.Provider
      value={{ feedbackContainers, loading, fetchFeedbackContainerById }}
    >
      {children}
    </FeedbackContainersContext.Provider>
  );
};
