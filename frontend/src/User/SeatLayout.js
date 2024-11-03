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
  const [allSeats, setAllSeats] = useState(false);

  const totalRows = 5;
    const totalColumns = 10;

  const isDisabled = (row, col) => {
    const seatNumber = (row - 1) * totalColumns + col;
    return [31, 32, 39, 40].includes(seatNumber);
  };

  useEffect(() => {
    // Fetch booked seats data from the API or any other source
    const fetchBookedSeats = async () => {
      try {
        console.log(selectedMovieDetails)
        const response = await axios.get(`http://13.53.132.117:8080/booked-seats/${selectedMovieDetails.movie.venue_id}/${selectedMovieDetails.movie.show_time}/${selectedMovieDetails.movie.date}`);
        setBookedSeats(response.data);
        if (response.data.length === totalColumns * totalRows - 4) {
          alert("All seats are already booked for this screen");
          navigate('/welcome')
        }
        
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };

    fetchBookedSeats();
  }, [selectedMovieDetails]);
  const handleSeatSelection = (seatNumber) => {

    const isDisabledSeat = isDisabled(Math.ceil(seatNumber / totalColumns), (seatNumber - 1) % totalColumns + 1);

  // If the seat is disabled, do nothing
  if (isDisabledSeat) {
    return;
  }

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
    let totalPrice = 0;
  selectedSeats.forEach(seat => {
    if (seat <= 20) { // Silver seats
      totalPrice += 7;
    } else if (seat <= 40) { // Gold seats
      totalPrice += 10;
    } else { // Recliners
      totalPrice += 15;
    }
  });

    navigate('/cart', { state: { seats: selectedSeats, price: totalPrice, movie: selectedMovieDetails, bool:allSeats } });
  };


   

    const selectAllSeats = () => {
      

      if (selectedSeats.length === (totalColumns * totalRows) - 4 - (bookedSeats ? bookedSeats.length : 0)) {
        // If all selectable seats are currently selected, deselect all
        setSelectedSeats([]);
        setAllSeats(false);
      } else {
        if(bookedSeats){
          alert("There are already some seats booked for this screen, Do you still want to continue?")
        }
        // Otherwise, select all selectable seats
        const allSelectableSeats = [];
        for (let row = 1; row <= totalRows; row++) {
          for (let col = 1; col <= totalColumns; col++) {
            const seatNumber = (row - 1) * totalColumns + col;
            if (!isDisabled(row, col) && (!bookedSeats || !bookedSeats.includes(seatNumber))) {
              allSelectableSeats.push(seatNumber);
            }
          }
        }
        setSelectedSeats(allSelectableSeats);
        setAllSeats(true);
      }
    };
    
  


  const renderBookWholeScreenButton = () => {
    const allSeatsSelected = selectedSeats.length === (totalColumns * totalRows) - 4 - (bookedSeats ? bookedSeats.length : 0);
    return (
      <button className="select-all-btn" onClick={selectAllSeats}>
        {allSeatsSelected ? "Deselect All Seats" : "Book Whole Screen"}
      </button>
    );
  };
  

  // Inside the renderSeats function
const renderSeats = () => {
  const seats = [];

  const getSeatClass = (row) => {
    if (row <= 2) {
      return 'silver';
    } else if (row <= 4) {
      return 'gold';
    } else {
      return 'recliners';
    }
  };

  if (!bookedSeats) {
    // No seats are booked, render all seats as available
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = [];
      const seatClass = getSeatClass(row);
      for (let col = 1; col <= totalColumns; col++) {
        const seatNumber = (row - 1) * totalColumns + col;
        const isSelected = selectedSeats.includes(seatNumber);

        // Check if the seat is disabled
        const isDisabled = [31, 32, 39, 40].includes(seatNumber);

        rowSeats.push(
          <div
            key={seatNumber}
            className={`seat ${seatClass} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled-state' : ''}`}
            onClick={() => handleSeatSelection(seatNumber)}
            title={isDisabled ? "This seat is disabled." : ""}
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
      const seatClass = getSeatClass(row);
      for (let col = 1; col <= totalColumns; col++) {
        const seatNumber = (row - 1) * totalColumns + col;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        // Check if the seat is disabled
        const isDisabled = [31, 32, 39, 40].includes(seatNumber);

        rowSeats.push(
          <div
            key={seatNumber}
            className={`seat ${seatClass} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled-state' : ''}`}
            onClick={() => handleSeatSelection(seatNumber)}
            title={isDisabled ? "This seat is disabled." : ""}
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
          {renderBookWholeScreenButton()}
          {renderGoToCartButton()}
        </div>
      </div>
      <div className="legend-container-white">
      <div className="legend-container">
        <div className="legend-item">
          <div className="legend-color-box-selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box-booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box-silver"></div>
          <span>Silver(7$)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box-gold"></div>
          <span>Gold(10$)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box-recliners"></div>
          <span>Recliners(15$)</span>
        </div>
      </div>
    </div>
  </div>
  );
  
};

export default SeatLayout;
