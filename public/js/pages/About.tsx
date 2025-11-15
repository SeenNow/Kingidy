/// <reference types="react" />

import React from 'react';
import { CONTACT } from '../constants/routes';

const About: React.FC = () => {
	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">About Kingidy</h1>
				<p className="page-subtitle">Transforming education through AI-powered personalization</p>
			</div>

			<div className="about-content">
				<section className="about-section">
					<h2>Our Mission</h2>
					<p>
						At Kingidy, we believe that every student deserves a personalized learning experience. Our mission is to 
						leverage artificial intelligence to make quality education accessible, engaging, and effective for learners 
						of all backgrounds and abilities.
					</p>
				</section>

				<section className="about-section">
					<h2>Why Kingidy?</h2>
					<div className="why-grid">
						<div className="why-card">
							<i className="fas fa-lightbulb"></i>
							<h3>Innovation</h3>
							<p>Cutting-edge AI technology that adapts to each student's unique learning style.</p>
						</div>
						<div className="why-card">
							<i className="fas fa-star"></i>
							<h3>Quality</h3>
							<p>Expert-curated content from educators and subject matter specialists.</p>
						</div>
						<div className="why-card">
							<i className="fas fa-users"></i>
							<h3>Community</h3>
							<p>Join thousands of students collaborating and supporting each other's success.</p>
						</div>
						<div className="why-card">
							<i className="fas fa-rocket"></i>
							<h3>Results</h3>
							<p>Proven track record of improving grades and learning outcomes.</p>
						</div>
					</div>
				</section>

				<section className="about-section">
					<h2>Our Story</h2>
					<p>
						Founded in 2024, Kingidy started with a simple observation: traditional one-size-fits-all education wasn't 
						working for everyone. Our team of educators and technologists came together to build a platform that truly 
						understands each student's needs.
					</p>
					<p>
						What began as a small project has grown into a comprehensive learning platform used by thousands of students 
						worldwide. We continue to innovate and improve, always keeping student success at the heart of everything we do.
					</p>
				</section>

				<section className="about-section">
					<h2>By the Numbers</h2>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-number">50K+</div>
							<div className="stat-label">Active Learners</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">1M+</div>
							<div className="stat-label">Study Sessions</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">95%</div>
							<div className="stat-label">Satisfaction Rate</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">150+</div>
							<div className="stat-label">Subjects Covered</div>
						</div>
					</div>
				</section>

				<section className="about-section team-section">
					<h2>Get in Touch</h2>
					<p>Have questions? We'd love to hear from you!</p>
					<div className="contact-buttons">
						<a href={`mailto:${CONTACT.EMAIL}`} className="contact-btn">
							<i className="fas fa-envelope"></i> Email Us
						</a>
						<a href="#" className="contact-btn">
							<i className="fas fa-comments"></i> Chat Support
						</a>
						<a href="#" className="contact-btn">
							<i className="fas fa-phone"></i> Call Us
						</a>
					</div>
				</section>
			</div>
		</div>
	);
};

export default About;
