import type { User } from "../user/user.types";

export interface WorkSchedule {
  id: string;
  name: string | null;
  description: string | null;
  startTime: string;
  endTime: string;
  lateToleranceMinutes: number;
  workScheduleDays?: WorkScheduleDay[];
  userWorkSchedules?: UserWorkSchedule[];
}

export interface WorkScheduleDay {
  id: string;
  dayOfWeek: number;
}

export interface UserWorkSchedule {
  id: string;
  workSchedule?: WorkSchedule;
  user?: User;
}

export interface ICreateWorkSchedulePayload {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  lateToleranceMinutes: number;
  workScheduleDays: number[];
}

export type IUpdateWorkSchedulePayload = Partial<ICreateWorkSchedulePayload>;

export interface IAssignWorkSchedulePayload {
  workScheduleId: string;
  userIds: string[];
}

export const WORK_SCHEDULE_DAYS_LABEL: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

export const WORK_SCHEDULE_DAYS_SHORT_LABEL: Record<number, string> = {
  0: "Min",
  1: "Sen",
  2: "Sel",
  3: "Rab",
  4: "Kam",
  5: "Jum",
  6: "Sab",
};

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
