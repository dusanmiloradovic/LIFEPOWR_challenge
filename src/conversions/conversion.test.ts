import { fromDoubleBuf, fromFloatBuf, toDoubleBuf, toFloatBuf } from "./index";

describe("conversion test", () => {
  test("should return true for valid conversion for float32", () => {
    const val = 79.25;
    const d = fromFloatBuf(val);
    const newVal = toFloatBuf(d[0], d[1]);
    expect(val).toBeCloseTo(newVal, 3);
  });
  test("double conversion", () => {
    const val = 5444555544.113;
    const [d0, d1, d2, d3] = fromDoubleBuf(val);
    const newVal = toDoubleBuf(d0, d1, d2, d3);
    expect(val).toBeCloseTo(newVal, 3);
  });
});
