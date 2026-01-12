import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });

    const { login, isLoggingIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.userName.trim()) return toast.error("Username is required");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 4) return toast.error("Password must be at least 4 characters");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm() === true) {
            login(formData);
        }
    };

    const isFormValid = formData.userName.trim() && formData.password.length >= 4;

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    {/* Logo & Welcome */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-light tracking-tight text-base-content mb-2">
                            echo<span className="text-base-content/30">.</span>
                        </h1>
                        <p className="text-base-content/40 text-sm">
                            Welcome back
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-base-300/50 text-base-content text-lg placeholder:text-base-content/25 focus:outline-none focus:border-base-content/30 transition-colors"
                                placeholder="Enter your username"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-0 py-3 pr-10 bg-transparent border-0 border-b border-base-300/50 text-base-content text-lg placeholder:text-base-content/25 focus:outline-none focus:border-base-content/30 transition-colors"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-base-content/30 hover:text-base-content/50 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!isFormValid || isLoggingIn}
                                className="w-full py-3.5 bg-base-content text-base-100 rounded-full font-medium text-sm transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Continue</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Switch to Signup */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-base-content/40">
                            New to Echo?{' '}
                            <Link
                                to="/signup"
                                className="text-base-content/70 hover:text-base-content underline underline-offset-2 transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-6 text-center">
                <p className="text-xs text-base-content/25">
                    Your thoughts, amplified.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;