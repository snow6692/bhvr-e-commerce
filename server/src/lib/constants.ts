// User roles enum
export const UserRole = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  USER: "USER",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Recovery request status enum
export const RecoveryStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type RecoveryStatusType =
  (typeof RecoveryStatus)[keyof typeof RecoveryStatus];
