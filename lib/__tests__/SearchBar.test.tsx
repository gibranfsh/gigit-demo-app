import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

test("SearchBar renders a search input with placeholder", () => {
  render(<SearchBar />);
  expect(
    screen.getByPlaceholderText(/coach padel 500k 1 jam bsd/i)
  ).toBeDefined();
});
