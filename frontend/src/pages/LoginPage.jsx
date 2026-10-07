import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';
import AuthSheet, { Field } from '../components/auth/AuthSheet.jsx';

/** Sign in with inline field validation. */

const LoginPage = () => {
    const { login, isLoggingIn } = useAuthStore();
    const [form, setForm] = useState({ userName: '', password: '' });
    const [errors, setErrors] = useState({});

    const edit = (key) => (event) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const next = {};
        if (!form.userName.trim()) next.userName = 'Enter your username.';
        if (!form.password) next.password = 'Enter your password.';
        else if (form.password.length < 4) {
            next.password = 'Use at least 4 characters.';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        login({ userName: form.userName.trim(), password: form.password });
    };

    return (
        <AuthSheet
            statement="Sign in to Echo."
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <Field
                    label="Username"
                    prefix="@"
                    value={form.userName}
                    onChange={edit('userName')}
                    error={errors.userName}
                    autoComplete="username"
                    placeholder="yourname"
                    disabled={isLoggingIn}
                />

                <Field
                    label="Password"
                    type="password"
                    reveal
                    value={form.password}
                    onChange={edit('password')}
                    error={errors.password}
                    autoComplete="current-password"
                    disabled={isLoggingIn}
                />

                <div>
                    <button type="submit" disabled={isLoggingIn} aria-live="polite" className="act h-12 w-full px-8">
                        {isLoggingIn ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>

            <div className="mt-12">
                <p className="t-body text-ink-soft">
                    New to Echo?{' '}
                    <Link to="/signup" className="link-rule font-medium text-ink">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthSheet>
    );
};

export default LoginPage;
