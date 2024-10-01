"use client";

import SummaryForm from "@/components/summary/summary-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PiArrowLeft } from "react-icons/pi";

export default function Summary() {
  return (
    <div className="flex flex-col w-full max-w-sm space-y-4">
      <Button variant="ghost" className="flex-start w-fit px-2" asChild>
        <Link href="/">
          <PiArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </Button>
      <SummaryForm />
    </div>
  );
}
