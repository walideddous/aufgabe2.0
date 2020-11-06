import { getPathFromTrajekt } from "./getPathFromTrajekt";

describe("Testing the getPathfromTrajekt function", () => {
  const input = [{
    coord: { WGS84: [46.17831, 6.08824] },
    modes: ["4", "5"],
    name: "Confignon, croisée",
    _id: "5f6205c60d5658001cd9480b",
  }];

  const result = [[46.17831, 6.08824]];

  it("Should test the function without crashing", () => {
    const testResult = getPathFromTrajekt(input);

    expect(testResult).toEqual(result);
  });
});
