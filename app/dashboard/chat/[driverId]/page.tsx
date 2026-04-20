import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Car, ShieldCheck, MapPin } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getMessages } from '@/actions/message';
import { ChatInterface } from '@/components/ChatInterface';
import { Logo } from '@/components/Logo';
import { LogoutButton } from '@/components/LogoutButton';

export default async function MemberChatPage({ params }: { params: Promise<{ driverId: string }> }) {
  const session = await auth();
  const { driverId } = await params;

  if (!session?.user?.id) redirect('/login');

  const driver = await prisma.driver.findUnique({
    where: { userId: driverId },
    include: { user: true }
  });

  if (!driver) redirect('/dashboard');

  const messages = await getMessages(session.user.id, driverId);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Full Screen Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            currentUserId={session.user.id} 
            otherUserId={driverId} 
            otherUserName={driver.user.firstName}
            initialMessages={messages}
            otherUserRole="Secure Concierge Line"
            backHref="/dashboard"
          />
        </div>
      </main>
    </div>
  );
}
