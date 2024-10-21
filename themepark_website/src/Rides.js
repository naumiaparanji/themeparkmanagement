import React from 'react';
import './Rides.css'; // Make sure to create this CSS file for styling

const ridesData = [
    // Array of ride objects with categories
    { id: 1, name: 'Thunder Mountain', category: 'Land', ageLimit: 8, heightLimit: '42 inches', restrictions: 'No heart conditions' },
    { id: 2, name: 'Splash Water Ride', category: 'Water', ageLimit: 6, heightLimit: '36 inches', restrictions: 'Must wear life jacket' },
    { id: 3, name: 'Adventure River', category: 'Water', ageLimit: 5, heightLimit: '40 inches', restrictions: 'Supervision required' },
    { id: 4, name: 'Dragon Roller Coaster', category: 'Land', ageLimit: 10, heightLimit: '48 inches', restrictions: 'Pregnant women not allowed' },
    { id: 5, name: 'Pirate Ship', category: 'Hybrid', ageLimit: 7, heightLimit: '40 inches', restrictions: 'No loose items' },
    { id: 6, name: 'Sky Dive', category: 'Hybrid', ageLimit: 12, heightLimit: '54 inches', restrictions: 'No back problems' },
    { id: 7, name: 'Wave Pool', category: 'Water', ageLimit: 4, heightLimit: '30 inches', restrictions: 'Must be with an adult' },
    { id: 8, name: 'Haunted Mansion', category: 'Land', ageLimit: 10, heightLimit: 'None', restrictions: 'No pregnant women' },
    { id: 9, name: 'Zipline Adventure', category: 'Hybrid', ageLimit: 8, heightLimit: '42 inches', restrictions: 'Max weight 250 lbs' },
    { id: 10, name: 'Kiddie Carousel', category: 'Land', ageLimit: 2, heightLimit: 'None', restrictions: 'Adult supervision required' },
    { id: 11, name: 'Lazy River', category: 'Water', ageLimit: 0, heightLimit: 'None', restrictions: 'Must wear a life jacket for kids' },
    { id: 12, name: 'Twister Slide', category: 'Water', ageLimit: 6, heightLimit: '42 inches', restrictions: 'No jewelry' },
    { id: 13, name: 'Bumper Cars', category: 'Land', ageLimit: 4, heightLimit: 'None', restrictions: 'Must be seated at all times' },
    { id: 14, name: 'Super Splash', category: 'Water', ageLimit: 8, heightLimit: '44 inches', restrictions: 'Must be able to swim' },
    { id: 15, name: 'Family Coaster', category: 'Hybrid', ageLimit: 6, heightLimit: '38 inches', restrictions: 'Children must be accompanied' },
    { id: 16, name: 'Rock Climbing Wall', category: 'Land', ageLimit: 10, heightLimit: 'None', restrictions: 'Waiver required' },
    { id: 17, name: 'Wet and Wild', category: 'Water', ageLimit: 5, heightLimit: '36 inches', restrictions: 'Supervision required' },
    { id: 18, name: 'Spin Zone', category: 'Hybrid', ageLimit: 4, heightLimit: 'None', restrictions: 'Maximum of 2 per car' },
    { id: 19, name: 'Scenic Train Ride', category: 'Land', ageLimit: 0, heightLimit: 'None', restrictions: 'None' },
    { id: 20, name: 'River Rapids', category: 'Water', ageLimit: 7, heightLimit: '42 inches', restrictions: 'No pregnant women' }
];

const Rides = () => {
  const categories = [...new Set(ridesData.map(ride => ride.category))]; // Unique categories

  return (
      <div className="rides-container">
          {categories.map(category => (
              <div className="ride-category" key={category}>
                  <h2>{category} Rides</h2>
                  <div className="ride-list">
                      {ridesData.filter(ride => ride.category === category).map(ride => (
                          <div className="ride-card" key={ride.id}>
                              <h3>{ride.name}</h3>
                              <p><strong>Age Limit:</strong> {ride.ageLimit}+</p>
                              <p><strong>Height Requirement:</strong> {ride.heightLimit}</p>
                              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>
  );
};

export default Rides;