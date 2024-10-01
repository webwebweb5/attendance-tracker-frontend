import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex flex-col w-full max-w-md">
      <div className="flex flex-col gap-10">
        <div className="flex items-center lg:gap-10 gap-4">
          <FaPersonWalkingArrowRight className="sm:w-24 sm:h-24 w-20 h-20" />
          <h1 className=" font-black text-4xl">Attendance Tracker</h1>
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            Record Attendance In Every Course
          </h1>
          <p className="mt-5 text-gray-500">
            A student attendance tracking app using GPS to record in/out times
            and generate monthly/semester reports with export to Excel.
          </p>
        </div>

        <div className="flex gap-x-2 w-full">
          <Button asChild className="w-full">
            <Link href={"/attendance"}>Attendance</Link>
          </Button>
          <Button variant="secondary" asChild className="w-full">
            <Link href={"/summary"}>Summary</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
