import { useAuth } from "@/context/auth-context";
import Logo from "../assets/logo.png";
import Hero from "../assets/hero.png";
import Dashboard from "../assets/dashboard.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function RootPage() {
  const { currentUser } = useAuth();

  return (
    <section>
      <div class="absolute top-0 -z-10 h-full w-full bg-white">
        <div class="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(244,109,109,0.5)] opacity-50 blur-[80px]"></div>
      </div>
      <nav className=" border-y px-3 h-14">
        <div className="max-w-screen-lg mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="logo" className="w-8 h-8" />
            <p>Feedbac</p>
          </div>
          <div>
            {currentUser ? (
              <Button size="sm">Dashboard</Button>
            ) : (
              <div className="flex gap-3 items-center">
                <Link to={`/sign-in`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-8"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to={`/sign-up`}>
                  <Button size="sm" className="text-xs px-2 py-1 h-8">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="max-w-screen-lg mx-auto pt-20">
        <div className="flex flex-col justify-center items-center">
          <div className="text-center max-w-[80%]">
            <h1 className="text-primary">
              Collect Valuable Feedback with Ease
            </h1>
            <p className="text-neutral-500">
              Our intuitive feedback collection system helps you gather valuable
              insights from your customers, clients, or employees. Get real-time
              analytics and customizable forms to drive your business forward.
            </p>
            <br />
            <Link to={`/sign-up`}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          <div className="px-6 lg:px-0">
            <img src={Hero} alt="hero" />
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto py-10">
        <div>
          <h3 className="text-primary">
            Powerful Feedback Collection Made Easy
          </h3>
          <p className="text-neutral-500">
            Our feedback collection system provides a seamless experience for
            gathering insights from your customers, clients, or employees. With
            real-time analytics, easy-to-use forms, and intuitive reporting, you
            can make data-driven decisions to improve your business.
          </p>
          <br />
          <img src={Dashboard} alt="hero" />
        </div>
      </div>
      <footer className="max-w-screen-lg mx-auto py-3 border-y">
        <p className="text-center text-primary">2024. All Rights Reserved.</p>
      </footer>
    </section>
  );
}

export default RootPage;
