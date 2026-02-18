import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Destination = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const planetData = {
        name: id.charAt(0).toUpperCase() + id.slice(1),
        description: "The Red Planet. Dusty, cold, and perfect for adventure.",
        distance: "225 million km",
        travelTime: "3 Days (Hyper-Warp)",
        price: "$499,999",
    };

    return (
        <div style={{ padding: '20px', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>&larr; Back to Home</button>

            <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px' }}>
                <h2>Destination: {planetData.name}</h2>
                <p><strong>Description:</strong> {planetData.description}</p>
                <p><strong>Distance from Earth:</strong> {planetData.distance}</p>
                <p><strong>Travel Time:</strong> {planetData.travelTime}</p>
                <p><strong>Price:</strong> {planetData.price}</p>

                <div style={{ marginTop: '20px', height: '200px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Placeholder for visuals */}
                    <span>[ Planet Visuals Placeholder ]</span>
                </div>

                <button style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold' }}>
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default Destination;
