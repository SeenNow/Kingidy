/// <reference types="react" />

import React from 'react';

const Subjects: React.FC = () => {
	const subjects = [
		{
			name: 'Science',
			icon: 'fa-flask-vial',
			topics: ['Physics', 'Chemistry', 'Biology'],
			color: '#3b82f6'
		},
		{
			name: 'Mathematics',
			icon: 'fa-calculator',
			topics: ['Algebra', 'Geometry', 'Calculus'],
			color: '#8b5cf6'
		},
		{
			name: 'Law',
			icon: 'fa-gavel',
			topics: ['Constitutional', 'Criminal', 'Civil'],
			color: '#ec4899'
		},
		{
			name: 'Computer Science',
			icon: 'fa-laptop-code',
			topics: ['Programming', 'Data Structures', 'Algorithms'],
			color: '#f59e0b'
		},
		{
			name: 'History',
			icon: 'fa-landmark',
			topics: ['Ancient', 'Medieval', 'Modern'],
			color: '#10b981'
		},
		{
			name: 'Languages',
			icon: 'fa-language',
			topics: ['English', 'Spanish', 'French'],
			color: '#06b6d4'
		},
		{
			name: 'Economics',
			icon: 'fa-chart-pie',
			topics: ['Microeconomics', 'Macroeconomics', 'Finance'],
			color: '#f472b6'
		},
		{
			name: 'Literature',
			icon: 'fa-book-open',
			topics: ['Fiction', 'Poetry', 'Drama'],
			color: '#a78bfa'
		}
	];

	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">Browse Subjects</h1>
				<p className="page-subtitle">Master any subject with expert-curated content</p>
			</div>

			<div className="subjects-grid">
				{subjects.map((subject, idx) => (
					<div key={idx} className="subject-card" style={{ borderTopColor: subject.color }}>
						<div className="subject-icon" style={{ color: subject.color }}>
							<i className={`fas ${subject.icon}`}></i>
						</div>
						<h3 className="subject-name">{subject.name}</h3>
						<div className="subject-topics">
							{subject.topics.map((topic, tidx) => (
								<span key={tidx} className="topic-tag" style={{ borderColor: subject.color, color: subject.color }}>
									{topic}
								</span>
							))}
						</div>
						<button className="explore-btn" style={{ backgroundColor: subject.color }}>
							Explore <i className="fas fa-arrow-right"></i>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Subjects;
