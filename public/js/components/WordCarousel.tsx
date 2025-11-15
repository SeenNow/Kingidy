import React, { useEffect, useMemo, useRef, useState } from 'react';

interface WordCarouselProps {
	words: string[];
	showText: boolean;
	animationsActive: boolean;
}

const WordCarousel: React.FC<WordCarouselProps> = ({ words, showText, animationsActive }) => {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const prefersReducedMotionRef = useRef<boolean>(
		typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
	);

	const containerStyle = useMemo<React.CSSProperties>(() => ({
		opacity: (animationsActive || showText) ? 1 : 0,
		visibility: (animationsActive || showText) ? 'visible' : 'hidden',
		transition: 'opacity 0.3s ease, visibility 0.3s ease',
	}), [animationsActive, showText]);

	useEffect(() => {
		if (!showText || !animationsActive) return;

		const currentWord = words[currentWordIndex];
		const letterIntervalMs = prefersReducedMotionRef.current ? 300 : 60;
		
		let letterIdx = 0;
		const letterInterval = window.setInterval(() => {
			if (letterIdx < currentWord.length) {
				setCurrentLetterIndex(letterIdx);
				letterIdx++;
			} else {
				clearInterval(letterInterval);
				// Move to next word after word is complete
				const wordIntervalMs = prefersReducedMotionRef.current ? 3000 : 1500;
				setTimeout(() => {
					setCurrentWordIndex((prev) => (prev + 1) % words.length);
					setCurrentLetterIndex(0);
				}, wordIntervalMs);
			}
		}, letterIntervalMs);

		return () => clearInterval(letterInterval);
	}, [showText, animationsActive, words.length, currentWordIndex, words]);

	return (
		<div
			className={`word-container-right ${(animationsActive || showText) ? 'show' : ''}`}
			aria-hidden={!showText}
			style={containerStyle}
		>
			<div className="word-viewport" role="status" aria-live="polite">
				<div className="word-list">
					{words[currentWordIndex].split('').map((letter, idx) => (
						<span
							key={`${words[currentWordIndex]}-${idx}`}
							className={`letter letter-color-${currentWordIndex} ${idx <= currentLetterIndex ? 'visible' : ''}`}
						>
							{letter}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default WordCarousel;
