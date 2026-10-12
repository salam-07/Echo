import { ArrowUpRight, X } from 'lucide-react';
import { BAITHAK_URL } from '../../lib/baithak';
import './Baithak.css';

export function BaithakLink({ children, className = '', onClick }) {
    return <a href={BAITHAK_URL} target="_blank" rel="noopener noreferrer" className={`baithak-link ${className}`} onClick={onClick}>
        {children}<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
    </a>;
}

export default function BaithakPromo({ variant, onDismiss }) {
    return <section className={`baithak baithak-promo baithak-promo--${variant}`} aria-label="Baithak by Echo">
        <button className="baithak-dismiss" onClick={onDismiss} aria-label="Dismiss Baithak promotion for seven days"><X size={18} aria-hidden="true" /></button>
        <img className="baithak-small-mark" src="/baithak.svg" alt="Baithak" width="140" height="82" />
        <div className="baithak-promo-copy">
            <p className="baithak-name">baithak <span>By Echo</span></p>
            <h2>Punjab’s stories.<br />Our shared inheritance.</h2>
            <p>A place to share and discover Punjab’s folk stories. An initiative by Echo to preserve Punjabi heritage and folklore.</p>
            <BaithakLink onClick={onDismiss}>Discover Baithak</BaithakLink>
        </div>
    </section>;
}
