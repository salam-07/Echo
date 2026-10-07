/** A brief loading screen while the app checks the session. */
const SplashScreen = () => (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="t-headline animate-set-in text-center">
            Echo
        </h1>
        <p role="status" className="t-body mt-5 text-ink-soft">
            Loading Echo...
        </p>
    </div>
);

export default SplashScreen;
