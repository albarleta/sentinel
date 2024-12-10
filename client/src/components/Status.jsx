import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const statuses = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Rejected",
    label: "Rejected",
  },
  {
    value: "Approved",
    label: "Approved",
  },
];

export default function Status({
  status,
  onStatusChange,
  className,
  onUpdate,
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedStatus, setSelectedStatus] = React.useState(status);

  const handleStatusSelect = (newStatus) => {
    const foundStatus = statuses.find((s) => s.value === newStatus);
    setSelectedStatus(foundStatus.label);
    setOpen(false);

    // Use onUpdate instead of onStatusChange
    if (onUpdate) {
      onUpdate(foundStatus.label); // This will invoke the onUpdate passed from parent
    }
  };

  React.useEffect(() => {
    setSelectedStatus(status);
  }, []);

  const statusStyles = {
    Pending: "border-yellow-500 text-yellow-500 hover:bg-yellow-500",
    Rejected: "border-red-500 text-red-500 hover:bg-red-500",
    Approved: "border-green-500 text-green-500 hover:bg-green-500",
  };

  const buttonClassName = `w-[90px] justify-start hover:text-white ${
    statusStyles[selectedStatus] || ""
  } ${className || ""}`;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${buttonClassName} flex justify-center items-center`}
          >
            {selectedStatus || "+ Set status"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} onSelect={handleStatusSelect} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={buttonClassName}>
          {selectedStatus || "+ Set status"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} onSelect={handleStatusSelect} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({ onSelect }) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={() => onSelect(status.value)}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function useMediaQuery(query) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
