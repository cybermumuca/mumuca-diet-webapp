import { NavLink, useLocation } from "react-router";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export function NavItem({ to, icon, isActive }: NavItemProps) {
  const location = useLocation();
  const active = isActive !== undefined ? isActive : location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="sr-only">{to.slice(1) || "Home"}</span>
    </NavLink>
  );
}
