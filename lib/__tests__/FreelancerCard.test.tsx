import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { FreelancerCard } from "@/components/FreelancerCard";
import type { Freelancer } from "@/lib/data";

const freelancer: Freelancer = {
  id: "fl-test",
  name: "Made Suryani",
  role: "Yoga Instructor",
  avatarUrl: "https://i.pravatar.cc/150?u=made-yoga",
  rating: 5,
  reviewCount: 56,
  location: "Bali",
  hourlyRate: "Rp 1.000.000/sesi",
  tags: ["Yoga", "Wellness"],
  isFeatured: true,
};

test("FreelancerCard renders profile info", () => {
  render(<FreelancerCard freelancer={freelancer} />);
  expect(screen.getByText(freelancer.name)).toBeDefined();
  expect(screen.getByText(freelancer.role)).toBeDefined();
  expect(screen.getByText(freelancer.location)).toBeDefined();
});

