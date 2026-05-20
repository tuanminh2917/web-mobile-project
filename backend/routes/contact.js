const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { currentPage: 'contact' });
});

// Contact form submit
router.post('/contact', async (req, res) => {
  try {
    const { senderName, senderEmail, subject, message } = req.body;
    if (!senderName || !senderEmail || !subject || !message) {
      return res.render('contact', { currentPage: 'contact', error: 'Vui lòng điền đầy đủ thông tin' });
    }

    await db.query(
      'INSERT INTO Contact (SenderName, SenderEmail, Subject, Message) VALUES (?, ?, ?, ?)',
      [senderName, senderEmail, subject, message]
    );

    res.render('contact', { currentPage: 'contact', success: 'Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.' });
  } catch (err) {
    console.error(err);
    res.render('contact', { currentPage: 'contact', error: 'Lỗi hệ thống' });
  }
});

module.exports = router;
