import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePicture({ user = {}, className, textSize }) {
  // Ensure user is defined and has a name property
  const userName = user?.name || "Unknown User"; // Fallback in case user name is undefined

  return (
    <Avatar className={className}>
      <AvatarImage src="" />
      <AvatarFallback className={`text-${textSize}`}>
        {`${userName.split(" ")[0][0]}${userName.split(" ")[1]?.[0] || ""}`}
      </AvatarFallback>
    </Avatar>
  );
}
