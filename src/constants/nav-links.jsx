import { LayoutDashboard, MessageCircleCode } from "lucide-react";

export const NAVBAR_LINKS = [
  {
    id: 0,
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: 1,
    title: "Feedback",
    href: "/feedback",
    icon: <MessageCircleCode />,
  },
];
