import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="footer">
			<span>© {new Date().getFullYear()} Kingidy</span>
			<a href="#privacy">Privacy</a>
			<a href="#terms">Terms</a>
		</footer>
	);
};

export default Footer;
