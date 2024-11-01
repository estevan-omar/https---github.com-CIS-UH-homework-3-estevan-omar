const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route to render the initial page
app.get('/', (req, res) => {
    res.render('index', { products: [], sorted: false });
});

// Route to fetch random products from the Fake Store API
app.get('/load-products', async (req, res) => {
    try {
        // Fetch all products
        const response = await axios.get('https://fakestoreapi.com/products');
        const products = response.data;

        // Select three random products
        let randomProducts = [];
        while (randomProducts.length < 3) {
            const randomIndex = Math.floor(Math.random() * products.length);
            const product = products[randomIndex];
            if (!randomProducts.includes(product)) {
                randomProducts.push(product);
            }
        }

        // Check if sorting is requested
        const sorted = req.query.sorted === 'true';
        if (sorted) {
            randomProducts.sort((a, b) => a.title.localeCompare(b.title));
        }

        res.render('index', { products: randomProducts, sorted });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
