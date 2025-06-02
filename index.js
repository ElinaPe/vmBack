const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));

// Tuo reitit toisesta tiedostosta
const coffeeRoutes = require('./src/routes/coffeeRoutes');
// const foodsRoutes = require('./src/routes/foodRoutes');

// Käytä reittejä sovelluksessa
app.use('/api', coffeeRoutes);
// app.use('/api/foods', foodsRoutes);


// Kuuntele porttia
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

