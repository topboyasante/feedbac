import AppLayout from "@/pages/app-layout";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import VerifyCodePage from "@/pages/auth/verify-code";
import NotFound from "@/pages/not-found";
import RootPage from "@/pages/root";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/sys/dashboard";
import Feedback from "../pages/sys/feedback";
import NewFeedbackContainer from "@/pages/sys/new-container";
import FeedbackForm from "@/pages/sys/feedback-form";
import FeedbackDetails from "@/pages/sys/feedback-details";

//  This file is where you create all the routes to your project
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/verify-code",
    element: <VerifyCodePage />,
    errorElement: <NotFound />,
  },
  {
    path: "send-feedback/:id",
    element: <FeedbackForm />,
    errorElement: <NotFound />,
  },
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <NotFound />,
      },
      {
        path: "feedback",
        element: <Feedback />,
        errorElement: <NotFound />,
      },
      {
        path: "feedback/:id",
        element: <FeedbackDetails />,
        errorElement: <NotFound />,
      },
      {
        path: "feedback/new-container",
        element: <NewFeedbackContainer />,
        errorElement: <NotFound />,
      },
    ],
  },
]);

export default router;
