package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Movie struct {
	Name          string    `json:"name,omitempty" bson:"name,omitempty"`
	ReleaseDate   time.Time `json:"release_date,omitempty" bson:"release_date,omitempty"`
	ReleaseStatus string    `json:"release_status,omitempty" bson:"release_status,omitempty"`
	Cast          []string  `json:"cast,omitempty" bson:"cast,omitempty"`
	Crew          []string  `json:"crew,omitempty" bson:"crew,omitempty"`
	PosterURL     string    `json:"poster_url,omitempty" bson:"poster_url,omitempty"`
	TrailerURL    string    `json:"trailer_url,omitempty" bson:"trailer_url,omitempty"`
}

// OpenedMovie represents a structure for an opened movie
type OpenedMovie struct {
	MovieID       string    `bson:"movie_id"`
	CityID        string    `bson:"city_id"`
	Venues        []string  `bson:"venues"`
	ReleaseStatus int       `bson:"release_status"`
	OpenedDate    time.Time `bson:"opened_date"`
	ShowTimes     []string  `bson:"show_times"`
	StartDate     time.Time `bson:"start_date"`
	EndDate       time.Time `bson:"end_date"`
}

type OpenMovieRequest struct {
	CityID    string   `json:"city"`
	Venues    []string `json:"venues"`
	ShowTimes []string `json:"show_times"`
	StartDate string   `json:"start_date"`
	EndDate   string   `json:"end_date"`
}

// Booking struct to represent the booking details
type Booking struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	VenueID     string             `json:"venueId"`
	MovieName   string             `json:"movieName"`
	ShowTime    string             `json:"showTime"`
	Date        string             `json:"date"`
	TotalPrice  float64            `json:"totalPrice"`
	NumSeats    int                `json:"numSeats"`
	SeatNumbers []int              `json:"seatNumbers"`
	User        string             `json:"user"`
	CreatedAt   time.Time          `json:"createdAt"`
}

type CancelBookingRequest struct {
	BookingID string `json:"bookingId"`
}
