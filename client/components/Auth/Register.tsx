'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Id, toast } from 'react-toastify';
import { useRegister } from '@/hooks/api/auth';
import { IRegisterPayload } from '@/types';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

const defaultValues = {
  fullName: '',
  gender: 'MALE',
  username: '',
  confirmPassword: '',
  password: ''
};

export default function Register() {
  const [values, setValues] = useState(defaultValues);
  const toastIdRef = useRef<Id>();

  const { mutate: register, isSuccess, isError, isPending, error } = useRegister();

  useEffect(() => {
    if (isPending) toastIdRef.current = toast.loading('Registering');
    if (isSuccess) {
      toast.success('Register success');
      setValues(defaultValues);
      toast.dismiss(toastIdRef.current);
    } else if (isError) {
      toast.error(error.message);
      toast.dismiss(toastIdRef.current);
    }
  }, [isPending, isSuccess, isError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { confirmPassword, ...data } = values;
      if (data.password === confirmPassword) {
        register(data as IRegisterPayload);
      } else toast.error('Confirm password does not match!');
    } catch (error: any) {
      if (error.message[0]) toast.error(error.message[0]);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <form
      className="mt-8 flex flex-col w-[500px] bg-[#252728] px-[5rem] py-[3rem] gap-4 rounded-[2rem]"
      onSubmit={event => handleSubmit(event)}
    >
      <div className="flex justify-center items-center">
        <Image src="/logo.svg" alt="" width={80} height={80} className="w-[5rem]" />
        <h1 className="text-[#e0e2e6] text-xl">Facebook</h1>
      </div>
      <input
        required
        className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
        type="text"
        placeholder="Username"
        name="username"
        value={values.username}
        onChange={e => handleChange(e)}
      />
      <select
        required
        className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
        name="gender"
        value={values.gender}
        onChange={e => handleChange(e)}
        // defaultValue={Gender.MALE}
      >
        <option className="!text-[#333]" value={Gender.MALE}>
          Male
        </option>
        <option className="!text-[#333]" value={Gender.FEMALE}>
          Female
        </option>
      </select>
      <input
        required
        className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
        type="text"
        value={values.fullName}
        placeholder="Full name"
        name="fullName"
        onChange={e => handleChange(e)}
      />
      <input
        required
        className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
        type="password"
        placeholder="Password"
        name="password"
        value={values.password}
        onChange={e => handleChange(e)}
      />
      <input
        required
        className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
        type="password"
        value={values.confirmPassword}
        placeholder="Confirm password"
        name="confirmPassword"
        onChange={e => handleChange(e)}
      />
      <button
        className="w-full bg-[#0780ff] text-[#e0e2e6] px-[2rem] py-[1rem] border-none font-bold cursor-pointer rounded-md text-[1rem] uppercase transition ease-in-out hover:bg-[#4e0eff]"
        type="submit"
        disabled={isPending}
      >
        Register
      </button>
    </form>
  );
}
