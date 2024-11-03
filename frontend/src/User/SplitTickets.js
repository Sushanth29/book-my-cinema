import React, { useState } from 'react';
import axios from 'axios';
import './SplitTickets.css'; 

const TicketSplitter = () => {
  const [totalPrice, setTotalPrice] = useState(parseFloat(localStorage.getItem('totalPrice')) || 0);
  const [numTickets, setNumTickets] = useState(localStorage.getItem('numTickets') || 0);
  const [movieName, setMovieName] = useState(localStorage.getItem('movieName') || 0);
  const [venueName, setVenueName] = useState(localStorage.getItem('venueName') || 0);
  const [email, setEmail] = useState(localStorage.getItem('username') || 0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numFriends, setNumFriends] = useState(localStorage.getItem('numTickets')-1 || 0);
  const [friendEmails, setFriendEmails] = useState([]);

 

  const handleFriendEmailChange = (index, email) => {
    const updatedEmails = [...friendEmails];
    updatedEmails[index] = email;
    setFriendEmails(updatedEmails);
  };

  const sendPaymentRequest = async () => {
    const totalAmount = totalPrice;
    const amountPerFriend = (totalAmount / numTickets).toFixed(2);
    const emailBody = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #007bff;
                        color: #fff;
                        text-align: center;
                        padding: 20px 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content img {
                        max-width: 100%;
                        height: 200px;
                        margin-bottom: 20px;
                        width:200px;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 20px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Split Tickets Request</h1>
                    </div>
                    <div class="content">
                    <h2>Movie Details</h2>
                    <p>Venue: ${venueName}</p>
                    <p>Movie: ${movieName}</p>
                    <p>Total Price: $${totalPrice}</p>
                    <h2>Split Tickets Details</h2>
                    <p>Requested by: ${email}</p>
                    <p>Amount to be paid by each individual: ${amountPerFriend}$</p>
                    <p>Total Tickets: ${numTickets}</p>
                    <p>Please pay ${amountPerFriend}$ to ${phoneNumber} via Zelle or Paypal</p>
                    
                    </div>
                    <div class="footer">
                        <p>Thank you for booking with us! @Book My Cinema</p>
                    </div>
                </div>
            </body>
            </html>
            
            `;
    try {
       
    
      const requests = friendEmails.map(email => ({
        email,
        amount: amountPerFriend
      }));
      await axios.post('http://13.53.132.117:8080/send-emails', {
        from: "bookmycinemaapp@gmail.com", 
    to: friendEmails, 
    subject: "Book My Cinema - Split Tickets Request", 
    body: emailBody,
    contentType: 'text/html', 

      });
      alert('Payment request sent successfully')
      window.location.href = 'http://13.53.132.117:3000/welcome';
      console.log('Payment requests sent successfully!');
    } catch (error) {
      console.error('Error sending payment requests:', error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    sendPaymentRequest();
  };

  const renderFriendEmailFields = () => {
    const fields = [];
    for (let i = 0; i < numFriends; i++) {
      fields.push(
        <input
          key={i}
          type="email"
          placeholder={`Friend ${i + 1} Email`}
          value={friendEmails[i] || ''}
          onChange={(e) => handleFriendEmailChange(i, e.target.value)}
          className="input-field email-input"
        />
      );
    }
    return fields;
  };

  return (
    <div className="ticket-splitter-container">
      <div className="ticket-splitter-content">
        <h2 className="ticket-splitter-heading">Ticket Splitter</h2>
        <p>Total Price: ${totalPrice}</p>
        <p>Total Friends(Excluding You): {numTickets-1}</p>
        <p>Amount Per Friend: ${(totalPrice / numTickets).toFixed(2)}</p>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">Your Phone Number (for Zelle/Paypal)</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Your Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
            />
          </div>
        
          {renderFriendEmailFields()}
          <button type="submit" className="submit-button">Send Payment Request</button>
        </form>
      </div>
    </div>
  );
};

export default TicketSplitter;
