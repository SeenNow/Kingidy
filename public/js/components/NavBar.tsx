/// <reference types="react" />

import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="nav" role="navigation" aria-label="Main Navigation">
            <div className="nav-left">
                <div className="logo">Kingidy</div>
            </div>
            <div className="nav-right">
                <div className="nav-links">
                    <a className="nav-link" href="#home">Home</a>
                    <a className="nav-link" href="#features">Features</a>
                    <a className="nav-link" href="#subjects">Subjects</a>
                    <a className="nav-link" href="#about">About</a>
                </div>
                <a className="nav-cta" href="#get-started">Get Started</a>
            </div>
        </nav>
    );
};

export default NavBar;

