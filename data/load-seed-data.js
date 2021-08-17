const client = require('../lib/client');
// import our seed data:
const friends = require('./friends.js');
const shoesizeData = require('./shoesize.js');
const { getEmoji } = require('../lib/emoji.js');
const shoesize = require('./shoesize.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      shoesizeData.map(shoesize => {
        return client.query(`
                      INSERT INTO shoesize (shoesize)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [shoesize.shoesize]);
      })
    );
      

    await Promise.all(
      friends.map(friend => {
        return client.query(`
                    INSERT INTO friends (name, cool_factor, cool_haircut, shoesize_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [friend.name, friend.cool_factor, friend.cool_haircut, friend.shoesize_id]);
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