import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Search({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    onSearch(query);
    setQuery("");
  };

  return (
    <div className="flex w-[320px] items-center space-x-2">
      <Input
        type="text"
        placeholder="Search tracking number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="outline" type="submit" onClick={handleSubmit}>
        <FaSearch className="text-[#4971bb]" />
        Search
      </Button>
    </div>
  );
}
