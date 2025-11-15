/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useRef, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';

const App: React.FC = () => {
	const canvasRef = useRef<HTMLDivElement>(null);

	const [showText, setShowText] = useState(false);
	const [animationsActive, setAnimationsActive] = useState(true);

	// slot animation
	const [slotIndex, setSlotIndex] = useState(0);
	const slotIndexRef = useRef<number>(0);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const wordListRef = useRef<HTMLDivElement | null>(null);
	const [itemHeight, setItemHeight] = useState<number>(64); // increased fallback height

	// prefer reduced motion
	const prefersReducedMotionRef = useRef<boolean>(
		typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
	);

	const words = ['Science', 'Maths', 'Law', 'Computer', 'Study'];

	// Clearable showText timeout ref (cleanly clear at unmount)
	const showTextTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		// Slot animation logic (CSS transform driven) -- independent of three.js
		if (!showText || !animationsActive) return;

		// measure item height once the words are visible
		const measureHeight = () => {
			const firstChild = wordListRef.current?.querySelector('.word') as HTMLElement | null;
			if (firstChild) {
				setItemHeight(firstChild.offsetHeight || 48);
			}
		};

		measureHeight();
		window.addEventListener('resize', measureHeight);

		// Setup event listener for wrap-reset using duplicated list trick
		const sliderEl = wordListRef.current;
		const safeHandleTransitionEnd = () => {
			if (slotIndexRef.current >= words.length) {
				// Remove transition and do instant snap back to start
				setIsTransitioning(false);

				setSlotIndex((prev) => {
					const newIndex = prev - words.length;
					slotIndexRef.current = newIndex;
					return newIndex;
				});

				// Re-enable transition on next frame so subsequent moves animate normally
				requestAnimationFrame(() => {
					setTimeout(() => setIsTransitioning(true), 20);
				});
			}
		};

		if (sliderEl) {
			sliderEl.addEventListener('transitionend', safeHandleTransitionEnd);
		}

		// Respect OS-level reduced motion preference
		const isReduced = prefersReducedMotionRef.current;
		const intervalMs = isReduced ? 3000 : 1500;

		// set up endless slot reel animation
		const interval = window.setInterval(() => {
			setSlotIndex((prev) => {
				const next = prev + 1;
				slotIndexRef.current = next;
				return next;
			});
		}, intervalMs);

		return () => {
			clearInterval(interval);
			window.removeEventListener('resize', measureHeight);
			if (sliderEl) sliderEl.removeEventListener('transitionend', safeHandleTransitionEnd);
		};
	}, [showText, animationsActive, words.length]);

	// stop THREE render when animation canvas is turned off (safeguard)
	useEffect(() => {
		if (animationsActive) return;
	}, [animationsActive]);

	// Keep root visible and show content, but use animationsActive to control animation elements
	const rootClasses = `app-root ${showText ? 'show' : ''}`;

	// Render: duplicate words array so sliding can continue into second copy then snap to start
	const doubledWords = [...words, ...words];

	// Inline CSS for slot reel / ensure consistent layout independent of external CSS
	const viewportStyle: React.CSSProperties = {
		height: itemHeight,
		overflow: 'hidden',
		display: 'flex',
		alignItems: 'center',
		width: 240, // slightly larger width for visibility
		position: 'absolute', // ensure visible on the page
		top: 160,               // position near the top-right
		right: 48,
		zIndex: 40,             // ensure it's above the threejs canvas
		pointerEvents: 'none',  // prevent blocking clicks on the canvas/other elements
	};

	const sliderStyle: React.CSSProperties = {
		transform: `translateY(-${slotIndex * itemHeight}px)`,
		transition:
			isTransitioning && !prefersReducedMotionRef.current ? 'transform 0.55s cubic-bezier(.2,.8,.2,1)' : 'none',
		willChange: 'transform',
		display: 'block',
	};

	const wordStyle: React.CSSProperties = {
		height: itemHeight,
		margin: 0,
		padding: '6px 10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		fontSize: 20,
		color: '#063642',        // dark teal for better contrast vs pale background
		fontWeight: 700,         // make the words bolder to stand out
		pointerEvents: 'auto',   // words can be interacted with if needed in the future
	};

	return (
		<div className={rootClasses}>
			<NavBar />

			{/* Particle canvas component - Three.js handled inside */}
			<ParticleCanvas
				active={animationsActive}
				className={`canvas-layer ${animationsActive ? 'show' : ''}`}
				onReady={() => setShowText(true)}
			/>

			{/* Keep primary content visible always */}
			<div className={`content ${showText ? 'show' : ''}`}>
				<div className="content-text">
					<h1 className="title">Kingidy for</h1>
					<p className="sub">Your Personalized Study Buddy</p>
				</div>
			</div>

			{/* word container now acts as a CSS/JS slot machine reel (not driven by three.js) */}
			<div className={`word-container-right ${animationsActive ? 'show' : ''}`} aria-hidden={!showText}>
				{/* accessible live region, viewport restricts visible area */}
				<div className="word-viewport" style={viewportStyle} role="status" aria-live="polite">
					<div ref={wordListRef} className="word-list slider" style={sliderStyle}>
						{doubledWords.map((word, idx) => {
							const classes = `word word-color-${idx % words.length}`;
							return (
								<h2 key={`${word}-${idx}`} className={classes} style={wordStyle}>
									{word}
								</h2>
							);
						})}
					</div>
				</div>
			</div>

			{/* Features section */}
			<section id="features" className="features" aria-labelledby="features-heading">
				<div className="feature-card" role="article" aria-label="Adaptive Learning">
					<div className="feature-icon">🧠</div>
					<div className="feature-title">Adaptive Learning</div>
					<div className="feature-desc">Content and quizzes adapt to your progress, helping you focus on what matters.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Smart Scheduling">
					<div className="feature-icon">📅</div>
					<div className="feature-title">Smart Scheduling</div>
					<div className="feature-desc">Auto-generated study plans align with your goals and availability.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Personalized Content">
					<div className="feature-icon">📚</div>
					<div className="feature-title">Personalized Content</div>
					<div className="feature-desc">Get topic-focused summaries, flashcards, and exercises tailored to you.</div>
				</div>

				<div className="feature-card" role="article" aria-label="Progress Tracking">
					<div className="feature-icon">📈</div>
					<div className="feature-title">Progress Tracking</div>
					<div className="feature-desc">Visualize your improvements and get actionable insights to keep progressing.</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default App;
