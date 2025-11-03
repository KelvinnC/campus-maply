import express from 'express';
import bcrypt from 'bcrypt';
import database from '../data/database.js';

const router = express.Router();

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

