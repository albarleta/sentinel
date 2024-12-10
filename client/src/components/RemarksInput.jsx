import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RemarksInput({ val = "", onUpdate }) {
  const [remark, setRemark] = useState(val);

  const handleSave = () => {
    onUpdate(remark);
  };

  return (
    <div className="grid w-full gap-2">
      <Textarea
        placeholder="Type your remark here."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <Button variant="secondary" onClick={handleSave} className="px-4">
        Update remark
      </Button>
    </div>
  );
}
