const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supabase lekérdezés (vagy amilyen adatbázist használsz)
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single(); // Fontos: csak egy objektumot várunk, nem tömböt!

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Autó nem található" });

    res.json(data);
  } catch (error) {
    console.error("Hiba az autó lekérésekor:", error);
    res.status(500).json({ message: "Szerver hiba" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton...`));