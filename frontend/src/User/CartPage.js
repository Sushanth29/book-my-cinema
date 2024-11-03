import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';
import Checkout from './Checkout';

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seats, price, movie, bool } = location.state;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [posterURL, setPosterURL] = useState('');

  // Calculate the subtotal, tax, and total amount
  const subtotal = price;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Function to handle confirming tickets and making the API call
  const handleConfirmTickets = async () => {
    try {
      // Make a POST request to the backend API to add booking entry
      const response = await axios.post('http://13.53.132.117:8080/bookings', {
        venueId: movie.movie.venue_id,
        movieName: movie.movie.movie,
        showTime: movie.movie.show_time,
        date: movie.movie.date,
        totalPrice: total,
        numSeats: seats.length,
        seatNumbers: seats,
        user: localStorage.getItem('username')
      });

      console.log('Booking confirmed:', response.data);

      navigate('/confirmation', { state: { bookingDetails: response.data, yes:bool } });
    } catch (error) {
      // Handle error case
      console.error('Error confirming booking:', error);
      // Display error message to the user
    }
  };

  // Function to handle payment success
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    handleConfirmTickets(); // Call handleConfirmTickets when payment is successful
  };

  const [venueName, setVenueName] = useState('');
  useEffect(() => {
    // Fetch venue details from the API
    const fetchVenueDetails = async () => {
      try {
        const response = await axios.get(`http://13.53.132.117:8080/venues/${movie.movie.venue_id}`);
        setVenueName(response.data.venue_name);
        const movieResponse = await axios.get(`http://13.53.132.117:8080/get-movies/${movie.movie.movie}`);
        setPosterURL(movieResponse.data.poster_url);
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [movie.movie.venue_id]);

  return (
    <div className='parent-container'>
      <div className="cart-container">
        <h2>Cart</h2>
        <div className="selected-seats">
          <h3>Selected Seats Information:</h3>
          <ul>
            {bool ? (
              <li>Whole Screen(Except disabled and booked tickets)</li>
            ) : (
              seats.map((seat) => (
                <li key={seat}>
                  Seat {seat} - 
                  {seat <= 20 ? " Silver" : seat <= 40 ? " Gold" : " Recliners"}
                </li>
              ))
            )}
          </ul>
          <p>Screen 1</p>
          <p>Movie: {movie.movie.movie}</p>
          <p>Venue: {venueName}</p>
          <p>Date: {movie.movie.date}</p>
          <img src={posterURL} alt="Movie Poster" className='cart-poster-img'/>
        </div>
        <div className="subtotal">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (5%): ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        
        <Checkout total={total} onPaymentSuccess={handlePaymentSuccess} />
        
        {paymentSuccess ? <p>Payment Successful!</p> : null}
      </div>
    </div>
  );
};

export default CartPage;
