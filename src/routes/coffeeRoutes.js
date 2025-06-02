const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const db = require('../config/firebaseConfig');

const storage = admin.storage().bucket();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/coffees', async (req, res) => {
  try {
    const coffeeCollection = await db.collection('coffees').get();
    const coffees = coffeeCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(coffees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/coffees', upload.single('image'), async (req, res) => {
    try {
      const { name, ingredients, instructions, category } = req.body;
      const ingredientsArray = JSON.parse(ingredients || '[]');
      const categoryArray = JSON.parse(category || '[]');
  
      let imageUrl = '';
  
      if (req.file) {
        const blob = storage.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
  
        await new Promise((resolve, reject) => {
            blobStream.on('finish', async () => {
              imageUrl = await blob.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
              });
              resolve();
            });
    
  
          blobStream.on('error', reject);
          blobStream.end(req.file.buffer);
        });
      }
  
      const data = {
        name,
        ingredients: ingredientsArray,
        instructions,
        category: categoryArray,
        imageUrl: imageUrl[0] || '',
      };
  
      const result = await db.collection('coffees').add(data);
      res.status(201).json({ id: result.id });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
  


router.put('/coffees/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, ingredients, instructions, category } = req.body;
    const updatedCoffee = {
      name,
      ingredients: JSON.parse(ingredients),
      instructions,
      category: JSON.parse(category)
    };

    if (req.file) {
      const blob = storage.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });

      blobStream.on('error', (error) => {
        res.status(500).json({ error: error.message });
      });

      blobStream.on('finish', async () => {
        updatedCoffee.imageUrl = `https://storage.googleapis.com/${storage.name}/${blob.name}`;
        await db.collection('coffees').doc(req.params.id).update(updatedCoffee);
        res.status(200).json({ id: req.params.id, ...updatedCoffee });
      });

      blobStream.end(req.file.buffer);
    } else {
      await db.collection('coffees').doc(req.params.id).update(updatedCoffee);
      res.status(200).json({ id: req.params.id, ...updatedCoffee });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/coffees/:id', async (req, res) => {
  try {
    await db.collection('coffees').doc(req.params.id).delete();
    res.status(200).json({ message: 'Kahavi poistettu onnistuneesti!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
