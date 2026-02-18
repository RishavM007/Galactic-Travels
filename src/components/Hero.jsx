import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Galactic Travels</h1>
            <p>Experience the universe like never before.</p>
            <div style={{ margin: '20px 0', border: '1px dashed #666', padding: '20px' }}>
                {/* Placeholder for 3D Scene */}
                <p style={{ color: '#888' }}>[ 3D Scene Placeholder ]</p>
                <p style={{ fontSize: '0.8rem' }}>*Candidate: Add your Three.js magic here!*</p>
            </div>
            <button
                onClick={() => navigate('/destination/mars')}
                style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}
            >
                Book a Trip to Mars
            </button>
        </div>
    );
};

export default Hero;
