import express from 'express';
import bcrypt from 'bcrypt';
import database from '../data/database.js';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and name are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const db = database.getDB();

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }

      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }

      try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user (default status is VISITOR)
        db.run(
          'INSERT INTO users (email, password, name, status) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, name, 'VISITOR'],
          function(insertErr) {
            if (insertErr) {
              console.error('Error creating user:', insertErr);
              return res.status(500).json({ 
                success: false, 
                message: 'Failed to create user' 
              });
            }

            // Return success with user info
            return res.json({ 
              success: true, 
              message: 'Registration successful',
              user: {
                id: this.lastID,
                email: email,
                name: name,
                status: 'VISITOR'
              }
            });
          }
        );
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }
    });
  } catch (error) {
    console.error('Error in registration route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const db = database.getDB();

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          return res.json({ 
            success: true, 
            message: 'Successful login',
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              status: user.status
            }
          });
        } else {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' 
          });
        }
      } catch (compareError) {
        console.error('Error comparing passwords:', compareError);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }
    });
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router;

