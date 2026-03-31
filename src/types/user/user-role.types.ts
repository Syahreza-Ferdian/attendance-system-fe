export interface UserRole {
  id: string;
  name: UserRoleType;
}

export const UserRoleType = {
  HR: "HR",
  EMPLOYEE: "Employee",
};

export type UserRoleType = (typeof UserRoleType)[keyof typeof UserRoleType];
