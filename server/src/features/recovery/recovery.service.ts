import prisma from "../../lib/db";
import { RecoveryStatus } from "../../lib/constants";

// Type for recovery request input (inline)
interface RecoveryRequestInput {
  message: string;
  deviceId: string;
}

// Create a recovery request
export const createRecoveryRequest = async (
  userId: string,
  input: RecoveryRequestInput
) => {
  // Check if user already has a pending request
  const existingRequest = await prisma.recoveryRequest.findFirst({
    where: {
      userId,
      status: RecoveryStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new Error("You already have a pending recovery request");
  }

  return prisma.recoveryRequest.create({
    data: {
      userId,
      message: input.message,
      newDeviceId: input.deviceId,
    },
  });
};

// Get user's recovery requests
export const getUserRecoveryRequests = async (userId: string) => {
  return prisma.recoveryRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// Get latest recovery request status
export const getLatestRecoveryStatus = async (userId: string) => {
  return prisma.recoveryRequest.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      adminNote: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
