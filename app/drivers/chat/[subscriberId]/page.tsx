import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Navigation, Clock } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getMessages } from '@/actions/message';
import { ChatInterface } from '@/components/ChatInterface';
import { Logo } from '@/components/Logo';
import { LogoutButton } from '@/components/LogoutButton';
import { formatDateTime } from '@/lib/utils';

export default async function DriverChatPage({ params }: { params: Promise<{ subscriberId: string }> }) {
  const session = await auth();
  const { subscriberId } = await params;

  if (!session?.user?.id) redirect('/login');

  const subscriberUser = await prisma.user.findUnique({
    where: { id: subscriberId },
    include: {
      subscriber: {
        include: { zone: true }
      }
    }
  });

  if (!subscriberUser || !subscriberUser.subscriber) redirect('/drivers/dashboard');

  const messages = await getMessages(session.user.id, subscriberId);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Full Screen Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            currentUserId={session.user.id} 
            otherUserId={subscriberId} 
            otherUserName={subscriberUser.firstName}
            initialMessages={messages}
            otherUserRole="Erantt Member"
            backHref="/drivers/dashboard"
          />
        </div>
      </main>
    </div>
  );
}
