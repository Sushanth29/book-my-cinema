import React, { useState } from 'react';
import axios from 'axios';
import './CreateCity.css';

const CreateCity = () => {
    const [cityName, setCityName] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateCity = async () => {
        try {
            const response = await axios.post('http://localhost:8080/cities', { city_name: cityName });
            setMessage(response.data.message);
        } catch (error) {
            console.log(error.response.data)
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="city-page-container">
            <h3 className='h3-css'>Book My Cinema</h3>
            <div className="create-city-container">
                <h2>Create New City</h2><br></br>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                />
               <button style={{ marginTop: '20px' }} onClick={handleCreateCity}>Create City</button>

                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default CreateCity;
