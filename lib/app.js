const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/friends', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    friends.id, 
    name,
    cool_factor,
    cool_haircut,
    shirt
    FROM friends
    INNER JOIN shirt
    ON friends.shirt_color = shirt.id
    ORDER BY friends.id
      `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/shirt', async(req, res) => {
  try {
    const data = await client.query(`SELECT *
    FROM shirt

      `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/friends/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    friends.id, 
    name,
    cool_factor,
    cool_haircut,
    shirt
    FROM friends
    INNER JOIN shirt
    ON friends.shirt_color = shirt.id
    ORDER BY friends.id
    `);
    
    const searchParam = Number(req.params.id);
    const friendz = data.rows.find((friend)=>(friend.id === searchParam));

    res.json(friendz);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/friends', async(req, res) => {

  try {
    const data = await client.query(`
    INSERT INTO friends(
      name,
      cool_factor,
      cool_haircut,
      shirt_color
    )VALUES ($1, $2, $3, $4)
    RETURNING *`, 
    [
      req.body.name,
      req.body.cool_factor,
      req.body.cool_haircut,
      req.body.shirt_color
    ]);

    res.json(data.rows[0]);
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.put('/friends/:id', async(req, res)=>{
  try {
    const data = await client.query(`
      UPDATE friends
      SET 
        name=$2,
        cool_factor=$3,
        cool_haircut=$4,
        shirt_color=$5
      WHERE id = $1
      RETURNING * `, 
    [
      req.params.id,
      req.body.name,
      req.body.cool_factor,
      req.body.cool_haircut,
      req.body.shirt_color
    ]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;