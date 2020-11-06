import {rest} from "msw"
import {setupServer} from "msw/node"
import getStopsByMode from "./stopsService"

const server = setupServer(
    rest.post("http://ems-dev.m.mdv:8101/graphql",(req,res,ctx)=>{
    return res(ctx.status(200), ctx.json({ msg: "Stops succesfuly queried"}))
    })
)

describe("Test the stopService", ()=>{
    beforeAll(() => server.listen());
    afterAll(() => server.close());
    afterEach(() => server.resetHandlers()); 

    it("Should query stops by modes", async ()=>{
        const result = await getStopsByMode(4)
        expect(result.data.msg).toEqual("Stops succesfuly queried")
    })
})