const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Search for recipes by ingredients
app.post("/recipes/search", async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: "Ingredients are required." });
    }

    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/findByIngredients`,
            {
                params: {
                    ingredients: ingredients.join(","),
                    number: 10, // Number of recipes to fetch
                    apiKey: process.env.SPOONACULAR_API_KEY,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});

// Fetch recipe details by ID
app.get("/recipes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/${id}/information`,
            {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: "Recipe not found." });
        } else {
            res.status(500).json({ error: "Failed to fetch recipe details." });
        }
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
