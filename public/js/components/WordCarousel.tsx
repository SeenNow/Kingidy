import React, { useEffect, useRef, useState } from 'react';

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

	// Container visibility handled via className + CSS (components.css)

	const viewportRef = useRef<HTMLDivElement | null>(null);
	const wordListRef = useRef<HTMLDivElement | null>(null);
	const [pillWidth, setPillWidth] = useState<number | null>(null);
	const [pillLeft, setPillLeft] = useState<number | null>(null);

	const [isPulsing, setIsPulsing] = useState(false);
	const pulseTimerRef = useRef<number | null>(null);

	const triggerPulse = (ms = 260) => {
		setIsPulsing(true);
		if (pulseTimerRef.current) {
			window.clearTimeout(pulseTimerRef.current);
			pulseTimerRef.current = null;
		}
		pulseTimerRef.current = window.setTimeout(() => {
			setIsPulsing(false);
			pulseTimerRef.current = null;
		}, ms);
	};

	useEffect(() => {
		// update pill width whenever content changes or window resizes
		const updateWidth = () => {
			const el = wordListRef.current;
			const vp = viewportRef.current;
			if (!el || !vp) return;
			const listRect = el.getBoundingClientRect();
			const vpRect = vp.getBoundingClientRect();
			const paddingPx = 24; // left+right padding for pill
			const maxWidth = Math.max(0, vpRect.width - 48); // leave margin on both sides
			let widthWithPad = Math.min(listRect.width + paddingPx, maxWidth);
			// apply a min width to avoid tiny pills
			const minWidth = 88;
			if (widthWithPad < minWidth) widthWithPad = minWidth;
			setPillWidth(widthWithPad);
			// center of list relative to viewport
			const centerX = listRect.left - vpRect.left + listRect.width / 2;
			// clamp so the pill doesn't overflow left/right
			const clampedX = Math.max(widthWithPad / 2, Math.min(centerX, vpRect.width - widthWithPad / 2));
			setPillLeft(clampedX);
		};

		updateWidth();

		const ro = typeof (window as any).ResizeObserver !== 'undefined' ? new (window as any).ResizeObserver(updateWidth) : null;
		if (ro && wordListRef.current) ro.observe(wordListRef.current);
		window.addEventListener('resize', updateWidth);
		return () => {
			if (ro && wordListRef.current) ro.unobserve(wordListRef.current);
			window.removeEventListener('resize', updateWidth);
			if (ro) ro.disconnect();
		};
	}, [words, currentWordIndex, currentLetterIndex]);

    
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
					triggerPulse();
					setCurrentWordIndex((prev) => (prev + 1) % words.length);
					setCurrentLetterIndex(0);
				}, wordIntervalMs);
			}
		}, letterIntervalMs);

		return () => clearInterval(letterInterval);
	}, [showText, animationsActive, words.length, currentWordIndex, words]);

	// Trigger pulse whenever the active word index changes (manually or auto)
	useEffect(() => {
		if (currentWordIndex !== undefined) {
			triggerPulse();
		}
		return;
	}, [currentWordIndex]);

	// Cleanup pulse timer on unmount
	useEffect(() => {
		return () => {
			if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
		};
	}, []);

	return (
		<div className={`word-container-right ${(animationsActive || showText) ? 'show' : ''}`} aria-hidden={!showText}>
			<div className={`word-viewport ${isPulsing ? 'pulse' : ''}`} role="status" aria-live="polite" ref={viewportRef}>
						<div className="word-pill" style={{ ['--pill-width' as any]: pillWidth ? `${pillWidth}px` : undefined, ['--pill-left' as any]: pillLeft ? `${pillLeft}px` : undefined }} aria-hidden>
							{/* Decorative pill background */}
						</div>
						<div className="word-list" ref={wordListRef}>
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
