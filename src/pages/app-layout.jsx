import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAVBAR_LINKS } from "@/constants/nav-links";
import { useAuth } from "@/context/auth-context.jsx";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/user";
import { signOut } from "firebase/auth";
import { Menu } from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function AppLayout() {
  const route = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center">
        <Loader variant="secondary" />
      </div>
    );
  }

  return (
    <>
      {!currentUser ? (
        <Navigate to={`/sign-in`} />
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-[220px] lg:w-[18rem] flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-y p-3 h-14">
                <img src={Logo} alt="logo" className="w-8 h-8" />
                <p>Feedbac</p>
              </div>
              <div className="px-3 flex flex-col gap-2">
                {NAVBAR_LINKS.map((link, index) => {
                  return (
                    <Link
                      to={`${link.href}`}
                      key={index}
                      className={cn(
                        "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm p-2",
                        {
                          "border-l-[5px] border-l-primary bg-neutral-100 p-2 rounded-r-md text-black":
                            route.pathname.startsWith(`${link.href}`),
                        }
                      )}
                    >
                      {link.icon}
                      {link.title}
                    </Link>
                  );
                })}
              </div>
            </nav>
            <nav className="mt-auto flex flex-col gap-4 px-5 sm:py-5">
              <Button onClick={() => signOut(auth)}>Sign Out</Button>
            </nav>
          </aside>
          <div className="flex flex-col sm:gap-4 sm:pl-[220px] lg:pl-[18rem]">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
              <div className="w-full justify-end items-center hidden sm:flex">
                <div className="flex gap-3 items-center">
                  <div className="border border-primary rounded-full p-2 text-sm">
                    {getInitials(currentUser.displayName)}
                  </div>
                  {currentUser.displayName}
                </div>
              </div>
              <div className="flex justify-between items-center w-full sm:hidden">
                SecureCourse
                <div className="flex gap-3 items-center">
                  <div className="flex gap-3 items-center">
                    <div className="border rounded-full p-2 text-sm">
                      {getInitials(currentUser.displayName)}
                    </div>
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <nav className="grid gap-6 text-lg font-medium">
                        <div className="w-[40px]">Feedbac</div>
                        {NAVBAR_LINKS.map((link, index) => {
                          return (
                            <SheetTrigger asChild key={index}>
                              <Link
                                to={`${link.href}`}
                                className={cn(
                                  "text-muted-foreground hover:text-foreground",
                                  {
                                    "text-foreground":
                                      route.pathname === `${link.href}`,
                                  }
                                )}
                              >
                                {link.title}
                              </Link>
                            </SheetTrigger>
                          );
                        })}
                      </nav>
                      <nav className="py-5">
                        <Button
                          onClick={() => signOut(auth)}
                          className="w-full"
                        >
                          Sign Out
                        </Button>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </header>
            <main className="px-6 py-3">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
