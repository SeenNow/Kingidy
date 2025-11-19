/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useEffect, useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import WordCarousel from '../components/WordCarousel';
import HeroGridBackground from '../components/HeroGridBackground';
import FeatureShowcase, { defaultFeatures } from '../components/FeatureShowcase';

const Home: React.FC = () => {
	const [showText, setShowText] = useState(false);
  
	const words = ['Science', 'Maths', 'Law', 'Computer', 'Study'];


	useEffect(() => {
		setShowText(true);
	}, []);

	const rootClasses = `app-root ${showText ? 'show' : ''}`;

  

	return (
		<div className={rootClasses}>
			
			{/* Hero Section */}
			<section className="hero-section">
				<HeroGridBackground />
				
				<ParticleCanvas
					active={false}
					className={`canvas-layer show`}
					onReady={() => setShowText(true)}
				/>

				<div className={`content ${showText ? 'show' : ''}`}>
					<div className="content-text">
						<h1 className="title">Kingidy for</h1>
						<p className="sub">Your Personalized Study Buddy</p>
					</div>
				</div>

				<WordCarousel
					words={words}
					showText={showText}
					animationsActive={true}
				/>
			</section>



				{/* Features Carousel Section */}
				<div className="home-features-showcase">
					<FeatureShowcase features={defaultFeatures} className="home-features-showcase" />
				</div>
		</div>
	);
};

export default Home;
