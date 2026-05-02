import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryPill } from "@/components/CategoryPill";
import type { Category } from "@/lib/data";

const category: Category = {
  id: "cat-test",
  name: "Fotografi",
  icon: "camera",
  jobCount: 218,
};

test("CategoryPill renders the category name", () => {
  render(<CategoryPill category={category} />);
  expect(screen.getByText(category.name)).toBeDefined();
});

