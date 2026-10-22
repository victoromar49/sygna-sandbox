import { test } from "node:test";
import assert from "node:assert/strict";
import { greet } from "./greet.js";

test("greet", () => {
  assert.equal(greet("Ana"), "Hola, Ana");
});
