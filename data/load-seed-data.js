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
      shirt.map(shIrt => {
        return client.query(`
                      INSERT INTO shirt (shirt)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [shIrt.shirt]);
      })
    );
      

    await Promise.all(
      friends.map(friend => {
        return client.query(`
                    INSERT INTO friends (name, cool_factor, cool_haircut, shirt_color)
                    VALUES ($1, $2, $3, $4);
                `,
        [friend.name, friend.cool_factor, friend.cool_haircut, friend.shirt_color]);
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