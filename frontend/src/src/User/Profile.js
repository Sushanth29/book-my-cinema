import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import qrCodeImage from './icons/QR.png';

const Profile = ({bodyClassName}) => {
    const [userData, setUserData] = useState({});
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [venueNames, setVenueNames] = useState({}); // State to store venue names
    const email = localStorage.getItem('username');
    const [posters, setPosters] = useState({});

    useEffect(() => {
        fetchUserData();
        fetchBookings();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.post('http://localhost:8080/user', { email });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data');
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.post('http://localhost:8080/get-bookings', { user: email });
           

            if (response.data) {
                setBookings(response.data);
            } else {
                setBookings([]); // Set venues to an empty array when response.data is null
            }
            fetchVenueNames(response.data); // Fetch venue names after fetching bookings
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Error fetching bookings');
        }
    };
    const fetchMovieDetails = async (movieName) => {
        try {
            console.log(movieName)
            const formattedMovieName = encodeURIComponent(movieName); // Encode spaces as %20
            console.log(formattedMovieName)
            const response = await axios.get(`http://localhost:8080/get-movies/${movieName}`);
            return response.data.poster_url;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    };
    

    const fetchVenueNames = async (bookings) => {
        try {
            const venueIds = bookings.map(booking => booking.venueId);
            const movieNames = bookings.map(booking => booking.movieName);
            const uniqueVenueIds = [...new Set(venueIds)]; 
            const uniqueMovieNames = [...new Set(movieNames)];
            const venueNamesMap = {};
            const moviesMap = {};
            for (const venueId of uniqueVenueIds) {
                const response = await axios.get(`http://localhost:8080/venues/${venueId}`);
                venueNamesMap[venueId] = response.data.venue_name;
            }
            for (const movie of uniqueMovieNames) {
                const posterURL = await fetchMovieDetails(movie);
             moviesMap[movie] = posterURL;
            }
            setVenueNames(venueNamesMap);
            setPosters(moviesMap)
        } catch (error) {
            console.error('Error fetching venue names:', error);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    const isExpired = (dateStr, timeStr) => {
        const bookingDate = new Date(dateStr);
        const bookingTime = parseTime(timeStr);
        const currentDateTime = new Date();

        // Set the hours and minutes of the booking time to match the current date
        bookingTime.setFullYear(currentDateTime.getFullYear());
        bookingTime.setMonth(currentDateTime.getMonth());
        bookingTime.setDate(currentDateTime.getDate());

        // Compare the booking date and time with the current date and time
        return (bookingDate < currentDateTime) || (bookingDate.getTime() === currentDateTime.getTime() && bookingTime < currentDateTime);
    };

    const parseTime = (timeStr) => {
        const [hour, minute] = timeStr.split(/:|(?=[ap]m)/i);
        const hourInt = parseInt(hour, 10);
        const minuteInt = parseInt(minute, 10) || 0;

        // Adjust hours for PM times
        let adjustedHour = hourInt;
        if (/pm/i.test(timeStr) && adjustedHour !== 12) {
            adjustedHour += 12;
        }

        // Create a new Date object with the parsed hour and minute
        const parsedTime = new Date();
        parsedTime.setHours(adjustedHour, minuteInt, 0, 0);

        return parsedTime;
    };

    document.body.className = bodyClassName || ''

    return (
        <div>
          <br />
          <br />
          <br />
          <div className="top-right">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
      
          <div className="profile-container">
            <h2>Profile</h2>
            <div className="user-info">
              <div>
                <strong>Username:</strong> {userData.username}
              </div>
              <div>
                <strong>Email:</strong> {localStorage.getItem('username')}
              </div>
            </div>
            <h3>Booking History</h3>
            {bookings.length === 0 ? (
              <div className="no-bookings">No booking history available</div>
            ) : (
              <div className="booking-list">
                {bookings.map(booking => (
                  <div className="booking-item" key={booking.id}>
                    
                    <div className="other-content">
                      <div>
                        <strong>Movie:</strong> {booking.movieName}
                      </div>
                      <div>
                        <strong>Date:</strong> {booking.date}
                      </div>
                      <div>
                        <strong>Time:</strong> {booking.showTime}
                      </div>
                      <div>
                        <strong>Venue:</strong> {venueNames[booking.venueId]}
                      </div>
                      <div>
                                        <strong>Expired:</strong> {isExpired(booking.date, booking.showTime) ? 'Yes' : 'No'}
                                    </div>
                    </div>
                    <img src={qrCodeImage} alt="QR Code" className='c-qr-code'/>
                    <img
                      src={posters[booking.movieName]}
                      alt="Movie Poster"
                      className="poster-image"
                    />
                  </div>
                ))}
              </div>
            )}
      
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      );
      
};

export default Profile;
