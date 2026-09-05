// toggleCookedRecipes.test.ts

import { afterEach, describe, expect, it, vi } from "vitest";
import { toggleCookedRecipes } from "@/lib/utils";

describe("toggleCookedRecipes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the cooked status and recipe ID to the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await toggleCookedRecipes(12, true);

    expect(fetchMock).toHaveBeenCalledOnce();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/cooked-recipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCooked: true,
          recipeId: 12,
        }),
      },
    );
  });

  it("throws when the response is unsuccessful", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      toggleCookedRecipes(12, true),
    ).rejects.toThrow("Failed to update cooked status");
  });
});