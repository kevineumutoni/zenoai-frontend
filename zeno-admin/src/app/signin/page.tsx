'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchLogin } from '../hooks/useFetchLogin';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const { login, isLoading, error } = useFetchLogin();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) { 
    e.preventDefault();
    const result = await login(email, password);
    if (result && !error) {
      router.push('/home');
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/images/background.png')] bg-cover">
      <div className="w-250 h-170 rounded-2xl flex flex-col items-center px-30 py-14 bg-black/0 border border-gray-600 shadow-lg shadow-gray-600">
        <h2 className="text-[40px] font-bold text-cyan-200 mb-28 w-full text-left">Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
          <div className="relative flex items-center border-b border-white/60">
            <MailOutlineIcon className="text-white mr-3 " />
            <input
              type="email"
              value={email}
              onChange={e => setEmail((e.target as HTMLInputElement).value)}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative mb-15 flex items-center border-b border-white/60">
            <LockOutlinedIcon className="text-white mr-3" />
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword((e.target as HTMLInputElement).value)}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Password"
              required
            />
            <button type="button" onClick={() => setShow(v => !v)}>
              <VisibilityOutlinedIcon className="text-white" />
            </button>
          </div>
          <div className="flex w-full justify-center">
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="bg-cyan-200 w-100 text-[#0B182F] rounded-[10px] py-3 text-[22px] font-semibold  mt-2 transition-all flex justify-center"
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
          {error && (
            <div className="text-red-400 text-center text-sm" data-testid="error-message">
              {typeof error === 'string' ? error : error?.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}