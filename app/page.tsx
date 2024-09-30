import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-4">
      <Button asChild>
        <Link href={"/attendance"}>Attendance</Link>
      </Button>
      <Button variant="secondary" asChild>
        <Link href={"/summary"}>Summary</Link>
      </Button>
    </div>
  );
}
