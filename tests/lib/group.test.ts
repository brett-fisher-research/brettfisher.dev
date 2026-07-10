import { describe, it, expect } from "vitest";
import { getAllPosts, groupByYear } from "../../lib/posts";

describe("groupByYear", () => {
  it("groups every post exactly once, years descending", () => {
    const posts = getAllPosts();
    const groups = groupByYear(posts);

    // Years are strictly descending (newest first).
    const years = groups.map((g) => g.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));

    // Every post lands in exactly one group; no post is lost or duplicated.
    const total = groups.reduce((n, g) => n + g.posts.length, 0);
    expect(total).toBe(posts.length);

    // Each group's posts all share that group's year.
    for (const g of groups) {
      for (const post of g.posts) expect(post.year).toBe(g.year);
    }
  });

  it("keeps posts date-descending within each year", () => {
    const groups = groupByYear(getAllPosts());
    for (const group of groups) {
      const dates = group.posts.map((p) => p.date);
      expect(dates).toEqual([...dates].sort().reverse());
      for (const post of group.posts) {
        expect(post.year).toBe(group.year);
      }
    }
  });
});
