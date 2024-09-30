import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PiArrowLeft, PiMagnifyingGlassBold } from "react-icons/pi";

export default function Summary() {
  return (
    <div className="flex flex-col w-full max-w-sm space-y-4">
      <Button variant="ghost" className="flex-start w-fit px-2" asChild>
        <Link href="/">
          <PiArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </Button>
      <div className="flex space-x-2">
        <Input type="text" placeholder="Course ID" />
        <Button type="submit">
          <PiMagnifyingGlassBold className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
