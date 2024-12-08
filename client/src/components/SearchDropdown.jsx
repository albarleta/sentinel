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

export default function SearchDropdown({
  data = [],
  placeholder = "Select an item...",
  searchFields = [],
  onSubmit = () => {},
  mainParameter = "",
  subParameter = "",
  k = "",
  val = "",
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(val);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on search term across specified fields
  const filteredData = data.filter((item) =>
    searchFields.some((field) =>
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
            ? data.find((item) => item[mainParameter] === value)?.[
                mainParameter
              ]
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
            {filteredData.length === 0 ? (
              <CommandEmpty>No items found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredData.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={item[mainParameter]}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      onSubmit(item);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{item[mainParameter]}</span>
                      <span className="text-xs text-gray-500">
                        {item[subParameter]}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item[mainParameter]
                          ? "opacity-100"
                          : "opacity-0"
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
