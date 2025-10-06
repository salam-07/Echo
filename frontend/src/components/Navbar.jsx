import { PanelLeft, Search } from "lucide-react";
import React from 'react';
import { ReactSVG } from "react-svg";

const Navbar = ({ onToggleSidebar }) => {
    return (
        <div className="navbar bg-transparent ">
            <div className="navbar-start mt-0 pt-0">
                <button
                    className="btn btn-ghost btn-circle lg:hidden"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <PanelLeft />
                </button>
            </div>
            <div className="navbar-center lg:relative lg:right-30">
                <ReactSVG src="/logo.svg" className="h-6 w-auto"
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