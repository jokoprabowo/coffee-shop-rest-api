const request = require('supertest');
const app = require('../app');

describe("POST /api/user/registration", () => {

    // describe("Given an unused email with password that fullfill the minimum requirements", () => {
    //     test("Should respond with a 201 status code", async () =>{
    //         const response = await request(app).post("/api/user/registration").send({
    //             email: "test23@gmail.com",
    //             password: "test1234",
    //             name: "test",
    //             address: "test"
    //         });
    //         expect(response.statusCode).toBe(201);
    //     });
    // });

    describe("Given an used email with password that fullfill the minimum requirements", () => {
        test("Should respond with a 400 status code", async () =>{
            const response = await request(app).post("/api/user/registration").send({
                email: "test22@gmail.com",
                password: "test1234",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Given an unused email with password that not fullfill the minimum requirements", () => {
        test("Should respond with a 400 status code", async () =>{
            const response = await request(app).post("/api/user/registration").send({
                email: "test24@gmail.com",
                password: "test",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Given an used email with password that not fullfill the minimum requirements", () => {
        test("Should respond with a 400 status code", async () =>{
            const response = await request(app).post("/api/user/registration").send({
                email: "test22@gmail.com",
                password: "test",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(400);
        });
    });
});

describe("GET /api/user/login", () =>{

    describe("Given a right email with right password", () => {
        test("Should respond with a 200 status code", async () => {
            const response = await request(app).get("/api/user/login").send({
                email: "test22@gmail.com",
                password: "test1234",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("Given a wrong email", () => {
        test("Should respond with a 404 status code", async () => {
            const response = await request(app).get("/api/user/login").send({
                email: "test25@gmail.com",
                password: "test1234",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(404);
        });
    });

    describe("Given a right email with wrong password", () => {
        test("Should respond with a 400 status code", async () => {
            const response = await request(app).get("/api/user/login").send({
                email: "test22@gmail.com",
                password: "test",
                name: "test",
                address: "test"
            });
            expect(response.statusCode).toBe(400);
        });
    });
});