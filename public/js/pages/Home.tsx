/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useEffect, useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import WordCarousel from '../components/WordCarousel';
import InteractiveGridBackground from '../components/InteractiveGridBackground';

const Home: React.FC = () => {
	const [showText, setShowText] = useState(false);
	const [currentFeature, setCurrentFeature] = useState(0);
	const words = ['Science', 'Maths', 'Law', 'Computer', 'Study'];

	const features = [
		{
			icon: 'fa-brain',
			title: 'Adaptive Learning',
			desc: 'Our AI engine adapts to your learning style and pace. Get personalized recommendations that evolve with your progress.',
			benefits: ['Smart content adjustment', 'Personalized difficulty levels', 'Real-time performance tracking']
		},
		{
			icon: 'fa-calendar',
			title: 'Smart Scheduling',
			desc: 'Stop worrying about when to study. Kingidy creates optimized study schedules based on your goals and availability.',
			benefits: ['Auto-generated study plans', 'Flexible time slots', 'Deadline tracking']
		},
		{
			icon: 'fa-book',
			title: 'Personalized Content',
			desc: 'Curated materials tailored just for you. From summaries to flashcards to practice problems, all customized to your needs.',
			benefits: ['Topic-focused summaries', 'Interactive flashcards', 'Custom exercises']
		},
		{
			icon: 'fa-chart-line',
			title: 'Progress Tracking',
			desc: 'Visualize your improvement with detailed analytics. Get actionable insights to keep progressing toward your goals.',
			benefits: ['Detailed analytics', 'Achievement milestones', 'Performance insights']
		},
		{
			icon: 'fa-users',
			title: 'Collaborative Learning',
			desc: 'Study with peers, share notes, and learn together. Build a community that supports your educational journey.',
			benefits: ['Study groups', 'Peer notes', 'Discussion forums']
		},
		{
			icon: 'fa-mobile',
			title: 'Learn Anywhere',
			desc: 'Access Kingidy on any device. Continue your studies seamlessly whether at home, school, or on the go.',
			benefits: ['Mobile app', 'Cross-device sync', 'Offline mode']
		}
	];

	useEffect(() => {
		setShowText(true);
	}, []);

	const rootClasses = `app-root ${showText ? 'show' : ''}`;

	const currentFeatureData = features[currentFeature];

	const handlePrevious = () => {
		setCurrentFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1));
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') handlePrevious();
			if (e.key === 'ArrowRight') handleNext();
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [features.length]);

	return (
		<div className={rootClasses}>
			<InteractiveGridBackground />
			<ParticleCanvas
				active={true}
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

			{/* Features Page Header Section */}
			<div className="features-page-header">
				<h2 className="features-page-title">Powerful Features</h2>
				<p className="features-page-subtitle">Everything you need to master any subject</p>
			</div>

			<section id="features" className="features" aria-labelledby="features-heading">
				<div className="feature-card" role="article" aria-label="Adaptive Learning">
					<div className="feature-icon"><i className="fas fa-brain"></i></div>
					<div className="feature-title">Adaptive Learning</div>
					<div className="feature-desc">Content and quizzes adapt to your progress, helping you focus on what matters.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Smart Scheduling">
					<div className="feature-icon"><i className="fas fa-calendar"></i></div>
					<div className="feature-title">Smart Scheduling</div>
					<div className="feature-desc">Auto-generated study plans align with your goals and availability.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Personalized Content">
					<div className="feature-icon"><i className="fas fa-book"></i></div>
					<div className="feature-title">Personalized Content</div>
					<div className="feature-desc">Get topic-focused summaries, flashcards, and exercises tailored to you.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Progress Tracking">
					<div className="feature-icon"><i className="fas fa-chart-line"></i></div>
					<div className="feature-title">Progress Tracking</div>
					<div className="feature-desc">Visualize your improvements and get actionable insights to keep progressing.</div>
				</div>
			</section>

			{/* Features Carousel Section */}
			<section className="features-showcase">
				{/* Media Gallery Section - 2/3 Width */}
				<div className="media-gallery-section">
					<div className="media-placeholder">
						<div className="media-placeholder-content">
							<i className={`fas ${currentFeatureData.icon}`}></i>
							<p>Video / Image Placeholder</p>
						</div>
					</div>
					<div className="media-info">
						<h3>{currentFeatureData.title}</h3>
						<p>{currentFeatureData.desc}</p>
					</div>
				</div>

				{/* Features Content Section - 1/3 Width */}
				<div className="features-content-section">
					<div className="features-list">
						{features.map((feature, idx) => (
							<div
								key={idx}
								className={`feature-card-carousel ${currentFeature === idx ? 'active' : ''}`}
								onClick={() => setCurrentFeature(idx)}
								role="button"
								tabIndex={0}
								onKeyPress={(e) => {
									if (e.key === 'Enter' || e.key === ' ') setCurrentFeature(idx);
								}}
							>
								<div className="feature-icon">
									<i className={`fas ${feature.icon}`}></i>
								</div>
								<div className="feature-info">
									<h4 className="feature-title">{feature.title}</h4>
									<p className="feature-desc">{feature.desc}</p>
									<ul className="feature-benefits">
										{feature.benefits.map((benefit, bidx) => (
											<li key={bidx} className="benefit-item">
												<i className="fas fa-check"></i>
												<span>{benefit}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>

					{/* Navigation Controls */}
					<div className="carousel-controls">
						<button
							className="carousel-btn prev-btn"
							onClick={handlePrevious}
							aria-label="Previous feature"
							title="Previous (← arrow key)"
						>
							<i className="fas fa-chevron-left"></i>
						</button>
						<div className="carousel-indicators">
							{features.map((_, idx) => (
								<button
									key={idx}
									className={`indicator-dot ${currentFeature === idx ? 'active' : ''}`}
									onClick={() => setCurrentFeature(idx)}
									aria-label={`Go to feature ${idx + 1}`}
									aria-current={currentFeature === idx ? 'true' : 'false'}
								/>
							))}
						</div>
						<button
							className="carousel-btn next-btn"
							onClick={handleNext}
							aria-label="Next feature"
							title="Next (→ arrow key)"
						>
							<i className="fas fa-chevron-right"></i>
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
