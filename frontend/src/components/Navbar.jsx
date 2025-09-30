import { PanelLeft, Search } from "lucide-react";

const Navbar = () => {
    return (
        <div className="navbar bg-transparent">
            <div className="navbar-start mt-0 pt-0">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <PanelLeft />
                    </div>
                </div>
            </div>
            <div className="navbar-center">
                <img
                    src="/logo_only.png"
                    alt="Logo"
                    className="h-6 w-auto"
                />
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <Search />
                </button>
            </div>
        </div>
    );
};

export default Navbar;