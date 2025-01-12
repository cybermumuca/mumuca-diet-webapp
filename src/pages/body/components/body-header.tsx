import { getProfile } from "@/api/get-profile";
import { ProfilePicture } from "@/components/profile-picture";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { BodyHeaderSkeleton } from "./body-header-skeleton";

export function BodyHeader() {
  const navigate = useNavigate();

  const { isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  function navigateToProfile() {
    navigate("/settings");
  }

  if (isProfileLoading) {
    return <BodyHeaderSkeleton />;
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-6">Corpo</h1>

      <ProfilePicture
        size="sm"
        classname="translate-y-[-10px]"
        onClick={navigateToProfile}
      />
    </div>
  );
}
