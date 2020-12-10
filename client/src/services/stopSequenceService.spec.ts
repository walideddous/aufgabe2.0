import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  saveStopSequenceRequest,
  deleteStopSequenceRequest,
  queryStopSequenceRequest,
} from "./stopSequenceService";

const serverCreate = setupServer(
  rest.put("http://ems-dev.m.mdv:8101/savedStopSequence", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ msg: "StopSequence successly created" }));
  }),
  rest.delete("http://ems-dev.m.mdv:8101/savedStopSequence/:savedStopSequenceID", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ msg: "StopSequence successly deleted" }));
  }),
  rest.post("http://ems-dev.m.mdv:8101/graphql",(req,res,ctx)=>{
    return res(ctx.status(200), ctx.json({ msg: "StopSequence succesfully queried" }));
  }),
  rest.put("*", (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  }),
  rest.post("*", (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  }),
  rest.delete("*", (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  })
);

describe("Test the stopSequenceService", () => {
  beforeAll(() => serverCreate.listen());
  afterAll(() => serverCreate.close());
  afterEach(() => serverCreate.resetHandlers());

  it("Should save stopSequence by mode", async () => {
    const result = await saveStopSequenceRequest("4");
    expect(result.data.msg).toEqual("StopSequence successly created");
  });
  it("Should delete stopSequence byID", async () => {
    const result = await deleteStopSequenceRequest("1");
    expect(result.data.msg).toEqual("StopSequence successly deleted");
  });
  it("Should Query stop sequence by mode", async () => {
    const result = await queryStopSequenceRequest("4");
    expect(result.data.msg).toEqual("StopSequence succesfully queried");
  });
});


