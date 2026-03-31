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
