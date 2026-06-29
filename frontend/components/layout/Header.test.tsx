import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

const messages = {
  nav: { home: "Home", shop: "Shop", about: "About Us", contact: "Contact Us", booking: "Book Appointment" },
  header: { searchPlaceholder: "Search for products", wishlist: "Wishlist", cart: "Cart", account: "Account" },
};

describe("Header", () => {
  it("renders the brand and primary nav", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Charulata")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for products")).toBeInTheDocument();
  });
});
