import { Link, useLocation } from "react-router";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
}

export function NavItem({ to, icon }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="sr-only">{to.slice(1) || "Home"}</span>
    </Link>
  );
}
