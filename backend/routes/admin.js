const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Auth middleware
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.Role !== 'Admin') {
    return res.redirect('/login');
  }
  next();
}

// Dashboard
router.get('/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const [moviesCount] = await db.query("SELECT COUNT(*) AS count FROM Movie WHERE Status = 'On Going'");
    const [usersCount] = await db.query('SELECT COUNT(*) AS count FROM User');
    const [stats] = await db.query('SELECT * FROM SystemStats WHERE StatID = 1');

    const [todayBookings] = await db.query(
      "SELECT COUNT(*) AS count, COALESCE(SUM(t.Price), 0) AS revenue FROM Booking b LEFT JOIN Ticket t ON b.BookingID = t.BookingID WHERE DATE(b.BookingTime) = CURDATE() AND b.Status = 'Paid'"
    );

    const [totalRevenue] = await db.query(
      "SELECT COALESCE(SUM(t.Price), 0) AS total FROM Booking b JOIN Ticket t ON b.BookingID = t.BookingID WHERE b.Status = 'Paid'"
    );

    const [recentBookings] = await db.query(`
      SELECT b.*, u.FullName, u.Username, m.Title AS MovieTitle
      FROM Booking b
      JOIN User u ON b.UserID = u.UserID
      JOIN Screening s ON b.ScreeningID = s.ScreeningID
      JOIN Movie m ON s.MovieID = m.MovieID
      ORDER BY b.BookingTime DESC LIMIT 10
    `);

    // Get seats for each booking
    for (let i = 0; i < recentBookings.length; i++) {
      const [tickets] = await db.query(
        'SELECT * FROM Ticket WHERE BookingID = ?', [recentBookings[i].BookingID]
      );
      recentBookings[i].Seats = tickets.map(t => `${t.Row}${t.Number}`).join(', ');
      recentBookings[i].TotalPrice = tickets.reduce((sum, t) => sum + parseFloat(t.Price), 0);
    }

    res.render('admin/dashboard', {
      currentPage: 'admin',
      stats: {
        viewCount: stats[0]?.ViewCount || 0,
        moviesCount: moviesCount[0].count,
        todayBookings: todayBookings[0].count,
        todayRevenue: parseFloat(todayBookings[0].revenue),
        usersCount: usersCount[0].count,
        totalRevenue: parseFloat(totalRevenue[0].total)
      },
      recentBookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Movies management
router.get('/admin/movies', requireAdmin, async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM Movie ORDER BY MovieID DESC');
    res.render('admin/movies', { currentPage: 'admin', movies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

router.post('/admin/movies', requireAdmin, async (req, res) => {
  try {
    const { title, genre, duration, releaseDate, status, description, director, actor, languages, censorship, posterURL } = req.body;
    await db.query(
      'INSERT INTO Movie (Title, Genre, Duration, ReleaseDate, Status, Description, Director, Actor, Languages, Censorship, PosterURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, genre, parseInt(duration) || 0, releaseDate, status, description, director, actor, languages, censorship, posterURL]
    );
    res.redirect('/admin/movies');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/movies');
  }
});

router.post('/admin/movies/:id/update', requireAdmin, async (req, res) => {
  try {
    const { title, genre, duration, releaseDate, status, description, director, actor, languages, censorship, posterURL } = req.body;
    await db.query(
      'UPDATE Movie SET Title = ?, Genre = ?, Duration = ?, ReleaseDate = ?, Status = ?, Description = ?, Director = ?, Actor = ?, Languages = ?, Censorship = ?, PosterURL = ? WHERE MovieID = ?',
      [title, genre, parseInt(duration) || 0, releaseDate, status, description, director, actor, languages, censorship, posterURL, req.params.id]
    );
    res.redirect('/admin/movies');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/movies');
  }
});

router.post('/admin/movies/:id/delete', requireAdmin, async (req, res) => {
  try {
    // Delete related screenings and tickets first
    const [screenings] = await db.query('SELECT ScreeningID FROM Screening WHERE MovieID = ?', [req.params.id]);
    for (let s of screenings) {
      await db.query('DELETE FROM Ticket WHERE ScreeningID = ?', [s.ScreeningID]);
      await db.query('DELETE FROM Booking WHERE ScreeningID = ?', [s.ScreeningID]);
    }
    await db.query('DELETE FROM Screening WHERE MovieID = ?', [req.params.id]);
    
    // Delete comments
    await db.query('DELETE FROM Comment WHERE MovieID = ?', [req.params.id]);
    
    // Delete movie
    await db.query('DELETE FROM Movie WHERE MovieID = ?', [req.params.id]);
    res.redirect('/admin/movies');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/movies');
  }
});

// Screenings management
router.get('/admin/screenings', requireAdmin, async (req, res) => {
  try {
    const [screenings] = await db.query(`
      SELECT s.*, m.Title AS MovieTitle, r.RoomName
      FROM Screening s
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      ORDER BY s.StartTime DESC
    `);
    const [movies] = await db.query("SELECT MovieID, Title FROM Movie WHERE Status != 'Stoped'");
    res.render('admin/screenings', { currentPage: 'admin', screenings, movies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

router.post('/admin/screenings', requireAdmin, async (req, res) => {
  try {
    const { movieID, roomID, startTime, basePrice } = req.body;

    // Get movie duration
    const [movies] = await db.query('SELECT Duration FROM Movie WHERE MovieID = ?', [movieID]);
    const duration = movies[0]?.Duration || 120;

    // Calculate end time (duration + 15min cleanup)
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration + 15) * 60000);

    await db.query(
      'INSERT INTO Screening (MovieID, RoomID, StartTime, EndTime, BasePrice) VALUES (?, ?, ?, ?, ?)',
      [movieID, roomID, startTime, end.toISOString().slice(0, 19).replace('T', ' '), parseFloat(basePrice)]
    );

    res.redirect('/admin/screenings');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/screenings');
  }
});

// Bookings management
router.get('/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, u.FullName, u.Username, m.Title AS MovieTitle, s.StartTime
      FROM Booking b
      JOIN User u ON b.UserID = u.UserID
      JOIN Screening s ON b.ScreeningID = s.ScreeningID
      JOIN Movie m ON s.MovieID = m.MovieID
      ORDER BY b.BookingTime DESC
    `);

    for (let i = 0; i < bookings.length; i++) {
      const [tickets] = await db.query(
        'SELECT * FROM Ticket WHERE BookingID = ?', [bookings[i].BookingID]
      );
      bookings[i].Seats = tickets.map(t => `${t.Row}${t.Number}`).join(', ');
      bookings[i].TotalPrice = tickets.reduce((sum, t) => sum + parseFloat(t.Price), 0);
    }

    res.render('admin/bookings', { currentPage: 'admin', bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Users management
router.get('/admin/users', requireAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM User ORDER BY UserID');
    res.render('admin/users', { currentPage: 'admin', users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Comments management
router.get('/admin/comments', requireAdmin, async (req, res) => {
  try {
    const [comments] = await db.query(`
      SELECT c.*, u.FullName, u.Username, m.Title AS MovieTitle
      FROM Comment c
      JOIN User u ON c.UserID = u.UserID
      JOIN Movie m ON c.MovieID = m.MovieID
      ORDER BY c.CreatedAt DESC
    `);
    res.render('admin/comments', { currentPage: 'admin', comments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Toggle comment visibility
router.post('/admin/comments/:movieID/:userID/toggle', requireAdmin, async (req, res) => {
  try {
    const { movieID, userID } = req.params;
    // Get current visibility
    const [current] = await db.query(
      'SELECT IsVisible FROM Comment WHERE MovieID = ? AND UserID = ?',
      [movieID, userID]
    );
    if (current.length === 0) return res.redirect('/admin/comments');
    
    const newVisibility = !current[0].IsVisible;
    await db.query(
      'UPDATE Comment SET IsVisible = ? WHERE MovieID = ? AND UserID = ?',
      [newVisibility, movieID, userID]
    );
    res.redirect('/admin/comments');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/comments');
  }
});

// Delete comment
router.post('/admin/comments/:movieID/:userID/delete', requireAdmin, async (req, res) => {
  try {
    const { movieID, userID } = req.params;
    await db.query(
      'DELETE FROM Comment WHERE MovieID = ? AND UserID = ?',
      [movieID, userID]
    );
    res.redirect('/admin/comments');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/comments');
  }
});

// Advertisements management
router.get('/admin/advertisements', requireAdmin, async (req, res) => {
  try {
    const [ads] = await db.query('SELECT * FROM Advertisement ORDER BY AdID DESC');
    res.render('admin/advertisements', { currentPage: 'admin', ads });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

router.post('/admin/advertisements', requireAdmin, async (req, res) => {
  try {
    const { productTitle, imageURL, targetLink, isActive } = req.body;
    await db.query(
      'INSERT INTO Advertisement (ProductTitle, ImageURL, TargetLink, IsActive) VALUES (?, ?, ?, ?)',
      [productTitle, imageURL, targetLink, isActive === 'on' ? 1 : 0]
    );
    res.redirect('/admin/advertisements');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/advertisements');
  }
});

router.post('/admin/advertisements/:id/update', requireAdmin, async (req, res) => {
  try {
    const { productTitle, imageURL, targetLink, isActive } = req.body;
    await db.query(
      'UPDATE Advertisement SET ProductTitle = ?, ImageURL = ?, TargetLink = ?, IsActive = ? WHERE AdID = ?',
      [productTitle, imageURL, targetLink, isActive === 'on' ? 1 : 0, req.params.id]
    );
    res.redirect('/admin/advertisements');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/advertisements');
  }
});

router.post('/admin/advertisements/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [current] = await db.query('SELECT IsActive FROM Advertisement WHERE AdID = ?', [id]);
    if (current.length === 0) return res.redirect('/admin/advertisements');
    
    const newStatus = !current[0].IsActive;
    await db.query('UPDATE Advertisement SET IsActive = ? WHERE AdID = ?', [newStatus, id]);
    res.redirect('/admin/advertisements');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/advertisements');
  }
});

router.post('/admin/advertisements/:id/delete', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Advertisement WHERE AdID = ?', [req.params.id]);
    res.redirect('/admin/advertisements');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/advertisements');
  }
});

// Contact messages management
router.get('/admin/contact', requireAdmin, async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM Contact ORDER BY CreatedAt DESC');
    res.render('admin/contact', { currentPage: 'admin', messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

router.post('/admin/contact/:id/delete', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Contact WHERE ContactID = ?', [req.params.id]);
    res.redirect('/admin/contact');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/contact');
  }
});

module.exports = router;
