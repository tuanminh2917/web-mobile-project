const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^0[0-9]{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { currentPage: 'login', error: null, success: null, formData: {} });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('login', { currentPage: 'login', error: 'Vui lòng nhập đầy đủ thông tin', success: null, formData: req.body });
    }

    const [users] = await db.query(
      'SELECT * FROM User WHERE Username = ?', [username]
    );

    if (users.length === 0) {
      return res.render('login', { currentPage: 'login', error: 'Sai tên đăng nhập hoặc mật khẩu', success: null, formData: req.body });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.render('login', { currentPage: 'login', error: 'Sai tên đăng nhập hoặc mật khẩu', success: null, formData: req.body });
    }

     req.session.user = {
      UserID: user.UserID,
      Username: user.Username,
      FullName: user.FullName,
      Email: user.Email,
      Role: user.Role
    };

    const redirectUrl = user.Role === 'Admin' ? '/admin/dashboard' : '/';
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.render('login', { currentPage: 'login', error: 'Lỗi hệ thống', success: null, formData: req.body });
  }
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { currentPage: 'register', error: null, success: null, formData: {} });
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { fullname, dob, email, phone, username, password, confirm_password } = req.body;

    if (!username || !password || !confirm_password || !fullname || !email || !phone || !dob) {
      return res.render('register', { currentPage: 'register', error: 'Vui lòng điền đầy đủ thông tin', success: null, formData: req.body });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.render('register', { currentPage: 'register', error: 'Email không đúng định dạng (vd: abc@xyz.com)', success: null, formData: req.body });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.render('register', { currentPage: 'register', error: 'Số điện thoại phải có 10 số, bắt đầu bằng 0 (vd: 0912345678)', success: null, formData: req.body });
    }

    const dobDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
      return res.render('register', { currentPage: 'register', error: 'Ngày sinh không thể ở tương lai', success: null, formData: req.body });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.render('register', { currentPage: 'register', error: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt', success: null, formData: req.body });
    }

    if (password !== confirm_password) {
      return res.render('register', { currentPage: 'register', error: 'Mật khẩu xác nhận không khớp', success: null, formData: req.body });
    }

    const [existing] = await db.query(
      'SELECT Username FROM User WHERE Username = ? OR Email = ?', [username, email]
    );

    if (existing.length > 0) {
      return res.render('register', { currentPage: 'register', error: 'Tên đăng nhập hoặc email đã tồn tại', success: null, formData: req.body });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO User (FullName, DateOfBirth, Email, Phone, Username, Password, Role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullname, dob, email, phone, username, hashedPassword, 'Client']
    );

    res.render('register', {
      currentPage: 'register',
      error: null,
      success: 'Đăng ký thành công! Chào mừng bạn đến với Cinema.',
      formData: {}
    });
  } catch (err) {
    console.error(err);
    res.render('register', { currentPage: 'register', error: 'Lỗi hệ thống', success: null, formData: req.body });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
