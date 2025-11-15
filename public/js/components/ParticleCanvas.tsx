import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type ParticleCanvasProps = {
	active?: boolean;
	className?: string;
	onReady?: () => void;
};

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ active = true, className = '', onReady }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const animationRef = useRef<number | null>(null);
	const showTextTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		if (!active || !containerRef.current) return;

		const container = containerRef.current;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;
		camera.position.z = 5;

		// Particles: bluish and softened
		const particlesGeometry = new THREE.BufferGeometry();
		const particlesCount = 700;
		const posArray = new Float32Array(particlesCount * 3);
		for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;
		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.012,
			color: 0x79b7ff,
			transparent: true,
			opacity: 0.55,
			depthWrite: false,
		});

		const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
		scene.add(particlesMesh);

		// Show text after brief delay
		const showTextTimeout = window.setTimeout(() => {
			onReady?.();
		}, 500);
		showTextTimeoutRef.current = showTextTimeout;

		// Animation loop
		let time = 0;
		const animate = () => {
			animationRef.current = requestAnimationFrame(animate);
			time += 0.001;
			particlesMesh.rotation.y = time * 0.4;
			particlesMesh.rotation.x = time * 0.3;
			renderer.render(scene, camera);
		};
		animate();

		// Resize handler
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);

			// clear timeout if set
			if (showTextTimeoutRef.current) {
				clearTimeout(showTextTimeoutRef.current);
				showTextTimeoutRef.current = null;
			}

			// stop the animation
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}

			if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
				container.removeChild(rendererRef.current.domElement);
			}

			particlesGeometry.dispose();
			particlesMaterial.dispose();
			renderer.dispose();
			rendererRef.current = null;
		};
	}, [active, onReady]);

	// If not active, ensure any existing renderer is cleaned up
	useEffect(() => {
		if (active) return;
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		const renderer = rendererRef.current;
		if (renderer && containerRef.current?.contains(renderer.domElement)) {
			containerRef.current.removeChild(renderer.domElement);
		}
		if (renderer) {
			renderer.dispose();
			rendererRef.current = null;
		}
	}, [active]);

	return <div ref={containerRef} className={className} />;
};

export default ParticleCanvas;
