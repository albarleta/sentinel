import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ReviewerDropdown({
  data = [],
  placeholder = "Select an item...",
  onSubmit = () => {},
  reviewerId = null,
}) {
  let reviewerEmail;
  if (reviewerId)
    reviewerEmail = data.filter((reviewer) => reviewer._id === reviewerId)[0]
      .email;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(reviewerEmail || null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="col-span-3 justify-between"
        >
          {/* Show selected value or placeholder */}
          {value
            ? data.find((item) => item.email === value)
              ? `${data.find((item) => item.email === value).name} <${
                  data.find((item) => item.email === value).email
                }>`
              : placeholder
            : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {data.length === 0 ? (
              <CommandEmpty>No items found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item._id}
                    value={item.email}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      onSubmit(item);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500">
                        {item.email}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.email ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
