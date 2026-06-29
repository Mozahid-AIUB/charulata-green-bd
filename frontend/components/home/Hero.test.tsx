import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the nursery tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/country's largest online nursery/i)).toBeInTheDocument();
  });

  it("renders a shop now call to action", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /shop now/i })).toBeInTheDocument();
  });
});
