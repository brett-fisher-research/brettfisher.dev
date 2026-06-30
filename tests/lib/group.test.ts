import { describe, it, expect } from "vitest";
import { getAllPosts, groupByYear } from "../../lib/posts";

describe("groupByYear", () => {
  it("groups the real corpus as [2024:1, 2020:15] in order", () => {
    const groups = groupByYear(getAllPosts());
    expect(groups.map((g) => [g.year, g.posts.length])).toEqual([
      [2024, 1],
      [2020, 15],
    ]);
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
