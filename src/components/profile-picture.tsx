import { getProfile } from "@/api/get-profile";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type ProfilePictureProps = ComponentProps<typeof Avatar> & {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  classname?: string;
};

export function ProfilePicture({
  size = "md",
  classname,
  ...props
}: ProfilePictureProps) {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
    "2xl": "h-48 w-48",
    "3xl": "h-64 w-64",
    "4xl": "h-80 w-80",
  };

  if (isProfileLoading) {
    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
  }

  if (!profile) {
    throw error;
  }

  return (
    <Avatar className={cn(sizeClasses[size], classname)} {...props}>
      <AvatarImage
        src={
          profile.photoUrl ??
          `https://avatar.vercel.sh/satori.svg?text=${profile.firstName[0]}${profile.lastName[0]}`
        }
        alt={`${profile.firstName} ${profile.lastName}`}
      />
      <AvatarFallback>
        <span className="text-muted-foreground text-sm translate-y-[-1px]">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
