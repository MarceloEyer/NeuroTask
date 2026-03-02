import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculatePriority } from "./priority";
import { Task } from "../types";

describe("calculatePriority", () => {
  const baseTask: Task = {
    id: "1",
    title: "Test Task",
    domain: "Vida",
    impact: 3,
    urgency: 3,
    emotionalCost: 3,
    size: "Média",
    tags: [],
    status: "inbox",
    checklist: [],
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates base priority correctly without deadline", () => {
    expect(calculatePriority(baseTask)).toBe(6);
  });

  it("adds domain bonus for Grana", () => {
    const task = { ...baseTask, domain: "Grana" as const };
    expect(calculatePriority(task)).toBe(8);
  });

  describe("deadline logic", () => {
    it("adds +2 bonus when deadline is exactly 3 days away", () => {
      const task = { ...baseTask, deadline: "2024-03-04T12:00:00Z" };
      expect(calculatePriority(task)).toBe(8);
    });

    it("adds +2 bonus when deadline is exactly today (0 days)", () => {
      const task = { ...baseTask, deadline: "2024-03-01T12:00:00Z" };
      expect(calculatePriority(task)).toBe(8);
    });

    it("adds +2 bonus when deadline is 1 day away", () => {
      const task = { ...baseTask, deadline: "2024-03-02T12:00:00Z" };
      expect(calculatePriority(task)).toBe(8);
    });

    it("does not add bonus when deadline is more than 3 days away (e.g., 4 days)", () => {
      const task = { ...baseTask, deadline: "2024-03-05T12:00:00Z" };
      expect(calculatePriority(task)).toBe(6);
    });

    it("does not add bonus when deadline is in the past (negative days)", () => {
      const task = { ...baseTask, deadline: "2024-02-28T12:00:00Z" };
      expect(calculatePriority(task)).toBe(6);
    });
  });
});
