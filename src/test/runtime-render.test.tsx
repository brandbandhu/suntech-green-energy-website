import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("app runtime render", () => {
  it("renders the homepage without crashing", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: /solar in pune, designed around savings instead of sales pressure\./i })).toBeInTheDocument();
  });
});
