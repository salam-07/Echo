import React from 'react';
import { PanelLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { IconButton } from '../ui';

const Navbar = ({ onToggleSidebar }) => {
    return (
        <div className="navbar bg-transparent">
            <div className="navbar-start mt-0 pt-0">
                <IconButton
                    className="lg:hidden"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    variant="ghost"
                >
                    <PanelLeft />
                </IconButton>
            </div>

            <Link to="/" className="navbar-center lg:relative lg:right-30">
                <ReactSVG src="/logo.svg" className="h-6 w-auto" />
            </Link>

            <div className="navbar-end">
                <IconButton variant="ghost">
                    <Search />
                </IconButton>
            </div>
        </div>
    );
};

export default Navbar;