'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Id, toast } from 'react-toastify';
import { useLogin, useMe } from '@hooks/api/auth';
import { useRouter } from 'next/navigation';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const { mutate: login, isSuccess, isError, isPending, error } = useLogin();
  const router = useRouter();
  const { refetch } = useMe();
  const toastIdRef = useRef<Id>();

  useEffect(() => {
    if (isPending) toastIdRef.current = toast.loading('Loading...');
    if (isSuccess) {
      refetch();
      router.replace('/');
    }
    if (isError) toast.error(error.message);
    toast.dismiss(toastIdRef.current);
  }, [isPending, isSuccess, isError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { password, username } = values;
      login({ username, password });
    } catch (error: any) {
      if (error.message) toast.error(error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <form
      className="fixed top-0 left-0 right-0 flex justify-between h-[56px] bg-[#252728] gap-4"
      onSubmit={event => handleSubmit(event)}
    >
      <Image src="/logo.svg" alt="" width={80} height={80} className="w-[5rem]" />

      <div className="p-4 flex items-center gap-4">
        <input
          required
          className="w-[200px] h-[36px] bg-transparent py-[4px] px-[8px] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] text-[13px] focus:border-[#4e0eff] focus:outline-none"
          type="text"
          placeholder="Username"
          name="username"
          onChange={e => handleChange(e)}
        />
        <input
          required
          className="w-[200px] h-[36px] bg-transparent py-[4px] px-[8px] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] text-[13px] focus:border-[#4e0eff] focus:outline-none"
          type="password"
          placeholder="Password"
          name="password"
          onChange={e => handleChange(e)}
        />
        <button
          className="px-[32px] h-[36px] bg-[#0780ff] text-[#e0e2e6] border-none font-bold cursor-pointer rounded-md text-[12px] uppercase transition ease-in-out hover:bg-[#4e0eff]"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
