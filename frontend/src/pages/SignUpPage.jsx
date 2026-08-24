import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';
import AuthSheet, { Field } from '../components/auth/AuthSheet.jsx';

/**
 * Create an account — the same spread, one page further on.
 *
 * A handle claimed in §04 of the landing sheet arrives here in the URL and is
 * already typed into the field, so the visitor is never asked the same question
 * twice. The old page validated silently and simply refused to submit; this one
 * names what is missing beside the field that is missing it.
 */

const TERMS = [
    { term: 'Identifier', detail: 'Username only' },
    { term: 'Email address', detail: 'None required' },
    { term: 'Verification', detail: 'No step' },
    { term: 'Username', detail: '3 characters minimum' },
    { term: 'Password', detail: '4 characters minimum' },
];

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

        if (!userName) next.userName = 'Pick a username — it is the only name Echo will know you by.';
        else if (userName.length < 3) {
            next.userName = `A username needs at least 3 characters, and this one has ${userName.length}.`;
        }

        if (!form.password) next.password = 'Choose a password, 4 characters or more.';
        else if (form.password.length < 4) {
            next.password = `Passwords need at least 4 characters, and this one has ${form.password.length}.`;
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        const user = await signup({ userName, password: form.password });
        if (user) navigate('/welcome', { replace: true });
    };

    return (
        <AuthSheet
            reference="Create an account"
            statement="A handle, a password, and nothing else."
            deck="That is the whole account. There is no email address on file and no verification step to sit through — so keep your password somewhere you trust."
            terms={TERMS}
            footer="Set in Playfair Display and Inter."
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <Field
                    label="Choose a username"
                    prefix="@"
                    value={form.userName}
                    onChange={edit('userName')}
                    error={errors.userName}
                    hint="3 characters or more. This is how everyone will see you."
                    autoComplete="username"
                    placeholder="yourname"
                    disabled={isSigningUp}
                />

                <Field
                    label="Choose a password"
                    type="password"
                    reveal
                    value={form.password}
                    onChange={edit('password')}
                    error={errors.password}
                    hint="4 characters or more."
                    autoComplete="new-password"
                    disabled={isSigningUp}
                />

                <div>
                    <button type="submit" disabled={isSigningUp} className="act h-12 w-full px-8">
                        {isSigningUp ? 'Creating your account' : 'Create account'}
                    </button>
                    <p aria-live="polite" className="t-label mt-4 h-4 normal-case tracking-[0.04em]">
                        {isSigningUp ? 'Claiming your username…' : ''}
                    </p>
                </div>
            </form>

            <div className="mt-12 border-t border-ink pt-5">
                <p className="t-body text-ink-soft">
                    Already have an account?{' '}
                    <Link to="/login" className="link-rule font-medium text-ink">
                        Sign in
                    </Link>
                    .
                </p>
            </div>
        </AuthSheet>
    );
};

export default SignUpPage;
