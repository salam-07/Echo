import React from 'react';
import { PanelLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

const Navbar = ({ onToggleSidebar }) => {
    return (
        <div className="navbar bg-transparent px-3">
            <div className="navbar-start">
                <button
                    className="lg:hidden p-2 rounded text-base-content/50 hover:text-base-content hover:bg-base-200/50 transition-colors"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <PanelLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            <Link to="/" className="navbar-center">
                <ReactSVG src="/logo.svg" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </Link>

            <div className="navbar-end">
                <Link
                    to="/search"
                    className="p-2 rounded text-base-content/50 hover:text-base-content hover:bg-base-200/50 transition-colors"
                >
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;