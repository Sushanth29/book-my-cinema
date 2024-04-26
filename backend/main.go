package main

import (
	"backend/db"
	"backend/handlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

	r := mux.NewRouter()

	// Define your routes here
	r.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleRegister(w, r)
	}).Methods("POST")

	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleLogin(w, r)
	}).Methods("POST")

	r.HandleFunc("/admin-login", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleAdminLogin(w, r)
	}).Methods("POST")

	r.HandleFunc("/cities", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleCreateCity(w, r)
	}).Methods("POST")

	r.HandleFunc("/cities", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleGetCities(w, r)
	}).Methods("GET")

	r.HandleFunc("/venues", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleCreateVenue(w, r)
	}).Methods("POST")
	r.HandleFunc("/venues", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleVenuesByCity(w, r)
	}).Methods("GET")

	r.HandleFunc("/movies", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleCreateMovie(w, r)
	}).Methods("POST")

	r.HandleFunc("/movies/open/{movie_id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		movieID := vars["movie_id"]
		handlers.HandleOpenMovie(w, r, movieID)
	}).Methods("POST")

	r.HandleFunc("/movies/upcoming", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleGetUpcomingMovies(w, r)
	}).Methods("GET")

	r.HandleFunc("/movies/1", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleGetOpenedMoviesByCity(w, r)
	}).Methods("GET")

	r.HandleFunc("/insert", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleAddPosterURL(w, r)
	}).Methods("GET")

	r.HandleFunc("/movies/{movie_id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		movieID := vars["movie_id"]
		handlers.HandleGetMovieDetails(w, r, movieID)
	}).Methods("GET")

	r.HandleFunc("/get-movies/{movie}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Get movies")
		vars := mux.Vars(r)
		movieID := vars["movie"]
		handlers.GetMovieByName(w, r, movieID)
	}).Methods("GET")

	r.HandleFunc("/opened_movies", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleGetVenuesByMovieID(w, r)
	}).Methods("GET")

	r.HandleFunc("/venues/{venue_id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		venueID := vars["venue_id"]
		handlers.HandleGetVenueByID(w, r, venueID)
	}).Methods("GET")

	r.HandleFunc("/bookings", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreateBooking(w, r)
	}).Methods("POST")

	r.HandleFunc("/booked-seats/{venue_id}/{showtime}/{date}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		venueID := vars["venue_id"]
		showTime := vars["showtime"]
		date := vars["date"]
		handlers.GetBookedSeats(w, r, venueID, showTime, date)
	}).Methods("GET")

	r.HandleFunc("/user", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleGetUsernameByEmail(w, r)
	}).Methods("POST")

	r.HandleFunc("/get-bookings", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetBookingsByUser(w, r)
	}).Methods("POST")

	r.HandleFunc("/send-emails", func(w http.ResponseWriter, r *http.Request) {
		handlers.SendEmails(w, r)
	}).Methods("POST")

	r.HandleFunc("/change-password", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleChangePassword(w, r)
	}).Methods("POST")

	r.HandleFunc("/change-username", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleChangeUsername(w, r)
	}).Methods("POST")

	r.HandleFunc("/cancel-booking", func(w http.ResponseWriter, r *http.Request) {
		handlers.DeleteBooking(w, r)
	}).Methods("POST")

	// Enable CORS with default options
	handler := cors.Default().Handler(r)

	db.Init()

	// Start the server
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
