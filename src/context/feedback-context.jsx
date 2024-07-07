import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
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
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribe;
    let isMounted = true; // Track if the component is mounted

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
            if (!isMounted) return; // Only update state if component is mounted
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
            if (!isMounted) return; // Only update state if component is mounted
            console.error("Error fetching feedback containers:", error);
            setFeedbackContainers([]);
            setLoading(false);
          }
        );
      } catch (error) {
        if (!isMounted) return; // Only update state if component is mounted
        console.error("Error fetching feedback containers:", error);
        setFeedbackContainers([]);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFeedbackContainers();
    }

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

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

  const fetchFeedbackByUserContainers = async () => {
    try {
      // Fetch all feedback related to the current user's containers
      const feedbacksCollectionRef = collection(db, "feedback");
      const feedbacksQuery = query(feedbacksCollectionRef);
      const feedbacksSnapshot = await getDocs(feedbacksQuery);

      // Get the IDs of all containers created by the current user
      const userContainerIds = feedbackContainers.map(
        (container) => container.id
      );

      // Filter feedback to include only those related to the current user's containers
      const userFeedback = feedbacksSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((feedback) => userContainerIds.includes(feedback.container));

      return userFeedback;
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchUserFeedback = async () => {
      if (feedbackContainers.length > 0) {
        try {
          const userFeedback = await fetchFeedbackByUserContainers();
          if (isMounted) {
            setFeedback(userFeedback); // Only update state if component is mounted
          }
        } catch (error) {
          console.error("Error fetching user feedback:", error);
        }
      }
    };

    fetchUserFeedback();

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, [feedbackContainers]);

  return (
    <FeedbackContainersContext.Provider
      value={{
        feedbackContainers,
        feedback,
        loading,
        fetchFeedbackContainerById,
        fetchFeedbackByUserContainers,
      }}
    >
      {children}
    </FeedbackContainersContext.Provider>
  );
};
