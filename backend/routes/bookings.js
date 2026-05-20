const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Seat selection page
router.get('/book/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const [screenings] = await db.query(`
      SELECT s.*, m.Title AS MovieTitle, m.PosterURL, r.RoomName, r.RoomSize
      FROM Screening s
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE s.ScreeningID = ?
    `, [req.params.id]);

    if (screenings.length === 0) return res.status(404).send('Không tìm thấy suất chiếu');

    const screening = screenings[0];

    // Get room seat config
    const [seats] = await db.query(
      'SELECT * FROM Seat WHERE RoomID = ? ORDER BY Row, Number',
      [screening.RoomID]
    );

    // Get occupied seats for this screening
    const [occupied] = await db.query(`
      SELECT DISTINCT t.Row, t.Number
      FROM Ticket t
      JOIN Booking b ON t.BookingID = b.BookingID
      WHERE t.ScreeningID = ? AND b.Status IN ('Pending', 'Paid')
    `, [req.params.id]);

    // Build seat type map
    const seatTypes = {};
    const occupiedSeats = occupied.map(o => ({ row: o.Row, number: o.Number }));

    seats.forEach(s => {
      seatTypes[`${s.Row}-${s.Number}`] = s.SeatType === 'Regular' ? 'regular'
        : s.SeatType === 'VIP' ? 'vip' : 'couple';
    });

    // Determine layout
    const maxRow = seats.reduce((max, s) => Math.max(max, s.Row.charCodeAt(0)), 64);
    const rows = maxRow - 64;
    const counts = seats.reduce((acc, s) => {
      acc[s.Row] = (acc[s.Row] || 0) + 1;
      return acc;
    }, {});
    const seatsPerRow = Object.values(counts).length > 0 ? Math.max(...Object.values(counts)) : 12;

    const error = req.session.bookingError || null;
    req.session.bookingError = null;

    res.render('seat-selection', {
      currentPage: 'booking',
      error,
      screeningID: screening.ScreeningID,
      movie: { Title: screening.MovieTitle, PosterURL: screening.PosterURL },
      roomName: screening.RoomName,
      startTime: screening.StartTime,
      occupiedSeats,
      seatTypes,
      rows,
      seatsPerRow,
      regularPrice: parseFloat(screening.BasePrice),
      vipPrice: Math.round(parseFloat(screening.BasePrice) * 1.3),
      couplePrice: parseFloat(screening.BasePrice) * 2
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Confirm booking - create pending booking
router.post('/book/:id/confirm', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const screeningID = parseInt(req.params.id);
    const selectedSeats = JSON.parse(req.body.seats);
    const total = parseFloat(req.body.total);

    if (!selectedSeats || selectedSeats.length === 0) {
      return res.redirect(`/book/${screeningID}`);
    }

    // Fetch real RoomID
    const [screenings] = await db.query('SELECT RoomID FROM Screening WHERE ScreeningID = ?', [screeningID]);
    if (screenings.length === 0) return res.status(404).send('Không tìm thấy suất chiếu');
    const roomID = screenings[0].RoomID;

    // Check if seats are still available
    for (const seat of selectedSeats) {
      const [occupied] = await db.query(`
        SELECT t.TicketID FROM Ticket t
        JOIN Booking b ON t.BookingID = b.BookingID
        WHERE t.ScreeningID = ? AND t.Row = ? AND t.Number = ? AND b.Status IN ('Pending', 'Paid')
      `, [screeningID, seat.row, seat.number]);

      if (occupied.length > 0) {
        req.session.bookingError = `Ghế ${seat.row}${seat.number} đã có người đặt, vui lòng chọn ghế khác.`;
        return res.redirect(`/book/${screeningID}`);
      }
    }

    // Create booking
    const [bookingResult] = await db.query(
      'INSERT INTO Booking (UserID, ScreeningID, Status) VALUES (?, ?, ?)',
      [req.session.user.UserID, screeningID, 'Pending']
    );

    const bookingID = bookingResult.insertId;

    // Create tickets
    for (const seat of selectedSeats) {
      await db.query(
        'INSERT INTO Ticket (BookingID, ScreeningID, RoomID, Row, Number, Price) VALUES (?, ?, ?, ?, ?, ?)',
        [bookingID, screeningID, roomID, seat.row, seat.number, seat.price]
      );
    }

    res.redirect(`/checkout/${bookingID}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Payment confirmation (mock)
router.post('/book/:id/pay', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const bookingID = parseInt(req.body.bookingID);
    await db.query(
      "UPDATE Booking SET Status = 'Paid', BookingTime = CURRENT_TIMESTAMP WHERE BookingID = ? AND UserID = ?",
      [bookingID, req.session.user.UserID]
    );

    req.session.pendingBooking = null;
    res.redirect('/my-tickets');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// Checkout page (for pending bookings)
router.get('/checkout/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const [bookings] = await db.query(`
      SELECT b.*, s.StartTime, s.BasePrice, m.Title AS MovieTitle, r.RoomName
      FROM Booking b
      JOIN Screening s ON b.ScreeningID = s.ScreeningID
      JOIN Movie m ON s.MovieID = m.MovieID
      JOIN Room r ON s.RoomID = r.RoomID
      WHERE b.BookingID = ? AND b.UserID = ?
    `, [req.params.id, req.session.user.UserID]);

    if (bookings.length === 0) return res.status(404).send('Không tìm thấy đơn hàng');

    const booking = bookings[0];

    const [tickets] = await db.query(
      'SELECT * FROM Ticket WHERE BookingID = ?',
      [req.params.id]
    );

    const seats = tickets.map(t => ({
      row: t.Row,
      number: t.Number,
      price: parseFloat(t.Price),
      type: 'regular'
    }));
    const total = seats.reduce((sum, s) => sum + s.price, 0);

    res.render('checkout', {
      currentPage: 'booking',
      bookingID: booking.BookingID,
      screeningID: booking.ScreeningID,
      movie: { Title: booking.MovieTitle },
      roomName: booking.RoomName,
      startTime: booking.StartTime,
      seats,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

// AJAX: check seat availability
router.get('/api/seats/:screeningID', async (req, res) => {
  try {
    const [occupied] = await db.query(`
      SELECT DISTINCT t.Row, t.Number
      FROM Ticket t
      JOIN Booking b ON t.BookingID = b.BookingID
      WHERE t.ScreeningID = ? AND b.Status IN ('Pending', 'Paid')
    `, [req.params.screeningID]);

    res.json({ occupied: occupied.map(o => ({ row: o.Row, number: o.Number })) });
  } catch (err) {
    res.json({ occupied: [] });
  }
});

module.exports = router;
