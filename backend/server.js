const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend-web', 'src', 'pages'));
app.locals.basedir = path.join(__dirname, '..', 'frontend-web', 'src');

// Static files
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend-web', 'src', 'assets')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend-web', 'src', 'js')));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Session
app.use(session({
  secret: 'cinema-booking-secret-key-2026',
  cookie: { maxAge: 15 * 60000 },
  saveUninitialized: true,
  resave: true
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// View counter middleware
app.use(async (req, res, next) => {
  if (req.path.startsWith('/assets') || req.path.startsWith('/js') || req.path.startsWith('/api')) return next();
  try {
    const db = require('./database/db');
    await db.query('UPDATE SystemStats SET ViewCount = ViewCount + 1, LastUpdated = CURRENT_TIMESTAMP WHERE StatID = 1');
  } catch (e) { /* ignore */ }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const apiRoutes = require('./routes/api');

// Mount JSON API cho mobile app
app.use('/api', apiRoutes);

app.use(authRoutes);
app.use(movieRoutes);
app.use(bookingRoutes);
app.use(adminRoutes);
app.use(contactRoutes);

// Home
app.get('/', async (req, res) => {
  let nowShowing = [];
  let comingSoon = [];
  let activeAd = null;

  try {
    const db = require('./database/db');
    const [movies] = await db.query(
      "SELECT * FROM Movie WHERE Status = 'On Going' ORDER BY ReleaseDate DESC"
    );
    nowShowing = movies;
  } catch (err) { console.error('DB home:', err.message); }

  try {
    const db = require('./database/db');
    const [coming] = await db.query(
      "SELECT * FROM Movie WHERE Status = 'Up Coming' ORDER BY ReleaseDate ASC"
    );
    comingSoon = coming;
  } catch (err) { console.error('DB home:', err.message); }

  try {
    const db = require('./database/db');
    const [ads] = await db.query(
      "SELECT * FROM Advertisement WHERE IsActive = TRUE LIMIT 1"
    );
    if (ads.length > 0) {
      activeAd = ads[0];
    }
  } catch (err) { console.error('DB ad:', err.message); }

  const banners = nowShowing.map(m => ({
    image: m.PosterURL || '/assets/poster-placeholder.jpg',
    title: m.Title,
    movieId: m.MovieID
  }));

  res.render('main-page', {
    currentPage: 'home',
    nowShowing,
    comingSoon,
    banners,
    activeAd
  });
});


// About
app.get('/about', (req, res) => {
  res.render('about', { currentPage: 'about' });
});

// 404
app.use((req, res) => {
  res.status(404).send('404 - Không tìm thấy trang');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(500).send('500 - Lỗi server');
});

app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});
