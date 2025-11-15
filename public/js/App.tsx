/// <reference types="react" />
/// <reference types="react-dom" />

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Subjects from './pages/Subjects';
import About from './pages/About';
import { ROUTES } from './constants/routes';

const App: React.FC = () => {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path={ROUTES.HOME} element={<Home />} />
				<Route path={ROUTES.FEATURES} element={<Features />} />
				<Route path={ROUTES.SUBJECTS} element={<Subjects />} />
				<Route path={ROUTES.ABOUT} element={<About />} />
			</Routes>
			<Footer />
		</>
	);
};

export default App;
