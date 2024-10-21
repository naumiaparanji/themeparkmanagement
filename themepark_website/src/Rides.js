import React from 'react';

function Rides() {
  const thrillRides = [
    { name: 'Dragon Coaster', description: 'A high-speed coaster with loops and sharp turns.', age: '12+', height: '4ft+', restrictions: 'No heart conditions' },
    { name: 'Sky Drop', description: 'A terrifying freefall from 200 feet in the air.', age: '14+', height: '4.5ft+', restrictions: 'No fear of heights' },
    { name: 'Tornado Twister', description: 'A spinning thrill ride that will leave you breathless.', age: '12+', height: '4ft+', restrictions: 'No back problems' },
  ];

  const familyRides = [
    { name: 'Ferris Wheel', description: 'Enjoy a relaxing panoramic view of the entire park.', age: 'All ages', height: '3ft+', restrictions: 'None' },
    { name: 'Park Train', description: 'A gentle ride through the scenic areas of the park.', age: 'All ages', height: 'None', restrictions: 'None' },
    { name: 'Carousel', description: 'A classic merry-go-round with beautifully painted horses.', age: 'All ages', height: 'None', restrictions: 'None' },
  ];

  const kidsRides = [
    { name: 'Mini Bumper Cars', description: 'Fun-sized bumper cars for younger children.', age: '5-10', height: 'None', restrictions: 'None' },
    { name: 'Tiny Teacups', description: 'Gentle spinning cups for the little ones.', age: '3-8', height: 'None', restrictions: 'None' },
    { name: 'Kiddie Coaster', description: 'A small, kid-friendly roller coaster.', age: '5-10', height: '2.5ft+', restrictions: 'None' },
  ];

  const waterRides = [
    { name: 'Splash Mountain', description: 'A water ride with a big splash at the end.', age: '10+', height: '3.5ft+', restrictions: 'Swimwear required' },
    { name: 'Lazy River', description: 'Relax as you float along a slow-moving river.', age: 'All ages', height: 'None', restrictions: 'Life jacket for young children' },
    { name: 'Wave Pool', description: 'Experience waves in a huge pool with simulated tides.', age: 'All ages', height: 'None', restrictions: 'Swimwear required' },
  ];

  const hybridRides = [
    { name: 'Water Coaster', description: 'A blend of roller coaster thrills with water splashes.', age: '12+', height: '4ft+', restrictions: 'No back problems' },
    { name: 'Pirate’s Adventure', description: 'A land and water ride where you navigate a pirate ship through twists and turns.', age: '8+', height: '3ft+', restrictions: 'None' },
    { name: 'Jungle Rapids', description: 'A thrilling raft ride through rapid water streams.', age: '10+', height: '3.5ft+', restrictions: 'None' },
  ];

  const darkRides = [
    { name: 'Haunted Mansion', description: 'A spooky dark ride through haunted rooms and corridors.', age: '8+', height: 'None', restrictions: 'None' },
    { name: 'Alien Invasion', description: 'A sci-fi themed ride battling aliens in space.', age: '12+', height: 'None', restrictions: 'None' },
    { name: 'Dino Safari', description: 'Take a journey through prehistoric times with animatronic dinosaurs.', age: 'All ages', height: 'None', restrictions: 'None' },
  ];

  const simulators = [
    { name: 'Virtual Space Mission', description: 'Experience the feeling of a real space launch and mission in this immersive simulator.', age: '12+', height: 'None', restrictions: 'None' },
    { name: 'Flight Simulator', description: 'Soar through the skies in a virtual airplane simulation.', age: '10+', height: 'None', restrictions: 'None' },
    { name: 'Race Car Challenge', description: 'Compete in a virtual race car competition with friends.', age: '12+', height: 'None', restrictions: 'None' },
  ];

  const sectionStyle = {
    padding: '20px',
    marginBottom: '30px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
  };

  const titleStyle = {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const rideItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  };

  const ridesListStyle = {
    listStyle: 'none',
    paddingLeft: '0',
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', color: '#2980b9' }}>Explore Our Rides</h1>
      
      <section style={sectionStyle}>
        <h2 style={titleStyle}>Thrill Rides</h2>
        <ul style={ridesListStyle}>
          {thrillRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Family Rides</h2>
        <ul style={ridesListStyle}>
          {familyRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Kids Rides</h2>
        <ul style={ridesListStyle}>
          {kidsRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Water Rides</h2>
        <ul style={ridesListStyle}>
          {waterRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Hybrid Rides (Land & Water)</h2>
        <ul style={ridesListStyle}>
          {hybridRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Dark Rides</h2>
        <ul style={ridesListStyle}>
          {darkRides.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>Simulators</h2>
        <ul style={ridesListStyle}>
          {simulators.map((ride, index) => (
            <li key={index} style={rideItemStyle}>
              <h3>{ride.name}</h3>
              <p>{ride.description}</p>
              <p><strong>Age:</strong> {ride.age}</p>
              <p><strong>Height:</strong> {ride.height}</p>
              <p><strong>Restrictions:</strong> {ride.restrictions}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Rides;
