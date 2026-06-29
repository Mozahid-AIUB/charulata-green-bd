import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategorySidebar } from "./CategorySidebar";

const messages = { sidebar: { menu: "MENU" } };

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategorySidebar />
    </NextIntlClientProvider>,
  );
}

describe("CategorySidebar", () => {
  it("renders the MENU header and 10 categories", () => {
    renderWith("en");
    expect(screen.getByText("MENU")).toBeInTheDocument();
    expect(screen.getByText("Fruit Trees")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(10);
  });

  it("renders Bengali category names under bn locale", () => {
    renderWith("bn");
    expect(screen.getByText("ফল গাছ")).toBeInTheDocument();
  });
});
