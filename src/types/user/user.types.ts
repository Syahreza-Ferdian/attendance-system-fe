import type { Position } from "../position/position.types";
import type { UserWorkSchedule } from "../work-schedule/work-schedule.types";
import type { UserRole } from "./user-role.types";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage: string | null;
  role: UserRole;
  position: Position;
  userWorkSchedules?: UserWorkSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId: string;
  positionId: string;
  profilePictureFile?: File;
}

export type IUpdateUserPayload = Partial<ICreateUserPayload>;
