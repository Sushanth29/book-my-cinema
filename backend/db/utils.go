// db package

package db

import (
	"backend/models"

	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// InsertCity inserts a new city record into the database
func InsertCity(ctx context.Context, city *models.City) error {
	// Get the collection
	collection := GetDatabase().Collection("cities")

	// Insert the city document into the collection
	_, err := collection.InsertOne(ctx, city)
	if err != nil {
		return err
	}

	return nil
}

// GetCityByName retrieves a city from the database by its name
func GetCityByName(ctx context.Context, cityName string) (*models.City, error) {
	var city models.City
	filter := bson.M{"city_name": cityName}

	collection := GetDatabase().Collection("cities")
	err := collection.FindOne(ctx, filter).Decode(&city)
	if err != nil {
		if err == ErrNotFound {
			// City not found
			return nil, nil
		}
		// Error occurred while querying the database
		return nil, err
	}
	return &city, nil
}

// GetCities retrieves the list of cities from the database
func GetCities() ([]bson.M, error) {
	var cities []bson.M

	// Get database collection
	collection := client.Database("movie-booking").Collection("cities")

	// Find all cities
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	// Decode cities from cursor
	err = cursor.All(context.Background(), &cities)
	if err != nil {
		return nil, err
	}

	return cities, nil
}

// GetCityByID retrieves a city from the database by its ID
func GetCityByID(ctx context.Context, cityID string) (*models.City, error) {
	var city models.City
	hexCityID, _ := primitive.ObjectIDFromHex(cityID)
	fmt.Println(hexCityID)
	filter := bson.M{"_id": hexCityID}
	err := GetDatabase().Collection("cities").FindOne(ctx, filter).Decode(&city)
	if err != nil {
		return nil, err
	}
	return &city, nil
}

// InsertVenue inserts a new venue into the database
func InsertVenue(ctx context.Context, venue *models.Venue) error {
	collection := GetDatabase().Collection("venues")
	_, err := collection.InsertOne(ctx, venue)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

// InsertMovie inserts a new movie record into the database
func InsertMovie(ctx context.Context, movie *models.Movie) error {
	// Get the collection
	collection := GetDatabase().Collection("movies")

	// Insert the movie document into the collection
	_, err := collection.InsertOne(ctx, movie)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

func UpdateMovieReleaseStatus(ctx context.Context, movieID string, releaseStatus string) error {
	// Get the collection
	collection := GetDatabase().Collection("movies")

	hexMovieID, _ := primitive.ObjectIDFromHex(movieID)

	// Define filter to find the movie by its ID
	filter := bson.M{"_id": hexMovieID}

	// Define update to set the release_status field
	update := bson.M{"$set": bson.M{"release_status": releaseStatus}}

	// Perform the update operation
	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	return nil
}

// GetMoviesByReleaseStatus retrieves movies from the database with the specified release status
func GetMoviesByReleaseStatus(ctx context.Context, releaseStatus string) ([]bson.M, error) {
	var movies []bson.M

	// Get database collection
	collection := GetDatabase().Collection("movies")

	// Define filter to query movies by release status
	filter := bson.M{"release_status": releaseStatus}

	// Find movies matching the filter
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode movies from cursor
	if err := cursor.All(ctx, &movies); err != nil {
		return nil, err
	}

	return movies, nil
}

// GetOpenedMoviesByCity retrieves opened movies from the database in the specified city
func GetOpenedMoviesByCity(ctx context.Context, cityID string) ([]bson.M, error) {
	var openedMovies []bson.M

	// Get database collection
	collection := GetDatabase().Collection("opened_movies")

	// Define filter to query opened movies by city ID
	filter := bson.M{"city_id": cityID}

	// Find opened movies matching the filter
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode opened movies from cursor
	if err := cursor.All(ctx, &openedMovies); err != nil {
		return nil, err
	}

	return openedMovies, nil
}

// GetMovieByID retrieves complete details of a movie from the database by its ID
func GetMovieByID(ctx context.Context, movieID string) (bson.M, error) {
	var movie bson.M

	// Get database collection
	collection := GetDatabase().Collection("movies")
	hexMovieID, _ := primitive.ObjectIDFromHex(movieID)

	// Define filter to query movie by its ID
	filter := bson.M{"_id": hexMovieID}

	// Find the movie matching the filter
	err := collection.FindOne(ctx, filter).Decode(&movie)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return movie, nil
}

// Function to fetch movie details from the database
func GetMovieDetailsFromDB(movieID string, movieDetails *models.Movie) error {
	collection := GetDatabase().Collection("movies")

	hexMovieID, _ := primitive.ObjectIDFromHex(movieID)

	// Define filter to query movie by ID
	filter := bson.M{"_id": hexMovieID}

	// Find movie by ID
	err := collection.FindOne(context.Background(), filter).Decode(movieDetails)
	if err != nil {
		return err
	}

	return nil
}

// Function to fetch movie details from the database
func GetMovieDetailsByName(movieName string, movieDetails *models.Movie) error {
	collection := GetDatabase().Collection("movies")

	// Define filter to query movie by ID
	filter := bson.M{"name": movieName}

	// Find movie by ID
	err := collection.FindOne(context.Background(), filter).Decode(movieDetails)
	if err != nil {
		return err
	}

	return nil
}

// GetVenuesByCity retrieves the list of venues based on the provided city ID
func GetVenuesByCity(cityID string) ([]bson.M, error) {
	var venues []bson.M

	// Get database collection
	collection := client.Database("movie-booking").Collection("venues")

	// Find venues based on city ID
	cursor, err := collection.Find(context.Background(), bson.M{"city_id": cityID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	// Decode venues from cursor
	err = cursor.All(context.Background(), &venues)
	if err != nil {
		return nil, err
	}

	return venues, nil
}

// InsertOpenedMovie inserts an opened movie into the opened movies table
func InsertOpenedMovie(ctx context.Context, movieID, cityID string, venues []string, showTimes []string, startDate, endDate time.Time) error {

	// Prepare the opened movie document
	openedMovie := models.OpenedMovie{
		MovieID:       movieID,
		CityID:        cityID,
		Venues:        venues,
		ReleaseStatus: 1, // Assuming release status is always 1 for opened movies
		OpenedDate:    time.Now(),
		ShowTimes:     showTimes,
		StartDate:     startDate,
		EndDate:       endDate,
	}

	// Insert the opened movie document into the opened movies table
	_, err := client.Database("movie-booking").Collection("opened_movies").InsertOne(ctx, openedMovie)
	if err != nil {
		return err
	}

	return nil
}

// GetOpenedVenuesByMovieID retrieves opened venues for a specific movie and date from the database
func GetOpenedVenuesByMovieID(ctx context.Context, movieID string, date time.Time) ([]bson.M, error) {
	var openedVenues []bson.M

	// Get database collection
	collection := GetDatabase().Collection("opened_movies")
	//hexMovieID, _ := primitive.ObjectIDFromHex(movieID)

	filter := bson.M{
		"movie_id": movieID,
		"start_date": bson.M{
			"$lte": time.Date(date.Year(), date.Month(), date.Day(), 18, 30, 0, 0, time.UTC),
		},
		"end_date": bson.M{
			"$gte": time.Date(date.Year(), date.Month(), date.Day(), 18, 30, 0, 0, time.UTC),
		},
	}

	fmt.Println(filter)

	// Find opened venues matching the filter
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode opened venues from cursor
	if err := cursor.All(ctx, &openedVenues); err != nil {
		return nil, err
	}

	return openedVenues, nil
}

// GetVenueByID retrieves venue details by ID from the database
func GetVenueByID(ctx context.Context, venueID string) (bson.M, error) {
	var venue bson.M

	// Get database collection
	collection := GetDatabase().Collection("venues")

	hexVenueID, _ := primitive.ObjectIDFromHex(venueID)

	fmt.Println(hexVenueID)

	// Define filter to query venue by ID
	filter := bson.M{"_id": hexVenueID}

	// Find venue matching the filter
	if err := collection.FindOne(ctx, filter).Decode(&venue); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return venue, nil
}

// CheckOverlap checks if there is an overlap between two date ranges
func CheckOverlap(startDate1, endDate1, startDate2, endDate2 time.Time) bool {
	return startDate1.Before(endDate2) && endDate1.After(startDate2)
}

// CheckVenueAvailability checks if the venues are available for the specified date range
func CheckVenueAvailability(ctx context.Context, venues []string, startDate, endDate time.Time) (bool, error) {
	// Retrieve existing opened movies for the venues
	existingMovies, err := GetOpenedMoviesForVenues(ctx, venues)
	if err != nil {
		return false, err
	}

	// Check for overlap with existing opened movies
	for _, movie := range existingMovies {
		if CheckOverlap(movie.StartDate, movie.EndDate, startDate, endDate) {
			// There is an overlap, venues are not available
			return false, nil
		}
	}

	// No overlap, venues are available
	return true, nil
}

// GetOpenedMoviesForVenues retrieves opened movies that are associated with the given venues
func GetOpenedMoviesForVenues(ctx context.Context, venues []string) ([]models.OpenedMovie, error) {
	// Define a filter to find opened movies that contain any of the specified venues
	filter := bson.M{
		"venues": bson.M{"$in": venues},
	}

	// Define a slice to store the fetched opened movies
	var openedMovies []models.OpenedMovie

	// Find opened movies that match the filter
	cursor, err := client.Database("movie-booking").Collection("opened_movies").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate over the cursor and decode each document into an OpenedMovie struct
	for cursor.Next(ctx) {
		var openedMovie models.OpenedMovie
		if err := cursor.Decode(&openedMovie); err != nil {
			return nil, err
		}
		openedMovies = append(openedMovies, openedMovie)
	}

	// Check for any errors during cursor iteration
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return openedMovies, nil
}

// InsertBooking inserts a new booking record into the database
func InsertBooking(ctx context.Context, booking *models.Booking) error {
	// Get the collection
	collection := GetDatabase().Collection("bookings")

	// Insert the booking document into the collection
	_, err := collection.InsertOne(ctx, booking)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

// DeleteBooking deletes a booking record from the database
func DeleteBooking(ctx context.Context, booking *models.CancelBookingRequest) error {
	// Get the collection
	collection := GetDatabase().Collection("bookings")

	fmt.Println(booking.BookingID)

	hexBookingID, _ := primitive.ObjectIDFromHex(booking.BookingID)

	fmt.Println(hexBookingID)

	// Define the filter to find the booking to delete
	filter := bson.M{
		"_id": hexBookingID,
	}

	cursor, err := GetDatabase().Collection("bookings").Find(ctx, filter)
	if err != nil {
		fmt.Println("Error finding booking")
	}
	defer cursor.Close(ctx)

	// Delete the booking document from the collection
	deleteResult, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		fmt.Println("Error deleting booking:", err)
		return err
	}

	fmt.Println(deleteResult)

	// Check if any documents were deleted
	if deleteResult.DeletedCount == 0 {
		fmt.Println("No documents were deleted")
	} else {
		fmt.Println(deleteResult.DeletedCount, "document(s) deleted successfully")
	}

	return nil
}

// GetBookedSeats retrieves booked seats for a given venue ID and showtime
func GetBookedSeatsDB(ctx context.Context, venueID, showtime, date string) ([]int, error) {
	// Define a filter to query booked seats for the given venue ID and showtime
	filter := bson.M{
		"venueid":  venueID,
		"showtime": showtime,
		"date":     date,
	}

	fmt.Println(filter)

	// Retrieve booked seats from the database based on the filter
	cursor, err := GetDatabase().Collection("bookings").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate through the cursor and decode each document into a Seat model
	var bookedSeats []int
	for cursor.Next(ctx) {
		var booking models.Booking
		if err := cursor.Decode(&booking); err != nil {
			return nil, err
		}
		// Add the booked seat to the result
		bookedSeats = append(bookedSeats, booking.SeatNumbers...)
	}

	fmt.Println(bookedSeats)

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return bookedSeats, nil
}

// GetBookingsByUser fetches bookings based on the 'user' field
func GetBookingsByUser(ctx context.Context, user string) ([]models.Booking, error) {
	// Get the collection
	collection := GetDatabase().Collection("bookings")

	// Define filter to find bookings for the given user
	filter := bson.M{"user": user}

	// Find bookings that match the filter
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode bookings from cursor
	var bookings []models.Booking
	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}
