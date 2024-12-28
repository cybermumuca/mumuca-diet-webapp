import { getProfile } from "@/api/get-profile";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Skeleton } from "./ui/skeleton";

interface ProfilePictureProps {
  size?: "sm" | "md" | "lg";
}

export function ProfilePicture({ size = "md" }: ProfilePictureProps) {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (isProfileLoading) {
    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
  }

  if (!profile) {
    throw error;
  }

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage
        src={profile.photoUrl ?? undefined}
        alt={`${profile.firstName} ${profile.lastName}`}
      />
      <AvatarFallback>
        <span className="text-white text-xl font-bold">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
