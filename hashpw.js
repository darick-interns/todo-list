import bcrypt from 'bcrypt';

const plainPassword = '1234';

// 1234 = $2b$10$y0nroV2bcj2UydghBKAlbO7izRJ.7nRJHDB0u0EBFCxdLA7yWsgHq

bcrypt.hash(plainPassword, 10, function(err, hash) {
    if (err) {
      console.log(err);
    } else {
      console.log(hash);
    }
  });