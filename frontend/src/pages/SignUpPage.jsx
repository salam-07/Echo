import { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
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
        <div>
            <div className="min-h-screen bg-base-100 grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Logo (top on mobile, left on desktop) */}
                <div className="flex flex-col items-center justify-center lg:py-0 lg:order-2 bg-base-100">
                    <img
                        src="/logo_white.png"
                        alt="Logo"
                        className="size-36 lg:size-112 drop-shadow-xl"
                    />
                </div>
                {/* Right: Form */}
                <div className="flex flex-col justify-start lg:justify-center items-center pb-6 sm:pb-8 px-2 sm:px-8 lg:order-1">
                    <div className="w-full max-w-md">
                        <div className="bg-base-100/80 rounded-2xl shadow-2xl px-6 sm:px-8 sm:py-10 border border-base-200">
                            <div role="tablist" className="tabs tabs-bordered mb-8 flex justify-center tabs-lg">
                                <Link to="/signup" className="tab tab-active text-lg font-semibold tracking-wide">
                                    Sign Up
                                </Link>
                                <Link to="/login" className="tab text-lg font-semibold tracking-wide">
                                    Log In
                                </Link>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold text-base-content/80">Username</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="size-5 text-base-content/40" />
                                        </div>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pl-10 text-base bg-base-200/60 focus:bg-base-100 focus:ring-2 focus:ring-primary focus:outline-hidden transition"
                                            placeholder="Username"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text font-semibold text-base-content/80">Password</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="size-5 text-base-content/40" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="input input-bordered w-full pl-10 text-base bg-base-200/60 focus:bg-base-100 focus:ring-2 focus:ring-primary focus:outline-hidden transition"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-5 text-base-content/40" />
                                            ) : (
                                                <Eye className="size-5 text-base-content/40" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full text-lg font-bold tracking-wide shadow-md" disabled={isSigningUp}>
                                    {isSigningUp ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUpPage;