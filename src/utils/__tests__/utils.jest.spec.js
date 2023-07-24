import * as utils from "../index";
const {
  checkEmpty,
  checkerType,
  checker,
  checkScalar,
  checkObject,
  checkArray
} = jest.requireActual("../index");

describe("schema getter utils", () => {
  test("checkEmpty should return isEqual as true if both are empty", () => {
    expect(checkEmpty(null, null)).toStrictEqual(true);
    expect(checkEmpty(0, null)).toStrictEqual(true);
    expect(checkEmpty("", null)).toStrictEqual(true);
    expect(checkEmpty([], null)).toStrictEqual(true);
    expect(checkEmpty({}, null)).toStrictEqual(true);
    expect(checkEmpty(0, "")).toStrictEqual(true);
    expect(checkEmpty(0, [])).toStrictEqual(true);
    expect(checkEmpty(0, {})).toStrictEqual(true);
    expect(checkEmpty([], {})).toStrictEqual(true);
    expect(checkEmpty("", {})).toStrictEqual(true);
    expect(checkEmpty("", [])).toStrictEqual(true);
    expect(checkEmpty("", undefined)).toStrictEqual(true);
  });

  test("checkEmpty should return undefined if both not empty", () => {
    expect(checkEmpty({ a: 1 }, { b: 1 })).toStrictEqual(undefined);
    expect(checkEmpty({ a: 1 }, "a")).toStrictEqual(undefined);
    expect(checkEmpty({ a: 1 }, 2)).toStrictEqual(undefined);
    expect(checkEmpty({ a: 1 }, [2])).toStrictEqual(undefined);
    expect(checkEmpty(1, [2])).toStrictEqual(undefined);
    expect(checkEmpty("a", [2])).toStrictEqual(undefined);
    expect(checkEmpty("a", 2)).toStrictEqual(undefined);
  });
  test("checkEmpty should return false if either not empty", () => {
    expect(checkEmpty({ a: 1 }, [])).toStrictEqual(false);
    expect(checkEmpty(null, "a")).toStrictEqual(false);
    expect(checkEmpty({ a: 1 }, 0)).toStrictEqual(false);
    expect(checkEmpty(undefined, [2])).toStrictEqual(false);
    expect(checkEmpty("", [2])).toStrictEqual(false);
    expect(checkEmpty({}, [2])).toStrictEqual(false);
    expect(checkEmpty("a", [])).toStrictEqual(false);
  });

  test("checkerType should return checkScalar for checking empties", () => {
    expect(checkerType(null, null)).toStrictEqual("checkScalar");
    expect(checkerType(0, null)).toStrictEqual("checkScalar");
    expect(checkerType("", null)).toStrictEqual("checkScalar");
    expect(checkerType([], null)).toStrictEqual("checkScalar");
    expect(checkerType({}, null)).toStrictEqual("checkScalar");
    expect(checkerType(0, "")).toStrictEqual("checkScalar");
    expect(checkerType(0, [])).toStrictEqual("checkScalar");
    expect(checkerType(0, {})).toStrictEqual("checkScalar");
    expect(checkerType([], {})).toStrictEqual("checkScalar");
    expect(checkerType("", {})).toStrictEqual("checkScalar");
    expect(checkerType("", [])).toStrictEqual("checkScalar");
    expect(checkerType("", undefined)).toStrictEqual("checkScalar");
  });
  test("checkerType should return checkObject for checking objects", () => {
    expect(checkerType({ a: 1 }, { b: 2 })).toStrictEqual("checkObject");
  });
  test("checkerType should return 'checkScalar' for checking an object against somthing else not empty", () => {
    expect(checkerType({ a: 1 }, ["a"])).toStrictEqual("checkScalar");
    expect(checkerType({ a: 1 }, "a")).toStrictEqual("checkScalar");
    expect(checkerType({ a: 1 }, 1)).toStrictEqual("checkScalar");
  });
  test("checkerType should return 'checkScalar' for checking an array against somthing else not empty", () => {
    expect(checkerType(["a"], { b: 2 })).toStrictEqual("checkScalar");
    expect(checkerType(["a"], "a")).toStrictEqual("checkScalar");
    expect(checkerType(["a"], 13)).toStrictEqual("checkScalar");
  });
  test("checkerType should return 'checkScalar' for checking a scalar against somthing else not empty", () => {
    expect(checkerType("a", { b: 2 })).toStrictEqual("checkScalar");
    expect(checkerType("a", ["b", "c"])).toStrictEqual("checkScalar");
  });
  test("checkerType should return checkScalar when comparing scalars", () => {
    expect(checkerType("a", "b")).toStrictEqual("checkScalar");
    expect(checkerType("a", "a")).toStrictEqual("checkScalar");
    expect(checkerType(1, "b")).toStrictEqual("checkScalar");
    expect(checkerType(2, 3)).toStrictEqual("checkScalar");
    expect(checkerType(3, 3)).toStrictEqual("checkScalar");
  });
  test("checkerType should return checkObject when comparing objects", () => {
    expect(checkerType({ a: "b" }, { b: 1 })).toStrictEqual("checkObject");
    expect(checkerType({ a: "b" }, { a: "b" })).toStrictEqual("checkObject");
    expect(checkerType({ a: "b" }, { a: ["a"] })).toStrictEqual("checkObject");
  });
  test("checkerType should return checkArray when comparing arrays", () => {
    expect(checkerType(["a", "b"], [{ b: 1 }])).toStrictEqual("checkArray");
    expect(checkerType(["a", "b"], ["a", "b"])).toStrictEqual("checkArray");
    expect(checkerType(["a", "b"], [1, 2, "b", ["a"]])).toStrictEqual(
      "checkArray"
    );
  });
  test("checker should return true if comparing empties ", () => {
    expect(checker(null, null)).toStrictEqual(true);
    expect(checker(0, null)).toStrictEqual(true);
    expect(checker("", null)).toStrictEqual(true);
    expect(checker([], null)).toStrictEqual(true);
    expect(checker({}, null)).toStrictEqual(true);
    expect(checker(0, "")).toStrictEqual(true);
    expect(checker(0, [])).toStrictEqual(true);
    expect(checker(0, {})).toStrictEqual(true);
    expect(checker([], {})).toStrictEqual(true);
    expect(checker("", {})).toStrictEqual(true);
    expect(checker("", [])).toStrictEqual(true);
    expect(checker("", undefined)).toStrictEqual(true);
  });

  test("checkScalar should return true if comparing scalars that are equal ", () => {
    expect(checkScalar(1, 1)).toStrictEqual(true);
    expect(checkScalar("b", "b")).toStrictEqual(true);
  });
  test("checkScalar should return false if comparing scalars that are not equal ", () => {
    expect(checkScalar(1, 2)).toStrictEqual(false);
    expect(checkScalar("b", "c")).toStrictEqual(false);
    expect(checkScalar("b", 4)).toStrictEqual(false);
  });
  test("checker should return true if comparing scalars that are equal ", () => {
    expect(checker(1, 1)).toStrictEqual(true);
    expect(checker("b", "b")).toStrictEqual(true);
  });
  test("checkArray should return true if comparing arrays that are equal", () => {
    expect(checkArray([{ a: 1 }], [{ a: 1 }])).toStrictEqual(true);
    expect(checkArray([{ a: 1, b: 2 }], [{ b: 2, a: 1 }])).toStrictEqual(true);
    expect(checkArray([1], [1])).toStrictEqual(true);
    expect(checkArray([1, 2], [1, 2])).toStrictEqual(true);
    expect(checkArray([1, 2], [2, 1])).toStrictEqual(true);
    expect(checkArray(["a"], ["a"])).toStrictEqual(true);
    expect(checkArray(["a", "b"], ["a", "b"])).toStrictEqual(true);
    expect(checkArray(["a", "b"], ["b", "a"])).toStrictEqual(true);
    expect(checkArray(["b", "a"], ["a", "b"])).toStrictEqual(true);
  });
  test("checker should return false if comparing arrays that are not equal", () => {
    expect(checker([{ a: 1 }], [{ a: 2 }])).toStrictEqual(false);
    expect(checker([{ a: 1, c: 2 }], [{ b: 2, a: 1 }])).toStrictEqual(false);
    expect(checker([1], ["a"])).toStrictEqual(false);
    expect(checker([1, "b"], [1, 2])).toStrictEqual(false);
    expect(checker([1, 2], [{ a: 1 }, 1])).toStrictEqual(false);
    expect(checker(["ab"], ["a"])).toStrictEqual(false);
    expect(checker(["a", "bc"], [["a"], "b"])).toStrictEqual(false);
    expect(checker(["a", "b"], [1, "a"])).toStrictEqual(false);
    expect(checker(["a", "b"], ["a"])).toStrictEqual(false);
    expect(checker(["a"], ["a", "b"])).toStrictEqual(false);
    expect(checker(["a", "c"], ["a", "b"])).toStrictEqual(false);
  });
  test("checkObject should return true if comparing objects that are equal", () => {
    expect(checkObject({ a: 1 }, { a: 1 })).toStrictEqual(true);
    expect(checkObject({ a: [1] }, { a: [1] })).toStrictEqual(true);
    expect(checkObject({ a: 1, b: 2 }, { b: 2, a: 1 })).toStrictEqual(true);
    expect(
      checkObject({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 })
    ).toStrictEqual(true);
  });
  test("checkObject should return false if comparing objects that are equal", () => {
    expect(checkObject({ a: 1 }, { a: "b" })).toStrictEqual(false);
    expect(checkObject({ a: ["1"] }, { a: [1] })).toStrictEqual(false);
    expect(checkObject({ a: 1, b: 2 }, { c: 2, a: 1 })).toStrictEqual(false);
    expect(
      checkObject({ a: 1, b: { c: 2 } }, { b: { c: 3 }, a: 1 })
    ).toStrictEqual(false);
  });
});
