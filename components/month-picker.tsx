import * as React from "react";
import { format, add, eachMonthOfInterval, endOfYear, isEqual, parse, isFuture } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

interface MonthPickerPopoverProps {
  selectedMonth: Date;
  setSelectedMonth: (newMonth: Date) => void;
}

export default function MonthPickerPopover({ selectedMonth, setSelectedMonth }: MonthPickerPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="month-picker"
          variant={"outline"}
          className={cn("w-fit justify-start text-left font-normal")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedMonth ? format(selectedMonth, "MMM yyyy") : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <MonthPicker currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </PopoverContent>
    </Popover>
  );
}

function MonthPicker({ currentMonth, onMonthChange }: { currentMonth: Date; onMonthChange: (newMonth: Date) => void }) {
  const [currentYear, setCurrentYear] = React.useState(format(currentMonth, "yyyy"));
  const firstDayCurrentYear = parse(currentYear, "yyyy", new Date());

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  });

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button
          aria-label="Previous Year"
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
          onClick={previousYear}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">{currentYear}</div>
        <button
          aria-label="Next Year"
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
          onClick={nextYear}
          disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((month) => (
          <button
            key={month.toString()}
            className={cn(
              "inline-flex h-9 w-full items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300 ease-in-out",
              isEqual(month, currentMonth)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:text-black",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            )}
            onClick={() => onMonthChange(month)}
          >
            <time dateTime={format(month, "yyyy-MM-dd")}>{format(month, "MMM")}</time>
          </button>
        ))}
      </div>
    </div>
  );
}
