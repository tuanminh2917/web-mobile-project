const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Movie listing page
router.get('/movies', async (req, res) => {
  let movies = [];
  try {
    const [m] = await db.query("SELECT * FROM Movie ORDER BY Status ASC, ReleaseDate DESC");
    movies = m;
  } catch (err) { console.error('DB movies:', err.message); }

  res.render('main-page', {
    currentPage: 'movies',
    nowShowing: movies.filter(m => m.Status === 'On Going'),
    comingSoon: movies.filter(m => m.Status === 'Up Coming'),
    activeAd: null
  });
});

// Showtime page
router.get('/showtime', async (req, res) => {
  let movies = [];
  let screenings = [];

  try {
    const [m] = await db.query("SELECT MovieID, Title FROM Movie WHERE Status IN ('On Going', 'Up Coming')");
    movies = m;
  } catch (err) { console.error('DB movies:', err.message); }

  try {
    const [s] = await db.query(`
      SELECT s.*, m.Title AS MovieTitle, m.Genre, m.Duration, m.PosterURL, r.RoomName
      FROM Screening s
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE s.StartTime >= NOW()
      ORDER BY s.StartTime ASC
      LIMIT 20
    `);
    screenings = s;
  } catch (err) { console.error('DB screenings:', err.message); }

  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  res.render('showtime', {
    currentPage: 'showtime',
    movies,
    screenings,
    dates
  });
});

// Movie detail page
router.get('/movies/:id', async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM Movie WHERE MovieID = ?', [req.params.id]);
    if (movies.length === 0) return res.status(404).send('Không tìm thấy phim');

    const movie = movies[0];

    // Get screenings grouped by date
    const [screenings] = await db.query(`
      SELECT s.*, r.RoomName, r.RoomSize
      FROM Screening s
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE s.MovieID = ? AND s.StartTime >= NOW()
      ORDER BY s.StartTime ASC
    `, [req.params.id]);

    // Group by room
    const screeningByRoom = {};
    screenings.forEach(s => {
      const key = s.RoomName;
      if (!screeningByRoom[key]) screeningByRoom[key] = [];
      screeningByRoom[key].push(s);
    });

    // Get dates
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Get comments
    const [comments] = await db.query(`
      SELECT c.*, u.FullName, u.Username
      FROM Comment c
      JOIN User u ON c.UserID = u.UserID
      WHERE c.MovieID = ? AND c.IsVisible = TRUE
      ORDER BY c.CreatedAt DESC
    `, [req.params.id]);

    // Average rating
    const [ratingResult] = await db.query(
      'SELECT AVG(Rating) AS avgRating FROM Comment WHERE MovieID = ? AND IsVisible = TRUE',
      [req.params.id]
    );

    res.render('movie-detail', {
      currentPage: 'movies',
      movie,
      screenings: screeningByRoom,
      dates,
      comments,
      avgRating: ratingResult[0].avgRating ? parseFloat(ratingResult[0].avgRating).toFixed(1) : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Submit comment
router.post('/movies/:id/comment', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const { content, rating } = req.body;
    if (!content || !rating) return res.redirect(`/movies/${req.params.id}`);

    await db.query(
      'INSERT INTO Comment (MovieID, UserID, Content, Rating) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Content = ?, Rating = ?, CreatedAt = CURRENT_TIMESTAMP',
      [req.params.id, req.session.user.UserID, content, rating, content, rating]
    );

    res.redirect(`/movies/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/movies/${req.params.id}`);
  }
});

// My tickets
router.get('/my-tickets', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const [bookings] = await db.query(`
      SELECT b.*, s.StartTime, m.Title AS MovieTitle, m.PosterURL, r.RoomName
      FROM Booking b
      JOIN Screening s ON b.ScreeningID = s.ScreeningID
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE b.UserID = ?
      ORDER BY b.BookingTime DESC
    `, [req.session.user.UserID]);

    // Get tickets for each booking
    for (let i = 0; i < bookings.length; i++) {
      const [tickets] = await db.query(`
        SELECT * FROM Ticket WHERE BookingID = ?
      `, [bookings[i].BookingID]);

      bookings[i].Seats = tickets.map(t => `${t.Row}${t.Number}`).join(', ');
      bookings[i].TotalPrice = tickets.reduce((sum, t) => sum + parseFloat(t.Price), 0);
    }

    res.render('my-tickets', {
      currentPage: 'my-tickets',
      bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;
