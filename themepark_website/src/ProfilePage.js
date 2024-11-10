import React, { useState, useEffect } from 'react';
import { api } from './App'; // Assuming `api` is your Axios instance

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/customer/info');
                setProfile(response.data.user);
            } catch (err) {
                setError('Failed to fetch profile data');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
            {error && <p>{error}</p>}
            {profile && (
                <div>
                    <h2>{profile.FirstName} {profile.LastName}</h2>
                    <p>Email: {profile.Email}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
