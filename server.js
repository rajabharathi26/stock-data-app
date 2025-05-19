const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/upload', upload.single('csvFile'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          const [date, time] = row.timestamp.split(' ');
          await pool.query(
            `INSERT INTO stocks (symbol, date, time, open, high, low, close, volume)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              row.symbol,
              date,
              time,
              row.open,
              row.high,
              row.low,
              row.close,
              row.volume
            ]
          );
        }
        res.json({ message: '✅ CSV data inserted successfully!' });
      } catch (error) {
        res.status(500).json({ error: '❌ Database insert failed', details: error.message });
      }
    });
});

app.get('/search', async (req, res) => {
  const { symbol, dateFrom, dateTo, timeFrom, timeTo } = req.query;

  let query = 'SELECT * FROM stocks WHERE 1=1';
  const values = [];

  if (symbol) {
    values.push(symbol.toUpperCase());
    query += ` AND symbol = $${values.length}`;
  }
  if (dateFrom) {
    values.push(dateFrom);
    query += ` AND date >= $${values.length}`;
  }
  if (dateTo) {
    values.push(dateTo);
    query += ` AND date <= $${values.length}`;
  }
  if (timeFrom) {
    values.push(timeFrom);
    query += ` AND time >= $${values.length}`;
  }
  if (timeTo) {
    values.push(timeTo);
    query += ` AND time <= $${values.length}`;
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '❌ Fetch failed', details: error.message });
  }
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
