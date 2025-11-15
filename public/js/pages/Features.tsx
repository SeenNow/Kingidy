/// <reference types="react" />

import React, { useState, useEffect } from 'react';

const Features: React.FC = () => {
	const [currentFeature, setCurrentFeature] = useState(0);

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
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">Powerful Features</h1>
				<p className="page-subtitle">Everything you need to master any subject</p>
			</div>

			<div className="features-showcase">
				{/* Media Placeholder Section */}
				<div className="media-gallery-section">
					<div className="media-placeholder">
						<div className="media-placeholder-content">
							<i className={`fas ${currentFeatureData.icon}`}></i>
							<p>Video / Image Placeholder</p>
						</div>
					</div>
					<div className="media-info">
						<h2>{currentFeatureData.title}</h2>
						<p>{currentFeatureData.desc}</p>
					</div>
				</div>

				{/* Features Content Section */}
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
									<h3 className="feature-title">{feature.title}</h3>
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
			</div>
		</div>
	);
};

export default Features;
