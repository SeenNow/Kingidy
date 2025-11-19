/// <reference types="react" />

import React, { useEffect, useRef, useState } from 'react';

interface GridItem {
	id: number;
	x: number;
	y: number;
	rotation: number;
	scale?: number;
}

const HeroGridBackground: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [gridItems, setGridItems] = useState<GridItem[]>([]);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const animationFrameRef = useRef<number>();

	useEffect(() => {
		// Generate grid items
		const cols = Math.ceil(window.innerWidth / 40);
		const rows = Math.ceil((window.innerHeight * 0.8) / 40);
		const items: GridItem[] = [];

		for (let i = 0; i < cols * rows; i++) {
			items.push({
				id: i,
				x: (i % cols) * 40,
				y: Math.floor(i / cols) * 40,
				rotation: 0,
			});
		}

		setGridItems(items);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	useEffect(() => {
		const updateRotations = () => {
			setGridItems((prevItems) =>
				prevItems.map((item) => {
					const dx = mousePos.x - (item.x + 20);
					const dy = mousePos.y - (item.y + 20);
					const distance = Math.sqrt(dx * dx + dy * dy);
					const maxDistance = 400;

					// Calculate rotation based on distance and position
					let rotation = 0;
					let scale = 1;
					if (distance < maxDistance) {
						const angle = Math.atan2(dy, dx);
						const influence = 1 - distance / maxDistance;
						rotation = angle * influence * 45; // Scale the influence
						scale = 1 + influence * 0.8; // Scale up to 1.8x at center
					}

					return { ...item, rotation, scale };
				})
			);

			animationFrameRef.current = requestAnimationFrame(updateRotations);
		};

		animationFrameRef.current = requestAnimationFrame(updateRotations);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [mousePos]);

	return (
		<div ref={containerRef} className="hero-grid-background">
			{gridItems.map((item) => (
				<div
					key={item.id}
					className="grid-plus"
					style={{ ['--x' as any]: `${item.x}px`, ['--y' as any]: `${item.y}px`, ['--rotation' as any]: `${item.rotation}deg`, ['--scale' as any]: `${item.scale || 1}` }}
				>
					<span>+</span>
				</div>
			))}
		</div>
	);
};

export default HeroGridBackground;
