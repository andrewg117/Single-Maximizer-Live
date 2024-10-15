import supertest from "supertest";
import server from "./serverTest";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MDB_URI: string = process.env.MDB_URI as string;

const requestWithSupertest = supertest(server);

beforeEach(async () => {
  await mongoose.connect(MDB_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

afterAll((done) => {
  server.close();
  done();
});

interface serverAddress {
  address: string;
  port: number;
  family: string;
}

describe("Testing the server", () => {
  test("Server is running", async () => {
    const serverData: serverAddress = server.address() as serverAddress;
    expect(server).toBeDefined();
    expect(serverData.port).toBe(5001);
  });

  test("MongoDB is connected", async () => {
    expect(mongoose.connection.readyState).toBe(1);
    expect(mongoose.connection.db).toBeDefined();
    expect(mongoose.connection.db.databaseName).toBe("SingleMax");
  });

  describe("Testing the root path of server", () => {
    test("GET /", async () => {
      const res = await requestWithSupertest.get("/");
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining("json"));
      expect(res.body).toStrictEqual({ Connection: "Success" });
    });
  });
});

describe("Testing the /api/users path of server", () => {
  test("GET /api/users/me", async () => {
    // const res = await requestWithSupertest.get("/api/users/me");
    // console.log(res.error);
    // expect(res.status).toEqual(401);
  });
});

// describe("Testing the /api/users/login path of server", () => {
//   test("POST /api/users/login", async () => {
//     const res = await requestWithSupertest.post("/api/users/login").send({
//       email: "andrew@gmail.com",
//       password: "password",
//     });
//     expect(res.status).toEqual(200);
//     expect(res.type).toEqual(expect.stringContaining("json"));
//     expect(res.body).toContain({
//       username: "andrew",
//       email: "andrew@gmail.com",
//     });
//   });
// });

// describe("Testing the /api/users path of server", () => {
//   test("GET failed /api/users", async () => {
//     const res = await requestWithSupertest.get("/api/users/token");
//     expect(res.text).toEqual("Token Expired");
//     expect(res.status).toEqual(401);
//   });
// });

// describe("Testing the /api/tracks path of server", () => {
//   test("GET /api/tracks", async () => {
//     const res = await requestWithSupertest.get("/api/tracks");
//     expect(res.status).toEqual(200);
//     expect(res.type).toEqual(expect.stringContaining("json"));
//     expect(res.body).toStrictEqual({
//       tracks: expect.any(Array),
//     });
//   });
// });
