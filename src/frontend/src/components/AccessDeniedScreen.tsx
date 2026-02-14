import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You don't have permission to access this page. Only administrators can view this content.
        </p>
        <Button
          onClick={() => navigate({ to: '/' })}
          className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
