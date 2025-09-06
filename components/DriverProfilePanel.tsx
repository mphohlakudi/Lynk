

import React from 'react';
import { Driver } from '../types';
import { StarIcon } from './icons/StarIcon';

interface DriverProfilePanelProps {
    driver: Driver;
}

const DriverProfilePanel: React.FC<DriverProfilePanelProps> = ({ driver }) => {
    
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(driver.rating);
        const halfStar = driver.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={`full-${i}`} className="text-yellow-400" filled />);
        }
        if (halfStar) {
            stars.push(<StarIcon key="half" className="text-yellow-400" half />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="text-gray-600" />);
        }
        return stars;
    };

    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center gap-3">
            <img 
                src={driver.profilePictureUrl} 
                alt={driver.name} 
                className="w-24 h-24 rounded-full border-2 border-white object-cover"
            />
            <div className="text-center">
                <h2 className="text-xl font-bold text-white">{driver.name}</h2>
                <p className="text-sm text-gray-400">Taxi Driver</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex" aria-label={`Rating: ${driver.rating.toFixed(1)} out of 5 stars`}>{renderStars()}</div>
                <span className="font-bold text-white" aria-hidden="true">{driver.rating.toFixed(1)}</span>
            </div>
        </div>
    );
};

export default DriverProfilePanel;