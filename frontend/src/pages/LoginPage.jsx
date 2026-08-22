import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';
import AuthSheet, { Field } from '../components/auth/AuthSheet.jsx';

/**
 * Sign in — the last page of the specification sheet.
 *
 * Two fields, one hairline each. Validation is inline and named, next to the field
 * that caused it, rather than thrown across the screen as a toast; the store's
 * toast is left to carry what only the server knows.
 */

const TERMS = [
    { term: 'Identifier', detail: 'Username' },
    { term: 'Email address', detail: 'None on file' },
    { term: 'Password', detail: '4 characters minimum' },
];

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
        if (!form.userName.trim()) next.userName = 'Enter the username you signed up with.';
        if (!form.password) next.password = 'Enter your password.';
        else if (form.password.length < 4) {
            next.password = 'Passwords here are at least 4 characters, so this one is too short.';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        login({ userName: form.userName.trim(), password: form.password });
    };

    return (
        <AuthSheet
            reference="Sign in"
            statement="Your rule is where you left it."
            deck="Every Scroll you wrote is exactly as you wrote it. Nothing was re-ordered while you were away, because nothing here re-orders anything on its own."
            terms={TERMS}
            footer="Set in Playfair Display and Inter."
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
                    <button type="submit" disabled={isLoggingIn} className="act h-12 w-full px-8">
                        {isLoggingIn ? 'Signing in' : 'Sign in'}
                    </button>
                    <p aria-live="polite" className="t-label mt-4 h-4 normal-case tracking-[0.04em]">
                        {isLoggingIn ? 'Checking your username and password…' : ''}
                    </p>
                </div>
            </form>

            <div className="mt-12 border-t border-ink pt-5">
                <p className="t-body text-ink-soft">
                    No account yet?{' '}
                    <Link to="/signup" className="link-rule font-medium text-ink">
                        Create one
                    </Link>{' '}
                    &mdash; it takes a username and a password.
                </p>
            </div>
        </AuthSheet>
    );
};

export default LoginPage;
