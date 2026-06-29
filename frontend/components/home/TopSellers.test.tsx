import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopSellers } from "./TopSellers";

describe("TopSellers", () => {
  it("renders a heading and at least 4 product cards", () => {
    render(<TopSellers />);
    expect(screen.getByRole("heading", { name: /top sellers/i })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /add to cart|out of stock/i }).length
    ).toBeGreaterThanOrEqual(4);
  });
});
