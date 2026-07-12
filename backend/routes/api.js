const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcrypt');

// GET /api/movies
router.get('/movies', async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM Movie";
    const params = [];

    if (status) {
      query += " WHERE Status = ?";
      params.push(status);
    }
    query += " ORDER BY Status ASC, ReleaseDate DESC";

    const [movies] = await db.query(query, params);
    res.json(movies);
  } catch (err) {
    console.error('API Movies error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/movies/:id
router.get('/movies/:id', async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM Movie WHERE MovieID = ?', [req.params.id]);
    if (movies.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(movies[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/screenings
router.get('/screenings', async (req, res) => {
  try {
    const { movieId } = req.query;
    let query = `
      SELECT s.*, m.Title AS MovieTitle, m.Genre, m.Duration, m.PosterURL, m.Status AS MovieStatus, r.RoomName
      FROM Screening s
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE s.StartTime >= NOW()
        AND m.Status = 'On Going'
    `;
    const params = [];

    if (movieId) {
      query += " AND s.MovieID = ?";
      params.push(movieId);
    }
    query += " ORDER BY s.StartTime ASC";

    const [screenings] = await db.query(query, params);
    res.json(screenings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/screenings/:id
router.get('/screenings/:id', async (req, res) => {
  try {
    const [screenings] = await db.query(`
      SELECT s.*, m.Title AS MovieTitle, m.Genre, m.Duration, m.PosterURL, m.Status AS MovieStatus, r.RoomName
      FROM Screening s
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE s.ScreeningID = ?
    `, [req.params.id]);
    
    if (screenings.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(screenings[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { senderName, senderEmail, subject, message } = req.body;
    if (!senderName || !senderEmail || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      'INSERT INTO Contact (SenderName, SenderEmail, Subject, Message) VALUES (?, ?, ?, ?)',
      [senderName, senderEmail, subject, message]
    );

    res.json({ success: true, message: 'Contact submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const [users] = await db.query(
      'SELECT * FROM User WHERE LOWER(Username) = LOWER(?) OR LOWER(Email) = LOWER(?)', [username, username]
    );

    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.Password);
    
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Trả về JSON cho mobile app 
    res.json({
      success: true,
      token: 'dummy-token-' + user.UserID,
      user: {
        UserID: user.UserID,
        Username: user.Username,
        FullName: user.FullName,
        Email: user.Email,
        Role: user.Role,
        token: 'dummy-token-' + user.UserID
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


function getUserIdFromToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('dummy-token-')) {
    // Format: dummy-token-<UserID>, ví dụ: dummy-token-3
    const parts = auth.split('-');
    // parts = ['dummy', 'token', '<UserID>']
    return parts[2] || null;
  }
  return null;
}

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;
    if (!username || !password || !fullname || !email) {
      return res.status(400).json({ error: 'Thiếu thông tin' });
    }

    const [existing] = await db.query(
      'SELECT Username FROM User WHERE Username = ? OR Email = ?', [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Tên đăng nhập hoặc email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO User (FullName, Email, Username, Password, Role) VALUES (?, ?, ?, ?, ?)',
      [fullname, email, username, hashedPassword, 'Client']
    );

    res.json({
      success: true,
      token: 'dummy-token-' + result.insertId,
      user: {
        UserID: result.insertId,
        Username: username,
        FullName: fullname,
        Email: email,
        Role: 'Client',
        token: 'dummy-token-' + result.insertId
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/movies/:id/comments
router.get('/movies/:id/comments', async (req, res) => {
  try {
    const [comments] = await db.query(`
      SELECT c.*, u.FullName, u.Username
      FROM Comment c
      JOIN User u ON c.UserID = u.UserID
      WHERE c.MovieID = ? AND c.IsVisible = TRUE
      ORDER BY c.CreatedAt DESC
    `, [req.params.id]);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/movies/:id/comments
router.post('/movies/:id/comments', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { content, rating } = req.body;
    if (!content || !rating) return res.status(400).json({ error: 'Missing content or rating' });

    await db.query(
      'INSERT INTO Comment (MovieID, UserID, Content, Rating) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Content = ?, Rating = ?, CreatedAt = CURRENT_TIMESTAMP',
      [req.params.id, userId, content, rating, content, rating]
    );

    const [[u]] = await db.query('SELECT Username, FullName FROM User WHERE UserID = ?', [userId]);

    res.json({ 
      success: true,
      comment: {
        MovieID: req.params.id,
        Username: u.Username,
        FullName: u.FullName,
        Rating: rating,
        Content: content,
        CreatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/screenings/:id/seats
router.get('/screenings/:id/seats', async (req, res) => {
  try {
    const screeningId = req.params.id;
    
    // Get screening info to get RoomID
    const [screenings] = await db.query('SELECT RoomID FROM Screening WHERE ScreeningID = ?', [screeningId]);
    if (screenings.length === 0) return res.status(404).json({ error: 'Screening not found' });
    const roomId = screenings[0].RoomID;

    // Get room seat config
    const [seats] = await db.query('SELECT * FROM Seat WHERE RoomID = ? ORDER BY Row, Number', [roomId]);

    // Build seat type map
    const seatTypes = {};
    seats.forEach(s => {
      seatTypes[`${s.Row}-${s.Number}`] = s.SeatType === 'Regular' ? 'regular' : s.SeatType === 'VIP' ? 'vip' : 'couple';
    });

    // Determine layout
    const maxRow = seats.reduce((max, s) => Math.max(max, s.Row.charCodeAt(0)), 64);
    const rows = maxRow > 64 ? maxRow - 64 : 10;
    const counts = seats.reduce((acc, s) => {
      acc[s.Row] = (acc[s.Row] || 0) + 1;
      return acc;
    }, {});
    const seatsPerRow = Object.values(counts).length > 0 ? Math.max(...Object.values(counts)) : 12;

    // Tìm các ghế đã được đặt
    const [tickets] = await db.query(`
      SELECT t.Row, t.Number FROM Ticket t
      JOIN Booking b ON t.BookingID = b.BookingID
      WHERE t.ScreeningID = ? AND b.Status IN ('Pending', 'Paid')
    `, [screeningId]);
    
    const occupiedSeats = tickets.map(t => ({ row: t.Row, number: t.Number }));
    
    res.json({
      rows,
      seatsPerRow,
      occupiedSeats,
      seatTypes,
      regularPrice: 80000,
      vipPrice: 100000,
      couplePrice: 200000,
      maxSelectable: 8,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/book/:id/confirm
router.post('/book/:id/confirm', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const screeningId = req.params.id;
    const { seats } = req.body;

    // Tính tổng giá
    const totalPrice = seats.reduce((sum, s) => sum + s.price, 0);

    // Lưu Booking
    const [bookingResult] = await db.query(
      'INSERT INTO Booking (UserID, ScreeningID, BookingTime, Status) VALUES (?, ?, CURRENT_TIMESTAMP, ?)',
      [userId, screeningId, 'Paid']
    );
    const bookingId = bookingResult.insertId;

    // Lưu Tickets
    for (let seat of seats) {
      await db.query(
        'INSERT INTO Ticket (BookingID, ScreeningID, Row, Number, Price) VALUES (?, ?, ?, ?, ?)',
        [bookingId, screeningId, seat.row, seat.number, seat.price]
      );
    }

    res.json({ success: true, bookingID: bookingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/my-tickets
router.get('/my-tickets', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [bookings] = await db.query(`
      SELECT b.*, s.StartTime, m.Title AS MovieTitle, m.PosterURL, r.RoomName
      FROM Booking b
      JOIN Screening s ON b.ScreeningID = s.ScreeningID
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE b.UserID = ?
      ORDER BY b.BookingTime DESC
    `, [userId]);

    for (let i = 0; i < bookings.length; i++) {
      const [tickets] = await db.query(
        'SELECT * FROM Ticket WHERE BookingID = ?', [bookings[i].BookingID]
      );
      bookings[i].Seats = tickets.map(t => `${t.Row}${t.Number}`).join(', ');
      bookings[i].TotalPrice = tickets.reduce((sum, t) => sum + parseFloat(t.Price), 0);
    }

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
