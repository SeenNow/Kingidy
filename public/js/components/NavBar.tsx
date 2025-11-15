/// <reference types="react" />

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, NAV_LINKS } from '../constants/routes';

const NavBar: React.FC = () => {
    return (
        <nav className="nav" role="navigation" aria-label="Main Navigation">
            <div className="nav-left">
                <Link to={ROUTES.HOME} className="logo">Kingidy</Link>
            </div>
            <div className="nav-right">
                <div className="nav-links">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.path} to={link.path} className="nav-link">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <Link to={ROUTES.HOME} className="nav-cta">Get Started</Link>
            </div>
        </nav>
    );
};

export default NavBar;

