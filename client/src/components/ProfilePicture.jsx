import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePicture({ user, className, textSize }) {
  return (
    <Avatar className={className}>
      <AvatarImage src="" />
      <AvatarFallback className={`text-${textSize}`}>
        {`${user.name.split(" ")[0][0]}${user.name.split(" ")[1]?.[0] || ""}`}
      </AvatarFallback>
    </Avatar>
  );
}
