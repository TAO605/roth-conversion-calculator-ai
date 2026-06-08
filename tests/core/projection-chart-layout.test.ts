import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectionChart } from "@/features/charts/ProjectionChart";
import type { ProjectionPoint } from "@/core/calculator/types";

const projection: ProjectionPoint[] = [
  { year: 0, rothValue: 50000, traditionalAfterTaxValue: 39000 },
  { year: 1, rothValue: 53500, traditionalAfterTaxValue: 41730 },
];

describe("projection chart layout", () => {
  it("gives bar groups a full-height container so percentage-height bars render", () => {
    render(React.createElement(ProjectionChart, { projection }));

    const groups = screen.getAllByTestId("projection-bar-group");

    expect(groups).toHaveLength(2);
    expect(groups[0].className).toContain("h-full");
    expect(screen.getByText(/not guaranteed outcomes/i)).toBeTruthy();
  });
});
