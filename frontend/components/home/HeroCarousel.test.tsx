import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { HeroCarousel } from "./HeroCarousel";

vi.mock("embla-carousel-react", () => ({
  default: () => [
    vi.fn(),
    {
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      selectedScrollSnap: () => 0,
      scrollSnapList: () => [0, 1, 2],
      scrollTo: vi.fn(),
    },
  ],
}));

const messages = { hero: { tagline: "Country's largest online nursery", cta: "Start shopping", dontMiss: "Don't Miss" } };

describe("HeroCarousel", () => {
  it("renders the CTA and a Don't Miss badge", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HeroCarousel />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByText("Don't Miss").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /start shopping/i }).length).toBeGreaterThanOrEqual(1);
  });
});
