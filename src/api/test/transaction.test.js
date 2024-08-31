const request = require('supertest');
const app = require('../app');

describe("POST /api/transaction", () => {

    describe("Given all requirements data", () => {
        test("Should respond with a 201 status code", async () => {
            const data = await request(app).get("/api/user/login").send({
                email: "test22@gmail.com",
                password: "test1234",
                name: "test",
                address: "test"
            });
        
            const obj = data.headers['set-cookie'];
            const cookie = obj[0].slice(0, -18);
            
            const response = await request(app).post("/api/transaction").set("Cookie", cookie).send({
                cookieId : 1,
                totalItem : 2
            });
            expect(response.statusCode).toBe(201);
        });
    });

});