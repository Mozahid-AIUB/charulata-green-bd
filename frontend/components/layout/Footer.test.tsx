import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./Footer";

const messages = {
  footer: { tagline: "Buy green to save green.", quickLinks: "Quick Links", contact: "Contact", followUs: "Follow Us", rights: "All rights reserved." },
};

describe("Footer", () => {
  it("renders the tagline and column headings", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Buy green to save green.")).toBeInTheDocument();
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Follow Us")).toBeInTheDocument();
  });
});
