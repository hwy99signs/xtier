import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

// Simple session token stored in cookie (no NextAuth dependency)
// For production, use NextAuth or a proper session library

export interface AdminSession {
  userId: string
  email: string
  role: 'ADMIN'
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')
  if (!token) return null

  try {
    // Decode base64 token (simple, for demo purposes)
    const decoded = Buffer.from(token.value, 'base64').toString('utf-8')
    const session = JSON.parse(decoded) as AdminSession
    // Verify user still exists and is admin
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user || user.role !== 'ADMIN') return null
    return session
  } catch {
    return null
  }
}

export function createSessionToken(session: AdminSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export async function requireAdmin(request: NextRequest): Promise<AdminSession | Response> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const decoded = Buffer.from(token.value, 'base64').toString('utf-8')
    const session = JSON.parse(decoded) as AdminSession
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    return session
  } catch {
    return Response.json({ error: 'Invalid session' }, { status: 401 })
  }
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
