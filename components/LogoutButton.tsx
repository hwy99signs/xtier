import { LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';

interface LogoutButtonProps {
  className?: string;
  label?: string;
  iconSize?: number;
}

export function LogoutButton({
  className = '',
  label = 'Logout',
  iconSize = 14,
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <button type="submit" className={className}>
        <LogOut size={iconSize} />
        {label}
      </button>
    </form>
  );
}
