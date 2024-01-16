'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Login() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    useEffect(() => {
        /*if (localStorage.getItem('chat-app-user')) {
            router.push('/');
        }*/
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username } = values;
        }
    };

    const handleValidation = () => {
        const { password, username } = values;
        if (username === '' || password === '') {
            console.log('Username and password are required');
            return false;
        }
        return true;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
            <form
                className="flex flex-col bg-[#00000076] px-[5rem] py-[3rem] gap-4 rounded-[2rem]"
                onSubmit={event => handleSubmit(event)}
            >
                <div className="flex justify-center items-center">
                    <Image src="/logo.svg" alt="" width={80} height={80} className="w-[5rem]" />
                    <h1 className="text-[#e0e2e6] text-xl">Facebook</h1>
                </div>
                <input
                    className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={e => handleChange(e)}
                />
                <input
                    className="bg-transparent p-[1rem] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] w-full text-[1rem] focus:border-[#4e0eff] focus:outline-none"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={e => handleChange(e)}
                />
                <button
                    className="w-full bg-[#0780ff] text-[#e0e2e6] px-[2rem] py-[1rem] border-none font-bold cursor-pointer rounded-md text-[1rem] uppercase transition ease-in-out hover:bg-[#4e0eff]"
                    type="submit"
                >
                    Login
                </button>
                <span className="text-[#e0e2e6] uppercase">
                    Do not have account ?{' '}
                    <Link className="text-[#4e0eff] font-bold" href="/register">
                        Register
                    </Link>
                </span>
            </form>
        </div>
    );
}
