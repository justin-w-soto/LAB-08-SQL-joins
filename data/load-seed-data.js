const client = require('../lib/client');
// import our seed data:
const friends = require('./friends.js');
const shirt = require('./shirt.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      shirt.map(s => {
        return client.query(`
                      INSERT INTO shirt (shirt_color)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [s.shirt_color]);
      })
    );
      

    await Promise.all(
      friends.map(friend => {
        return client.query(`
                    INSERT INTO friends (name, cool_factor, cool_haircut, shirt_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [friend.name, friend.cool_factor, friend.cool_haircut, friend.shirt_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}