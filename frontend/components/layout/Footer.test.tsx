import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./Footer";

const messages = {
  footer: {
    tagline: "Buy green to save green.",
    quickLinks: "Useful Links",
    contact: "Contact",
    followUs: "Our Social Links",
    rights: "All rights reserved.",
    questions: "Have questions? Call us 24/7",
    address: "Nursery: Charabag, Ashulia, Savar, Dhaka",
    office: "Office: House-13, Road-3F, Sector-9, Uttara, Dhaka-1230",
    paymentSystem: "Payment System",
    shippingSystem: "Shipping System",
    about: "About Us",
    contactUs: "Contact Us",
    privacy: "Privacy Policy",
    returns: "Returns",
    terms: "Terms & Conditions",
    sitemap: "Our Sitemap",
  },
};

describe("Footer", () => {
  it("renders contact info, useful links and social section", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Have questions? Call us 24/7")).toBeInTheDocument();
    expect(screen.getByText("Useful Links")).toBeInTheDocument();
    expect(screen.getByText("Our Social Links")).toBeInTheDocument();
    expect(screen.getByText("Payment System")).toBeInTheDocument();
  });

  it("renders top-selling product columns", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    // a flower-plant product from mock-data appears in a top-selling column
    expect(screen.getByText("Camellia")).toBeInTheDocument();
  });
});
