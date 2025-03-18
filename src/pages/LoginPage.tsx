import React, { useState, FormEvent } from 'react';
import { LoginForm } from '../types';

const LoginPage: React.FC = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!form.email) {
            newErrors.email = 'Email is required';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Handle form submission logic here
        console.log(`Email: ${form.email}`);
        console.log(`Password: ${form.password}`);

        // perform some logic

        // then cleanup the input field
        setForm({ email: '', password: '' });
        setErrors({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [id]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md shadow focus:ring focus:ring-blue-200 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="name@company.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md shadow focus:ring focus:ring-blue-200 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="mb-4 text-right">
                        <span className="text-blue-900 text-sm font-medium mt-6">
                            <a href="#">Forgot Password?</a>
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="button w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;