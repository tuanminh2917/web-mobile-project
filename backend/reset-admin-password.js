const bcrypt = require('bcrypt');
const db = require('./database/db');
(async () => {
  try {
    const newPassword = 'admin123'; // set your desired password here
    const hash = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query('UPDATE User SET Password = ?, Role = ? WHERE Username = ?', [hash, 'Admin', 'admin01']);
    console.log('Password reset for admin01. Rows affected:', result.affectedRows);
  } catch (err) {
    console.error('Error resetting admin password:', err);
  } finally {
    process.exit();
  }
})();
