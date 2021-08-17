require('dotenv').config();

const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');



describe('app routes', () => {
  describe('routes', () => {
    // let token;
    
    beforeAll(async () => {
      execSync('npm run setup-db');
      
      await client.connect();
    }, 20000);
    
    afterAll(done => {
      return client.end(done);
    });

    // RETURN SHIRT COLOR

    test('returns shirt colors', async() => {
      const expectation = [
        { 
          shirt_color: 'red' 
        },
        {
          shirt_color: 'blue' 
        },
        { 
          shirt_color: 'yellow' 
        },
        {
          shirt_color: 'brown' 
        },
        { 
          shirt_color: 'green'
        }
      ];
      const data = await fakeRequest(app)
        .get('/shirt')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(data.body).toEqual(expectation);
    });

    // RETURNS FRIENDS NAMES TEST

    test('GET / returns friends names', async() => {

      const expectation =   [
        {
          
          name: 'turkey neck',
          cool_factor: 3,
          cool_haircut: false,
          shirt_color: 1
          
        },
      
        {
          
          name: 'crab claw',
          cool_factor: 4,
          cool_haircut: false,
          shirt_color: 2
        },
      
        {
         
          name: 'ham fist',
          cool_factor: 4,
          cool_haircut: false,
          shirt_color: 1
        },
      
        {
          
          name: 'block head',
          cool_factor: 10,
          cool_haircut: false,
          shirt_color: 2
        },
      
        {
          
          name: 'poindexter',
          cool_factor: 1,
          cool_haircut: false,
          shirt_color: 3
        },
      
        {
          
          name: 'grandma',
          cool_factor: 10,
          cool_haircut: true,
          shirt_color: 4
        },
      
        {
          
          name: 'Gator',
          cool_factor: 8,
          cool_haircut: false,
          shirt_color: 5
        }
      ];

      const data = await fakeRequest(app)
        .get('/friends')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    
    // POST TEST
  
    test('POST / creates a new friend', async () => {
      const newfriend = {
        name: 'lil B',
        cool_factor: 5,
        cool_haircut: true,
        shirt_color: 1
        
      };
  
      const data = await fakeRequest(app)
        .post('/friends')
        .send(newfriend)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.shirt_color).toEqual(newfriend.shirt_color);
      expect(data.body.name).toEqual(newfriend.name);
      expect(data.body.id).toBeGreaterThan(0);
  
    });
  
    // PUT TEST
  
    test('PUT / friends/:id updates friend', async () => {
      const updatedData = {
      
        name: 't neck',
        cool_factor: 5,
        cool_haircut: false,
        shirt_color: '1'
      };
    
      const data = await fakeRequest(app)
        .put('/friends/1')
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /json/);
    
      expect(data.body.name).toEqual(updatedData.name);
      expect(data.body.cool_factor).toEqual(updatedData.cool_factor);
      expect(data.body.cool_haircut).toEqual(updatedData.cool_haircut);
      expect(data.body.shirt_color).toEqual(updatedData.shirt_color);
    
    });
  });
});