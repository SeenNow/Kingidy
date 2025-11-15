/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showText, setShowText] = useState(false);
    const [currentWord, setCurrentWord] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const words = ['Science', 'Maths', 'Law', 'Computer', 'Study'];

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        camera.position.z = 5;

        // Particles: bluish and softened
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.012,
            color: 0x79b7ff,      // bluish
            transparent: true,
            opacity: 0.55,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Show text after a brief delay
        setTimeout(() => setShowText(true), 500);

        // Animation loop
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.001;
            particlesMesh.rotation.y = time * 0.4;
            particlesMesh.rotation.x = time * 0.3;
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            canvasRef.current?.removeChild(renderer.domElement);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!showText) return;
        const interval = setInterval(() => {
            setCurrentWord((prev) => {
                if (prev < words.length - 1) return prev + 1;
                clearInterval(interval);
                setIsAnimating(false);
                return prev;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [showText]);

    const rootClasses = `app-root ${showText ? 'show' : ''}`;

    return (
        <div className={rootClasses}>
            <nav className="nav" role="navigation" aria-label="Main Navigation">
                <div className="nav-left"><div className="logo">Kingidy</div></div>
                <div className="nav-right">
                    <div className="nav-links">
                        <a className="nav-link" href="#home">Home</a>
                        <a className="nav-link" href="#features">Features</a>
                        <a className="nav-link" href="#subjects">Subjects</a>
                        <a className="nav-link" href="#about">About</a>
                    </div>
                    <a className="nav-cta" href="#get-started">Get Started</a>
                </div>
            </nav>

            <div ref={canvasRef} className="canvas-layer" />

            <div className={`content ${showText ? 'show' : ''}`}>
                <div className="content-text">
                    <h1 className="title">Kingidy for</h1>

                    <div className="word-container">
                        {words.map((word, index) => {
                            const isActive = index === currentWord;
                            const isFinal = index === words.length - 1;
                            const finalGlow = !isAnimating && isActive && isFinal ? 'glow' : '';
                            const classes = `word ${isActive ? 'active' : ''} ${isFinal ? 'final' : ''} ${finalGlow}`;
                            return (
                                <h2 key={word} className={classes}>
                                    "{word}"
                                </h2>
                            );
                        })}
                    </div>

                    <p className="sub">Your Personalized Study Buddy</p>
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

            <footer className="footer">
                <span>© {new Date().getFullYear()} Kingidy</span>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
            </footer>
        </div>
    );
};

export default App;
