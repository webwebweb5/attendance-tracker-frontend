"use client";

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
import { useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { PiArrowLeft } from "react-icons/pi";
// import axios from "axios";

interface Location {
  lat: number | null;
  lng: number | null;
}

const universityLat = 18.824518;
const universityLng = 99.045474;
const radius = 0.5;

export default function Attendance() {
  const [studentId, setStudentId] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  // const [action, setAction] = useState<string>("");
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [isInUniversity, setIsInUniversity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันสำหรับตรวจสอบ GPS
  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
          checkIfInsideUniversity();
        },
        (error) => {
          alert("Error fetching location: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  function checkIfInsideUniversity() {
    if (!location) {
      getLocation();
    }

    const distance = getDistanceFromLatLonInKm(
      location.lat as number,
      location.lng as number,
      universityLat,
      universityLng
    );

    if (distance <= radius) {
      // return true; // อยู่ในเขตมหาวิทยาลัย
      console.log("มหาวิทยาลัย", universityLat, universityLng);
      console.log("ผู้ใช้", location.lat, location.lng);
      console.log("อยู่ในเขตมหาวิทยาลัย");
      setIsInUniversity(true);
    } else {
      // return false; // อยู่นอกเขตมหาวิทยาลัย
      console.log("มหาวิทยาลัย", universityLat, universityLng);
      console.log("ผู้ใช้", location.lat, location.lng);
      console.log("อยู่นอกเขตมหาวิทยาลัย");
      setIsInUniversity(false);
    }
  }

  // ฟังก์ชันสำหรับบันทึกเวลาเข้า-ออก
  const recordAttendance = async () => {
    if (!location.lat || !location.lng) {
      alert("Please enable location services");
      return;
    }

    try {
      // const response = await axios.post(
      //   "http://localhost:4000/api/attendance",
      //   {
      //     studentId,
      //     courseId,
      //     action,
      //     location,
      //   }
      // );

      alert("Attendance recorded");
    } catch (error) {
      alert("Error recording attendance: " + error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button variant="ghost" className="flex-start w-fit px-2" asChild>
        <Link href="/">
          <PiArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-4xl">บันทึกเวลาเข้า-ออกห้องเรียน</h1>
      <Input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="เลือกการบันทึก" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>เลือกการบันทึก</SelectLabel>
            <SelectItem value="in">เข้า</SelectItem>
            <SelectItem value="out">ออก</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={getLocation}>
        {isLoading ? (
          <LuLoader2 className="mr-2 w-5 h-5 animate-spin" />
        ) : (
          "ตรวจสอบตำแหน่ง GPS"
        )}
      </Button>
      <Button onClick={recordAttendance}>บันทึกเวลา</Button>
      <Button>ประวัติการบันทึก</Button>

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
