// ConfirmationPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link} from 'react-router-dom';
import axios from 'axios';
import './ConfirmationPage.css';
import qrCodeImage from './icons/QR.png';


const ConfirmationPage = () => {
    const location = useLocation();
  const { bookingDetails } = location.state;

  const [venueName, setVenueName] = useState('');
  const [posterURL, setPosterURL] = useState('');

  useEffect(() => {
    // Fetch venue details and movie poster URL from the API
    const fetchData = async () => {
      try {
        const venueResponse = await axios.get(`http://localhost:8080/venues/${bookingDetails.booking.venueId}`);
        setVenueName(venueResponse.data.venue_name);

        const movieResponse = await axios.get(`http://localhost:8080/get-movies/${bookingDetails.booking.movieName}`);
        setPosterURL(movieResponse.data.poster_url);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [bookingDetails]);

  return (
    <div className="parent-container">
      <div className="confirmation-container">
        <h2>Booking Confirmation</h2>
        <div className="ticket-details">
          <h3>Ticket Details:</h3>
          <p>Venue: {venueName}</p>
          <p>Movie: {bookingDetails.booking.movieName}</p>
          <p>Show Time: {bookingDetails.booking.showTime}</p>
          <p>Date: {bookingDetails.booking.date}</p>
          <p>Total Price: ${bookingDetails.booking.totalPrice}</p>
          <p>Number of Seats: {bookingDetails.booking.numSeats}</p>
          <p>Seat Numbers: {bookingDetails.booking.seatNumbers.join(',')}</p>
          <img src={posterURL} alt="Movie Poster" className='poster-img'/>
          <img src={qrCodeImage} alt="QR Code" className='qr-code'/>
        </div>

        <div className="button-container">
                    <Link to="/welcome">
                        <button className="main-page-button">Go to Main Page</button>
                    </Link>
                </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
