const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const db = require('../config/firebaseConfig');

const storage = admin.storage().bucket();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    try {
      const foodsCollection = await db.collection('foods').get();
      const foods = foodsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  module.exports = router;