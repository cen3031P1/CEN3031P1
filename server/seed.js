//https://www.joekarlsson.com/blog/how-to-seed-a-mongodb-database-with-fake-data/

import dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker'; //Modern version of faker !
import mongodb from 'mongodb';
const { MongoClient } = mongodb; //Weird workaround


//Straight from citation
function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}
async function seedDB() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
        try {
            await client.connect();
            console.log("Connected to MongoDB");
            const collection = client.db("test").collection("users");
            //collection.drop(); This doesnt seem super safe so Im changing it
            await collection.drop().catch(() => console.log("Collection already dropped"));
            let users = [];
            for (let i = 0; i < 100; i++) {
                const userName = faker.internet.username(); //This is the faker function to generate a random username
                let newUser = {
                    userName: userName,
                    password: faker.internet.password(),
                    points: randomIntFromInterval(0, 1000), 
                    gymLat: faker.location.latitude(),
                    gymLon: faker.location.longitude(),
                    streak: randomIntFromInterval(0, 30), //Days in month
                    currLat: faker.location.latitude(),
                    currLon: faker.location.longitude(),
                    friends: [],
                    visibleOnLeaderboard: faker.datatype.boolean()
                };
                users.push(newUser);
            }
            await collection.insertMany(users); //From reference but idk what it does fr
            console.log("Database seeded with fake data");
            client.close();
        } catch (err) {
              console.error("Error seeding database: ", err);
        }
        finally {
            await client.close();
        }
    }
    seedDB();
