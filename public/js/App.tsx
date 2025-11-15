/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import NavBar from './components/NavBar';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showText, setShowText] = useState(false);
    const [visibleWords, setVisibleWords] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);

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
        
        let wordIndex = 0;
        const interval = setInterval(() => {
            if (wordIndex < words.length) {
                setVisibleWords((prev) => [...prev, wordIndex]);
                wordIndex++;
                
                // If this was the last word, wait then clear everything
                if (wordIndex >= words.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsComplete(true);
                    }, 2000);
                }
            }
        }, 1500); // Each word appears every 1.5 seconds
        
        return () => clearInterval(interval);
    }, [showText, words.length]);

    const rootClasses = `app-root ${showText ? 'show' : ''} ${isComplete ? 'empty' : ''}`;

    if (isComplete) {
        return <div className="app-root empty"></div>;
    }

    return (
        <div className={rootClasses}>
            <NavBar />

            <div ref={canvasRef} className="canvas-layer" />

            <div className={`content ${showText ? 'show' : ''}`}>
                <div className="content-text">
                    <h1 className="title">Kingidy for</h1>
                    <p className="sub">Your Personalized Study Buddy</p>
                </div>
            </div>

            <div className={`word-container-right ${showText ? 'show' : ''}`}>
                <div className="word-list">
                    {words.map((word, index) => {
                        const isVisible = visibleWords.includes(index);
                        const classes = `word ${isVisible ? 'visible' : ''} word-color-${index}`;
                        return (
                            <h2 
                                key={word} 
                                className={classes}
                            >
                                {word}
                            </h2>
                        );
                    })}
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
