import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './MobileNavigation.css';

const destinations = [
    { to: '/', label: 'Feed', end: true },
    { to: '/scrolls', label: 'Scrolls', end: true },
    { to: '/scrolls/curations', label: 'Curations' },
    { to: '/community', label: 'Community' },
    { to: '/browse/tags', label: 'Tags' },
];

/** A modal paper index: native focus containment and an always-reachable close. */
export default function MobileNavigation({ open, onClose }) {
    const dialogRef = useRef(null);
    const { authUser } = useAuthStore();

    useEffect(() => {
        if (!open) return;
        const dialog = dialogRef.current;
        const trigger = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';

        const desktop = window.matchMedia('(min-width: 1024px)');
        const closeOnDesktop = () => { if (desktop.matches) onClose(); };
        desktop.addEventListener('change', closeOnDesktop);
        closeOnDesktop();
        return () => {
            desktop.removeEventListener('change', closeOnDesktop);
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        };
    }, [open, onClose]);

    return (
        <dialog
            ref={dialogRef}
            id="mobile-navigation"
            aria-labelledby="mobile-navigation-title"
            className="mobile-index"
            onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const controls = event.currentTarget.querySelectorAll('a[href], button:not(:disabled)');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }}
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
            <div className="mobile-index__sheet">
                <header className="mobile-index__header">
                    <h2 id="mobile-navigation-title" className="t-subject">Navigation</h2>
                    <button type="button" className="mobile-index__close t-label" onClick={onClose} autoFocus>
                        Close
                    </button>
                </header>

                <div className="mobile-index__body">
                    <nav aria-label="Main navigation">
                        {destinations.map(({ to, label, end }) => (
                            <NavLink key={to} to={to} end={end} onClick={onClose} className="mobile-index__link">
                                {({ isActive }) => <>
                                    <span>{label}</span>
                                    {isActive && <span className="mobile-index__current">You’re here</span>}
                                </>}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mobile-index__actions">
                        <Link to="/new" onClick={onClose} className="act">Post an Echo</Link>
                        <Link to="/scroll/new" onClick={onClose} className="act act-outline">Create a Scroll</Link>
                    </div>
                    <div className="flex items-center">
                        <Link to="/search" onClick={onClose} className="mobile-index__utility t-label">Search</Link>
                        <Link to="/help" onClick={onClose} className="mobile-index__utility t-label">Help</Link>
                    </div>
                </div>

                <footer className="mobile-index__footer">
                    <Link to={`/user/${authUser?._id}`} onClick={onClose} className="mobile-index__profile">
                        <span className="mobile-index__username">@{authUser?.userName}</span>
                        <span className="t-label">View profile</span>
                    </Link>
                </footer>
            </div>
        </dialog>
    );
}
