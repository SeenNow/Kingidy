/// <reference types="react" />

import React from 'react';
import FeatureShowcase, { defaultFeatures } from '../components/FeatureShowcase';

const Features: React.FC = () => {
  return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">Powerful Features</h1>
				<p className="page-subtitle">Everything you need to master any subject</p>
			</div>

			<div className="features-showcase">
				<FeatureShowcase features={defaultFeatures} />
			</div>
		</div>
	);
};

export default Features;
