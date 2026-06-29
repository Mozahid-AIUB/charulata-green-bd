import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryShowcase } from "./CategoryShowcase";
import type { Category } from "@/lib/mock-data";

const category: Category = {
  id: "c1",
  name: "Fruit Trees",
  slug: "fruit-trees",
  imageUrl: "/images/placeholder-plant.svg",
};

describe("CategoryShowcase", () => {
  it("renders the category name as a heading", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.getByRole("heading", { name: "Fruit Trees" })).toBeInTheDocument();
  });

  it("renders products belonging to that category", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.getByText("Rambutan")).toBeInTheDocument();
    expect(screen.getByText("Avocado")).toBeInTheDocument();
  });

  it("does not render products from other categories", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.queryByText("Erica Palm")).not.toBeInTheDocument();
  });
});
