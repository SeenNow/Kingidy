/// <reference types="react" />

import React, { useEffect, useRef } from 'react';

const InteractiveGridBackground: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const maxDistance = 250;

		// Handle mouse movement
		const handleMouseMove = (e: MouseEvent) => {
			const mouseX = e.clientX;
			const mouseY = e.clientY;

			gridItemsRef.current.forEach((item) => {
				if (!item) return;

				const rect = item.getBoundingClientRect();
				const itemX = rect.left + rect.width / 2;
				const itemY = rect.top + rect.height / 2;

				const dx = itemX - mouseX;
				const dy = itemY - mouseY;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Calculate angle towards mouse
				let angle = Math.atan2(dy, dx) * (180 / Math.PI);

				// Calculate influence (0 to 1)
				let influence = Math.max(0, 1 - distance / maxDistance);
				influence = influence * influence; // Smooth ease

				// Apply styles based on influence
				const plus = item.querySelector('.plus') as HTMLElement;
				if (plus) {
					const opacity = 0.3 + influence * 0.6;
					const scale = 1 + influence * 0.6;
					const blur = influence * 6;
					const rotation = angle;

					plus.style.color = `rgba(59, 130, 246, ${opacity})`;
					plus.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
					plus.style.filter = `drop-shadow(0 0 ${blur}px rgba(59, 130, 246, ${influence * 0.5}))`;
				}
			});
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	// Create grid items
	const gridItems = [];
	for (let i = 0; i < 150; i++) {
		gridItems.push(
			<div
				key={i}
				ref={(el) => {
					gridItemsRef.current[i] = el;
				}}
				className="grid-item"
			>
				<span className="plus">+</span>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="interactive-grid-bg">
			<div className="grid-container">{gridItems}</div>
		</div>
	);
};

export default InteractiveGridBackground;
