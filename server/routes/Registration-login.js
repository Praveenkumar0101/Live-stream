


const express= require('express')
const User = require('../models/Registration')
const router = express.Router();

const bcrypt = require('bcrypt')





const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };



router.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password,10);
  
    
  
    const user = new User({
      name,
      email,
      password: passwordHash
      
    });
  
    try {
      await user.save();
      res.send('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Server error');
    }
  });



  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {                                  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('Invalid email or password');
      }
  
      const decryptedPassword = bcrypt.compare(password,user.password);
      if (decryptedPassword) {
        res.send('Login successful');
      } else {
        res.status(404).send('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Server error');
    }
  });


  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Invalid email or password');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            res.send('Login successful!');
        } else {
            res.status(404).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Server error');
    }
});

  

module.exports = router;