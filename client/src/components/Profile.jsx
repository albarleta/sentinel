import { Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProfilePicture from "./ProfilePicture";

export default function Profile({ user }) {
  return (
    <div className="p-8 text-center">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-200 object-cover">
          <ProfilePicture
            user={user}
            className="h-full w-full"
            textSize="4xl"
          />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
      <p className="text-sm text-indigo-600 font-semibold mt-1">{user.role}</p>
      <div className="mt-4 flex items-center justify-center text-gray-600">
        <Mail className="h-5 w-5 mr-2" />
        <a
          href={user.email}
          className="text-sm hover:text-indigo-600 transition-colors"
        >
          {user.email}
        </a>
      </div>
      {/* <div className="mt-6">
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div> */}
    </div>
  );
}
