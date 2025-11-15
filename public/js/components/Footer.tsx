import React from 'react';
import { SOCIAL_LINKS } from '../constants/routes';

const Footer: React.FC = () => {
	return (
		<footer className="footer">
			<span>© {new Date().getFullYear()} Kingidy</span>
			<a href={SOCIAL_LINKS.PRIVACY}>Privacy</a>
			<a href={SOCIAL_LINKS.TERMS}>Terms</a>
		</footer>
	);
};

export default Footer;
