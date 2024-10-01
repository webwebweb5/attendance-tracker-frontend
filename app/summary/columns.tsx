"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Attendance = {
    studentId: string;
    action: string;
    count: number;
};

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "studentId",
    header: "Student Id",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "count",
    header: "Count",
  },
];
