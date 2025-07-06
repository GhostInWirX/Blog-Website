const bcrypt = require('bcryptjs');

(async () => {
  const hashedPassword = await bcrypt.hash("nishi123", 10); // Replace "adminpassword" with your desired password
  console.log(hashedPassword);
})();