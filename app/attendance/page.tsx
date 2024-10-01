"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDistanceFromLatLonInKm } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { PiArrowLeft } from "react-icons/pi";
import axios, { AxiosResponse } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Location {
  lat: number | null;
  lng: number | null;
}

interface AttendanceResponse {
  message: string;
}

const universityLat = 18.824518;
const universityLng = 99.045474;
const radius = 1.5;

const attendanceSchema = z.object({
  studentId: z.string().min(2, {
    message: "Student Id is required",
  }),
  courseId: z.string().min(2, {
    message: "Course Id is required",
  }),
  action: z.string().min(2, {
    message: "Action Id is required",
  }),
});

export default function Attendance() {
  // const [studentId, setStudentId] = useState<string>("");
  // const [courseId, setCourseId] = useState<string>("");
  // const [action, setAction] = useState<string>("");
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [isInUniversity, setIsInUniversity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async (): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsLoading(false);
            checkIfInsideUniversity(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve();
          },
          (error) => {
            alert("Error fetching location: " + error.message);
            setIsLoading(false);
            reject(error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        setIsLoading(false);
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  function checkIfInsideUniversity(lat: number, lng: number) {
    const distance = getDistanceFromLatLonInKm(
      lat,
      lng,
      universityLat,
      universityLng
    );

    if (distance <= radius) {
      console.log("อยู่ในเขตมหาวิทยาลัย");
      setIsInUniversity(true);
    } else {
      console.log("อยู่นอกเขตมหาวิทยาลัย");
      setIsInUniversity(false);
    }
  }

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
      action: "",
    },
  });

  async function onSubmit(values: z.infer<typeof attendanceSchema>) {
    // Wait for getLocation to complete
    await getLocation();

    if (!location.lat || !location.lng) {
      alert("Unable to get location.");
      return;
    }

    if (!isInUniversity) {
      alert("บันทึกไม่สำเร็จ อยู่นอกเขตมหาวิทยาลัย");
      return;
    }

    try {
      const response: AxiosResponse<AttendanceResponse> = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance/record-attendance`,
        {
          ...values,
          location,
        }
      );

      alert(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.error);
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <Button variant="ghost" className="flex-start w-fit px-2" asChild>
        <Link href="/">
          <PiArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-4xl">บันทึกเวลาเข้า-ออกห้องเรียน</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Id</FormLabel>
                <FormControl>
                  <Input placeholder="Student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Id</FormLabel>
                <FormControl>
                  <Input placeholder="Course ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Id</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกการบันทึก" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>เลือกการบันทึก</SelectLabel>
                      <SelectItem value="in">เข้า</SelectItem>
                      <SelectItem value="out">ออก</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="button" onClick={getLocation} disabled={isLoading}>
              {isLoading ? (
                <LuLoader2 className="w-5 h-5 animate-spin" />
              ) : (
                "ตรวจสอบตำแหน่ง GPS"
              )}
            </Button>
            <Button type="submit" disabled={isLoading}>
              บันทึกเวลา
            </Button>
          </div>
        </form>
      </Form>

      {location && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
          <p>
            Position:{" "}
            {isInUniversity ? "อยู่ในเขตมหาวิทยาลัย" : "อยู่นอกเขตมหาวิทยาลัย"}
          </p>
        </div>
      )}
    </div>
  );
}
