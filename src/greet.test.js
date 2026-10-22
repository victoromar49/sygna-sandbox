import { test } from "node:test";
import assert from "node:assert/strict";
import { farewell, greet } from "./greet.js";

test("greet", () => {
  assert.equal(greet("Ana"), "Hola, Ana");
});

test("farewell", () => {
  assert.equal(farewell("Ana"), "Adiós, Ana");
});
