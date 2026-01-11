import prisma from "../../lib/db";

// Check device and ban user if different device
export const checkDeviceBinding = async (
  userId: string,
  deviceId: string
): Promise<{ allowed: boolean; reason?: string }> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      deviceId: true,
      isBanned: true,
      banReason: true,
    },
  });

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  // If user is already banned
  if (user.isBanned) {
    return {
      allowed: false,
      reason:
        user.banReason ||
        "Account is banned. Please submit a recovery request.",
    };
  }

  // First login - bind device
  if (!user.deviceId) {
    await prisma.user.update({
      where: { id: userId },
      data: { deviceId },
    });
    return { allowed: true };
  }

  // Same device - allow
  if (user.deviceId === deviceId) {
    return { allowed: true };
  }

  // Different device - ban user
  await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: true,
      banReason: "Device mismatch detected. Please submit a recovery request.",
    },
  });

  return {
    allowed: false,
    reason:
      "Device mismatch detected. Your account has been banned. Please submit a recovery request.",
  };
};

// Bind device on first login (for admin-created accounts)
export const bindDevice = async (userId: string, deviceId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { deviceId },
  });
};
