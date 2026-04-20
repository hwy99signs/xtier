'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(receiverId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const message = await prisma.chatMessage.create({
    data: {
      content,
      senderId: session.user.id,
      receiverId,
    },
  });

  // Revalidate both possible chat paths to ensure cross-role sync
  revalidatePath(`/dashboard/chat/${receiverId}`);
  revalidatePath(`/dashboard/chat/${session.user.id}`);
  revalidatePath(`/drivers/chat/${receiverId}`);
  revalidatePath(`/drivers/chat/${session.user.id}`);
  
  return { success: true, message };
}

export async function getMessages(userId: string, otherId: string) {
  return await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      sender: {
        select: { firstName: true, lastName: true }
      }
    }
  });
}

export async function getUnreadCount(receiverId: string) {
  const session = await auth();
  if (!session?.user?.id) return 0;
  
  return await prisma.chatMessage.count({
    where: {
      receiverId,
      readAt: null
    }
  });
}

export async function markAsRead(senderId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.chatMessage.updateMany({
    where: {
      senderId: senderId,
      receiverId: session.user.id,
      readAt: null
    },
    data: {
      readAt: new Date()
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/drivers/dashboard');
}
