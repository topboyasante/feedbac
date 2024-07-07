import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen pt-5">
      <div className="max-w-lg mx-auto h-full flex flex-col justify-center gap-2">
        <div className="w-full">
          <img src={Logo} alt="logo" className="w-8 h-8" />
          <h5>Page not found</h5>
          <p>
            We couldn&apos;t find what you&apos;re looking for. The page might
            have been removed, had its name changed, or is temporarily
            unavailable.
          </p>
          <br />
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
