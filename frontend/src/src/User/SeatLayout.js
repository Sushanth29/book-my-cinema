import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SeatLayout.css';

const SeatLayout = ({bodyClassName}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMovieDetails = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    // Fetch booked seats data from the API or any other source
    const fetchBookedSeats = async () => {
      try {
        console.log(selectedMovieDetails)
        const response = await axios.get(`http://localhost:8080/booked-seats/${selectedMovieDetails.movie.venue_id}/${selectedMovieDetails.movie.show_time}/${selectedMovieDetails.movie.date}`);
        setBookedSeats(response.data);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };

    fetchBookedSeats();
  }, [selectedMovieDetails]);
  const handleSeatSelection = (seatNumber) => {
    // Check if the seat is already booked
    const isBooked = bookedSeats ? bookedSeats.includes(seatNumber) : false;
  
    // If the seat is booked, do nothing
    if (isBooked) {
      return;
    }
  
    // Check if the seat is already selected
    const isSelected = selectedSeats.includes(seatNumber);
  
    if (isSelected) {
      // If the seat is already selected, remove it from the selectedSeats array
      setSelectedSeats(prevSelectedSeats => prevSelectedSeats.filter(seat => seat !== seatNumber));
    } else {
      // If the seat is not selected, add it to the selectedSeats array
      // Check if the maximum limit of 5 seats is reached
      if (selectedSeats.length >= 5) {
        alert('You can select only up to 5 seats');
        console.log('Maximum limit of 5 seats reached.');
        return;
      }
      setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, seatNumber]);
    }
  };
  

  const goToCart = () => {
    navigate('/cart', { state: { seats: selectedSeats, movie: selectedMovieDetails } });
  };

  const renderSeats = () => {
    const totalRows = 5;
    const totalColumns = 8;
    const seats = [];
  
    if (!bookedSeats) {
      // No seats are booked, render all seats as available
      for (let row = 1; row <= totalRows; row++) {
        const rowSeats = [];
        for (let col = 1; col <= totalColumns; col++) {
          const seatNumber = (row - 1) * totalColumns + col;
          const isSelected = selectedSeats.includes(seatNumber);
  
          rowSeats.push(
            <div
              key={seatNumber}
              className={`seat ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSeatSelection(seatNumber)}
            >
              {seatNumber}
            </div>
          );
        }
        seats.push(<div key={`row-${row}`} className="row">{rowSeats}</div>);
      }
    } else {
      // Seats are booked, render them accordingly
      for (let row = 1; row <= totalRows; row++) {
        const rowSeats = [];
        for (let col = 1; col <= totalColumns; col++) {
          const seatNumber = (row - 1) * totalColumns + col;
          const isBooked = bookedSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
  
          rowSeats.push(
            <div
              key={seatNumber}
              className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSeatSelection(seatNumber)}
            >
              {seatNumber}
            </div>
          );
        }
        seats.push(<div key={`row-${row}`} className="row">{rowSeats}</div>);
      }
    }
  
    return seats;
  };
  

  const renderGoToCartButton = () => {
    if (selectedSeats.length > 0) {
      return (
        <button className='cart-btn' onClick={goToCart}>Go to Cart</button>
      );
    }
    return null;
  };
  document.body.className = bodyClassName || ''

  return (
    <div className='parent-container'>
      <svg className="screen-curve" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,10 Q50,-10 100,10" fill="none" stroke="#333" strokeWidth="2" />
      </svg>
      <p>Screen this side</p>
      <div className="seat-layout-container">
        <div className="seat-layout">
          {renderSeats()}
          {renderGoToCartButton()}
        </div>
      </div>
      <div className="legend-container">
      <div className="legend-item">
  <div className="legend-color-box-selected"></div>
  <span>Selected</span>
</div>
<div className="legend-item">
  <div className="legend-color-box-booked"></div>
  <span>Booked</span>
</div>

      </div>
    </div>
  );
  
};

export default SeatLayout;
