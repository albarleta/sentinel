//libararies
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router";
import socket from "../utils/socket.js";
import { GoDotFill } from "react-icons/go";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

//context(zustand)
import useAuthStore from "../store/useAuthStore.js";

//utils
import { logout } from "../utils/apiAuth.js";

//components
import Profile from "./Profile.jsx";
import ProfilePicture from "./ProfilePicture.jsx";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setNotifications, notifications, setIsLoading } =
    useAuthStore();

  const fetchNotifications = async () => {
    const res = await fetch(
      `http://localhost:5000/api/v1/notifications/${user._id}`
    );

    const { data } = await res.json();
    setNotifications(data);
  };

  const handleLogout = () => {
    setIsLoading(true);

    // Call the logout function directly
    logout()
      .then((response) => {
        toast({
          title: "Logout Successful",
          description:
            response.message || "You have been logged out successfully.",
          className: "bg-[#82F4E5] text-gray-700",
          duration: 1000,
        });

        // Redirect to login page after successful logout
        setTimeout(() => {
          navigate("/app/login");
        }, 1000);
      })
      .catch((error) => {
        toast({
          title: "Failed to Logout",
          description: error.message || "Unable to log out. Please try again.",
          variant: "destructive",
        });
        console.error("Logout error:", error.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/notifications/${id}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("error marking notification as read", error);
    } finally {
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    socket.emit("joinRoom", user._id);
    socket.on("newNotification", (notification) => {
      setNotifications(notification);
    });
    return () => {
      socket.off("newNotification");
    };
  }, []);

  if (!user) return null;

  return (
    <Disclosure
      as="nav"
      className="bg-[#4971bb] fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/">
              <div className="flex items-center">
                {/* <img alt="Sentinel" src="/logo-sm.png" className="h-8 w-auto" /> */}
                <img src="/sentinel-text-sm.png" className="w-[140px]" />
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:block">
              {/* <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div> */}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <BellIcon aria-hidden="true" className="size-6" />

                {notifications && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] inline-flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
            </button> */}
            <Menu as="div" className="relative ml-3 ">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <div
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <div className="relative">
                      <BellIcon aria-hidden="true" className="size-6" />

                      {notifications &&
                        notifications.filter(
                          (notification) => !notification.isRead
                        ).length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] inline-flex items-center justify-center">
                            {
                              notifications.filter(
                                (notification) => !notification.isRead
                              ).length
                            }
                          </span>
                        )}
                    </div>
                  </div>
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-screen max-w-md origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification._id}
                      className="px-2 w-full p-4"
                    >
                      <div className="flex items-start w-full space-x-3">
                        {!notification.isRead && (
                          <div className="flex-shrink-0 pt-1">
                            <GoDotFill className="text-red-500" />
                          </div>
                        )}
                        <div className="flex-grow min-w-0">
                          <p className="text-sm text-gray-700 break-words whitespace-normal">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="flex-shrink-0 text-sm text-gray-700 whitespace-nowrap"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <p className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                      0 Notifications
                    </p>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>

                  <ProfilePicture user={user} />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Dialog>
                    <DialogTrigger className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                      Profile
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Profile
                        </DialogTitle>

                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <Profile user={user} />
                    </DialogContent>
                  </Dialog>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none cursor-pointer"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
