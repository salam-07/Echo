import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { Input, Button, Card } from "../components/ui";
//import toast from "react-hot-toast";

const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.userName.trim()) return; //toast.error("Username is required");
        if (!formData.password) return; //toast.error("Password is required");
        if (formData.password.length < 4) return; //toast.error("Password must be at least 4 characters");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();

        if (success === true) {
            signup(formData);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            {/* Mobile Logo - Only on mobile */}
            <div className="lg:hidden flex justify-center pt-8 pb-6">
                <img
                    src="/logo_white.png"
                    alt="Echo Logo"
                    className="w-24 h-24 drop-shadow-lg"
                />
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center px-4 pb-8 lg:min-h-screen">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* Desktop Logo Section - Hidden on mobile */}
                    <div className="hidden lg:flex flex-col items-center justify-center">
                        <div className="text-center mb-8">
                            <img
                                src="/logo_white.png"
                                alt="Echo Logo"
                                className="w-56 h-56 mx-auto mb-4 drop-shadow-lg"
                            />
                            <h1 className="text-3xl font-light text-base-content mb-2">
                                Welcome to <span className="font-medium">Echo</span>
                            </h1>
                            <p className="text-base-content/60 text-base max-w-md mx-auto leading-relaxed">
                                Join our community where every voice matters. Share your thoughts, connect with others, and let your ideas echo.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col justify-center">
                        <div className="w-full max-w-md mx-auto">

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-light text-base-content mb-2">Create account</h2>
                                <p className="text-base-content/60 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            {/* Form Card */}
                            <div className="bg-base-100 rounded-3xl border border-base-300/50 p-8 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Username Field */}
                                    {/* Username Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-base-content/80">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-4 h-4 text-base-content/40" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full pl-11 pr-4 py-3 bg-base-200/30 border border-base-300/50 rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                                                placeholder="Enter your username"
                                                value={formData.userName}
                                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-base-content/80">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="w-4 h-4 text-base-content/40" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full pl-11 pr-12 py-3 bg-base-200/30 border border-base-300/50 rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                                                placeholder="Create a secure password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-base-300/30 rounded-r-xl transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4 text-base-content/40" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-base-content/40" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-base-content/50">Minimum 4 characters required</p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-base-content text-base-100 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-base-content/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Sign Up
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Footer Text */}
                            <div className="text-center mt-6">
                                <p className="text-xs text-base-content/50">
                                    By creating an account, you agree to our terms and privacy policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;