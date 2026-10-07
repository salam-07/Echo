import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';
import AuthSheet, { Field } from '../components/auth/AuthSheet.jsx';

/** Create an account, preserving usernames passed from the landing page. */

const SignUpPage = () => {
    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [form, setForm] = useState({
        userName: (params.get('u') ?? '').trim().slice(0, 32),
        password: '',
    });
    const [errors, setErrors] = useState({});

    const edit = (key) => (event) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userName = form.userName.trim();
        const next = {};

        if (!userName) next.userName = 'Enter a username.';
        else if (userName.length < 3) {
            next.userName = 'Use at least 3 characters.';
        }

        if (!form.password) next.password = 'Enter a password.';
        else if (form.password.length < 4) {
            next.password = 'Use at least 4 characters.';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        const user = await signup({ userName, password: form.password });
        if (user) navigate('/welcome', { replace: true });
    };

    return (
        <AuthSheet
            statement="Create your account."
            deck="No email needed. Keep your password safe, since it cannot be reset."
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <Field
                    label="Username"
                    prefix="@"
                    value={form.userName}
                    onChange={edit('userName')}
                    error={errors.userName}
                    hint="At least 3 characters."
                    autoComplete="username"
                    placeholder="yourname"
                    disabled={isSigningUp}
                />

                <Field
                    label="Password"
                    type="password"
                    reveal
                    value={form.password}
                    onChange={edit('password')}
                    error={errors.password}
                    hint="At least 4 characters."
                    autoComplete="new-password"
                    disabled={isSigningUp}
                />

                <div>
                    <button type="submit" disabled={isSigningUp} aria-live="polite" className="act h-12 w-full px-8">
                        {isSigningUp ? 'Creating account...' : 'Create account'}
                    </button>
                </div>
            </form>

            <div className="mt-12">
                <p className="t-body text-ink-soft">
                    Already have an account?{' '}
                    <Link to="/login" className="link-rule font-medium text-ink">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthSheet>
    );
};

export default SignUpPage;
