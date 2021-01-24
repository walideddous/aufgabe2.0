import { rest } from "msw";
import { setupServer } from "msw/node";

import {GRAPHQL_API} from "../config/config"
import {
  saveStopSequenceRequest,
  deleteStopSequenceRequest,
  queryStopSequenceRequest,
} from "./stopSequenceService";
import{currentManagedRoute } from "../testUtils/testData"

const serverCreate = setupServer(
  rest.post(`${GRAPHQL_API}/graphql`,(req,res,ctx)=>{
    return res(ctx.status(200), ctx.json({ msg: "GrapQL query succesfully worked" }));
  }),
  rest.post("*", (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  }),
);

describe("Test the stopSequenceService", () => {
  beforeAll(() => serverCreate.listen());
  afterAll(() => serverCreate.close());
  afterEach(() => serverCreate.resetHandlers());

  it("Should test the fetch stopSequence GraphQL query", async () => {
    const result = await queryStopSequenceRequest(["4"]);
    expect(result.data.msg).toEqual("GrapQL query succesfully worked");
  });
  it("Should test the save stopSequence GraphQL query", async () => {
    const result = await saveStopSequenceRequest(currentManagedRoute);
    expect(result.data.msg).toEqual("GrapQL query succesfully worked");
  });
  it("Should test the delete stopSequence GraphQL query", async () => {
    const result = await deleteStopSequenceRequest("4");
    expect(result.data.msg).toEqual("GrapQL query succesfully worked");
  });
});


