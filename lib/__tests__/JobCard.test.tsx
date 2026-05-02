import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { JobCard } from "@/components/JobCard";
import type { Job } from "@/lib/data";

const job: Job = {
  id: "job-test",
  title: "Coach Padel Privat",
  description: "Desc",
  price: 500000,
  priceLabel: "Rp 500.000 / jam",
  location: "BSD, Tangerang Selatan",
  duration: "1 jam",
  coverImageUrl: "https://picsum.photos/seed/padel-court/600/400",
  tags: ["Padel", "Olahraga", "Privat"],
  providerName: "Rizky Pratama",
  providerAvatarUrl: "https://i.pravatar.cc/150?u=rizky-padel",
  rating: 4.9,
  reviewCount: 87,
  isNew: true,
};

test("JobCard renders core listing info", () => {
  render(<JobCard job={job} />);
  expect(screen.getByText(job.title)).toBeDefined();
  expect(screen.getByText(job.priceLabel)).toBeDefined();
  expect(screen.getByText(job.location)).toBeDefined();
  expect(screen.getByText(job.duration)).toBeDefined();
});

test('JobCard shows a "Baru" badge when job.isNew is true', () => {
  render(<JobCard job={job} />);
  expect(screen.getAllByText(/baru/i).length).toBeGreaterThan(0);
});

