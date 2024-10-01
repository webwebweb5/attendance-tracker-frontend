"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import MonthPickerPopover from "../month-picker";
import { DatePickerWithRange } from "../date-range-picker";
import { addDays, startOfMonth, startOfToday } from "date-fns";
import { DateRange } from "react-day-picker";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import axios from "axios";
import { DataTable } from "@/app/summary/data-table";
import { columns } from "@/app/summary/columns";

interface IRecordData {
  studentId: string;
  action: string;
  count: number;
}

const SummarySchema = z.object({
  courseId: z.string().min(2, { message: "Course Id is required" }),
});

export default function SummaryForm() {
  // State for monthly and semester picker
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(startOfToday())
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [recordData, setRecordData] = useState<IRecordData[]>([]);
  const [searchType, setSearchType] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const form = useForm<z.infer<typeof SummarySchema>>({
    resolver: zodResolver(SummarySchema),
    defaultValues: {
      courseId: "",
    },
  });

  async function handleMonthlySubmit(values: z.infer<typeof SummarySchema>) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance/monthly-report?courseId=${
          values.courseId
        }&year=${selectedMonth.getFullYear()}&month=${
          selectedMonth.getMonth() + 1
        }`
      );
      setSelectedCourseId(values.courseId);
      setSearchType("Monthly");
      setRecordData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.error);
    }
  }

  async function handleSemesterSubmit(values: z.infer<typeof SummarySchema>) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance/semester-report?courseId=${values.courseId}&semesterStartDate=${date?.from}&semesterEndDate=${date?.to}`
      );
      setSelectedCourseId(values.courseId);
      setSearchType("Semester");
      setRecordData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.error);
    }
  }

  async function handleExport() {
    if (searchType === "Semester") {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance/semester-report?courseId=${selectedCourseId}&semesterStartDate=${date?.from}&semesterEndDate=${date?.to}&export=true`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error.response?.data?.error);
      }
    }

    if (searchType === "Monthly") {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance/monthly-report?courseId=${selectedCourseId}&year=${selectedMonth.getFullYear()}&month=${
            selectedMonth.getMonth() + 1
          }&export=true`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error.response?.data?.error);
      }
    }
  }

  return (
    <Form {...form}>
      {/* Form fields */}
      <form className="space-y-5">
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Course Id</FormLabel> */}
              <FormControl>
                <Input placeholder="Course Id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Submission Section */}
        <div className="flex flex-col gap-2">
          <div>Monthly</div>
          <div className="flex gap-2">
            <MonthPickerPopover
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
            <Button
              type="button"
              onClick={form.handleSubmit(handleMonthlySubmit)}
            >
              <PiMagnifyingGlassBold className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Semester Submission Section */}
        <div className="flex flex-col gap-2">
          <div>Semester</div>
          <div className="flex gap-2">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Button
              type="button"
              onClick={form.handleSubmit(handleSemesterSubmit)}
            >
              <PiMagnifyingGlassBold className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {searchType && <p>{searchType} Table</p>}
          <DataTable columns={columns} data={recordData} />
          {searchType && (
            <Button type="button" onClick={handleExport}>
              Export {searchType} Data
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
