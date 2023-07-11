import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PORT } from './constants/port';
import { startServer } from './server';
import { IUser } from './types/types';
import { Codes, Messages } from './constants/enums'
import { validateUserId } from './utils';

const app = startServer(DEFAULT_PORT, 'Testing cases');

const user1: Omit<IUser, "id"> = {
    username: "Dzmitry",
    age: 33,
    hobbies: ["poker", "AI"],
};

const user2: Omit<IUser, "id"> = {
    username: "Ivan",
    age: 100,
    hobbies: ["frontend", "backend"],
};

const WRONG_USER_STRUCTURE = {
    hobbies: ["running", "pubs",],
    age: 18,
};

const WRONG_ID = "3242-2342-123123-2131231";
const NON_EXIST_ID = uuidv4();

describe("CRUD operations with correct data", () => {
    const response = request(app.server);
    let userId: string;

    afterAll((done) => {
        app.close();
        done();
    });

    it("should get all users and return empty array", async () => {
        const res = await response.get("/api/users");
        expect(res.statusCode).toBe(Codes.OK);
        expect(res.body).toEqual([]);
    });

    it("should add new user", async () => {
        const res = await response.post("/api/users").send(user1);
        expect(res.statusCode).toBe(Codes.CREATE);
        const user = res.body as IUser;
        userId = user.id;
        expect(user.username).toBe(user1.username);
        expect(user.age).toBe(user1.age);
        expect(user.hobbies).toEqual(user1.hobbies);
        expect(validateUserId(user.id)).toBe(true);
    });

    it("should return all users and check that our the user have already added", async () => {
        const res = await response.get("/api/users");
        expect(res.statusCode).toBe(Codes.OK);
        const users = res.body as IUser[];
        const user = users.find((u) => u.id === userId);
        expect(user?.username).toBe(user1.username);
        expect(user?.age).toBe(user1.age);
        expect(user?.hobbies).toEqual(user1.hobbies);
    });

    it("should return the user by userId", async () => {
        const res = await response.get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(Codes.OK);
        const user = res.body as IUser;
        expect(user?.username).toBe(user1.username);
        expect(user?.age).toBe(user1.age);
        expect(user?.hobbies).toEqual(user1.hobbies);
    });

    it("should update user information", async () => {
        const res = await response.put(`/api/users/${userId}`).send(user2);
        expect(res.statusCode).toBe(Codes.OK);
        const user = res.body as IUser;
        expect(user?.username).toBe(user2.username);
        expect(user?.age).toBe(user2.age);
        expect(user?.hobbies).toEqual(user2.hobbies);
    });

    it("should be deleted the user by userId", async () => {
        const res = await response.delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(Codes.DELETE);
        expect(res.body).toBe("");
    });

    it("should return all users and return empty array again", async () => {
        const res = await response.get("/api/users");
        expect(res.statusCode).toBe(Codes.OK);
        expect(res.body).toEqual([]);
    });
});

describe("CRUD operations with invalid data", () => {
    const response = request(app.server);
    let userId: string;

    afterAll((done) => {
        app.close();
        done();
    });

    it("should try invalid endpoint", async () => {
        const res = await response.get("/api/abcde");
        expect(res.statusCode).toBe(Codes.NOT_FOUND);
        expect(res.text).toBe(Messages.INVALID_ENDPOINT);
    });

    it("should get incorrect ID and get 400 error", async () => {
        const res = await response.get(`/api/users/${WRONG_ID}`);
        expect(res.statusCode).toBe(Codes.INVALID);
        expect(res.text).toBe(Messages.INVALID_USER_ID);
    });

    it("should try to add new user with body that does not contain required fields and get 400 error", async () => {
        const res = await response.post("/api/users").send(WRONG_USER_STRUCTURE);
        expect(res.statusCode).toBe(Codes.INVALID);
        expect(res.text).toBe(Messages.INVALID_BODY);
    });

    it("should try to update user data by incorrect ID and get 400 error", async () => {
        const res = await response.put(`/api/users/${WRONG_ID}`).send(user2);
        expect(res.statusCode).toBe(Codes.INVALID);
        expect(res.text).toBe(Messages.INVALID_USER_ID);
    });

    it("should try to delete user by incorrect ID and get 400 error", async () => {
        const res = await response.delete(`/api/users/${WRONG_ID}`);
        expect(res.statusCode).toBe(Codes.INVALID);
        expect(res.text).toBe(Messages.INVALID_USER_ID);
    });
});

describe("CRUD operations with non-exist users", () => {
    const response = request(app.server);

    afterAll((done) => {
        app.close();
        done();
    });

    it("should try to get user data of non-exist user and get 404 error", async () => {
        const res = await response.get(`/api/users/${NON_EXIST_ID}`);
        expect(res.statusCode).toBe(Codes.NOT_FOUND);
        expect(res.text).toBe(Messages.NOT_FOUND_USER);
    });

    it("should try to update user data of non-exist user and get 404 error", async () => {
        const res = await response.put(`/api/users/${NON_EXIST_ID}`).send(user2);
        expect(res.statusCode).toBe(Codes.NOT_FOUND);
        expect(res.text).toBe(Messages.NOT_FOUND_USER);
    });

    it("should try to delete non-exist user and get 404 error", async () => {
        const res = await response.delete(`/api/users/${NON_EXIST_ID}`);
        expect(res.statusCode).toBe(Codes.NOT_FOUND);
        expect(res.text).toBe(Messages.NOT_FOUND_USER);
    });
});