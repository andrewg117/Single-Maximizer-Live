import supertest from "supertest";
import server from "../server";

const requestWithSupertest = supertest(server);

afterAll((done) => {
  server.close();
  done();
});

describe("Testing the root path of server", () => {
  test("GET /", async () => {
    const res = await requestWithSupertest.get("/");
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toStrictEqual({ Connection: "Success" });
  });
});

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
