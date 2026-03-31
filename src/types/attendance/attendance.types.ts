import type { User } from "../user/user.types";

export interface Attendance {
  id: string;
  userId: string;
  status: AttendanceStatus;
  workDate: Date;
  locationIn: string;
  locationOut: string;
  proofImageIn: string;
  proofImageOut: string;
  attendanceIn: string;
  attendanceOut: string | null;
  user?: User;
}

export type TodayAttendance = Attendance | null;

export interface ICreateAttendancePayload {
  location: string;
  attendanceProofImage?: File;
}

export interface IAttendanceUIState {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  attendanceIn: string | null;
  attendanceOut: string | null;
  status: AttendanceStatus | null;
  locationIn: string | null;
  locationOut: string | null;
  proofImageIn: string | null;
  proofImageOut: string | null;
}

export const AttendanceStatus = {
  PRESENT: "PRESENT",
  LATE: "LATE",
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export function toAttendanceUIState(
  todayAttendance: TodayAttendance,
): IAttendanceUIState {
  if (!todayAttendance) {
    return {
      hasCheckedIn: false,
      hasCheckedOut: false,
      attendanceIn: null,
      attendanceOut: null,
      status: null,
      locationIn: null,
      locationOut: null,
      proofImageIn: null,
      proofImageOut: null,
    };
  }

  return {
    hasCheckedIn: !!todayAttendance.attendanceIn,
    hasCheckedOut: !!todayAttendance.attendanceOut,
    attendanceIn: todayAttendance.attendanceIn,
    attendanceOut: todayAttendance.attendanceOut,
    status: todayAttendance.status,
    locationIn: todayAttendance.locationIn,
    locationOut: todayAttendance.locationOut,
    proofImageIn: todayAttendance.proofImageIn,
    proofImageOut: todayAttendance.proofImageOut,
  };
}
