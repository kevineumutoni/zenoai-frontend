'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useFetchSignUp } from '../hooks/useFetchSignUp';
import TermsModal from './components/TermsModal';

export default function SignUpPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signUp, isLoading, error } = useFetchSignUp();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (
        updated.password &&
        updated.confirmPassword &&
        updated.password !== updated.confirmPassword
      ) {
        setPasswordMatchError('Passwords do not match.');
      } else {
        setPasswordMatchError(null);
      }
      return updated;
    });
    setLocalError(null);
    setSuccess(null);
  };

  const handleTermsAgree = () => {
    setTermsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setLocalError('Please fill all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setLocalError('You must agree to terms and conditions to continue.');
      return;
    }
    const response = await signUp({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
    });
    if (response) {
      setSuccess('Account created successfully!');
      setTimeout(() => {
        router.push('/chat');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="2xl:w-250 lg:w-160 xl:w-150 xl:px-10 2xl:px-30 2xl:h-180 rounded-2xl flex flex-col items-center px-30 xl:py-14 lg:py-5 bg-black/0 border border-gray-600 shadow-lg shadow-gray-600">
        <h2 className="2xl:text-[50px] lg:text-[30px] xl:text-[40px] lg:m-4 xl:mx-10 font-bold text-[#9FF8F8] w-full text-left">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
          <div className="flex gap-4">
            <div className="relative flex-1 flex items-center border-b border-white/60">
              <PersonOutlineOutlinedIcon className="text-white mr-3" />
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="bg-transparent w-full xl:py-3 lg:py-1 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
                placeholder="First Name"
                required
                autoComplete="off"
              />
            </div>
            <div className="relative flex-1 flex items-center border-b border-white/60">
              <PersonOutlineOutlinedIcon className="text-white mr-3" />
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="bg-transparent w-full xl:py-3 lg:py-1 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
                placeholder="Last Name"
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="relative flex items-center border-b border-white/60">
            <EmailOutlinedIcon className="text-white mr-3" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="bg-transparent w-full xl:py-3 lg:py-1 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Email"
              required
              autoComplete="off"
            />
          </div>
          <div className="relative flex items-center border-b border-white/60">
            <LockOutlinedIcon className="text-white mr-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="bg-transparent w-full xl:py-3 lg:py-1 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Password"
              required
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon className="text-white" />
              ) : (
                <VisibilityOutlinedIcon className="text-white" />
              )}
            </button>
          </div>
          <div className="relative flex flex-col">
            <div className="flex items-center border-b border-white/60">
              <LockOutlinedIcon className="text-white mr-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="bg-transparent w-full xl:py-3 lg:py-1 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
                placeholder="Confirm Password"
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <VisibilityOffOutlinedIcon className="text-white" />
                ) : (
                  <VisibilityOutlinedIcon className="text-white" />
                )}
              </button>
            </div>
            {passwordMatchError && (
              <div className="text-red-400 text-center mt-2 text-base">
                {passwordMatchError}
              </div>
            )}
          </div>
          <div className="flex w-full justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 select-none group w-full">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="accent-[#9FF8F8] h-5 w-5"
                />
                <span className="text-white cursor-pointer xl:text-xl lg:text-md">
                  Agree to{' '}
                  <span
                    className="text-[#9FF8F8] cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      setTermsOpen(true);
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    terms and conditions
                  </span>
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#9FF8F8] w-60 xl:w-50 lg:w-30 2xl:text-lg 2xl:w-80 text-[#0B182F] rounded-[10px] 2xl:py-4 xl:py-1 lg:py-2 lg:text-sm text-[23px] font-semibold mt-2 transition-all flex justify-center">
              Sign Up
            </button>
          </div>
          {success && (
            <div className="text-green-400 text-center mt-2 text-base font-semibold">
              {success}
            </div>
          )}
          {(localError || error) && (
            <div className="text-red-400 text-center mt-2 text-base">
              {localError || error?.message}
            </div>
          )}
        </form>
        <div className="xl:mt-10 lg:mt-2">
          <span className="text-white xl:text-xl lg:text-md">
            Already have an account?{' '}
            <span
              className="text-[#9FF8F8] cursor-pointer"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </span>
          </span>
        </div>
      </div>
      <TermsModal
        open={termsOpen}
        agreed={agreed}
        setAgreed={setAgreed}
        onClose={() => setTermsOpen(false)}
        onAgree={handleTermsAgree}
      />
    </div>
  );
}
