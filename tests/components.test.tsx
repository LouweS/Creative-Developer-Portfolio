import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Nav from "../src/components/Nav";
import Loader from "../src/components/Loader";
import Work, { PROJECTS } from "../src/components/Work";
import Gallery from "../src/components/Gallery";
import Contact from "../src/components/Contact";
import Footer from "../src/components/Footer";
import { Artwork } from "../src/components/Artwork";

// jsdom has no rAF-driven visual effects to worry about; components must render semantics.
describe("Navigation", () => {
  it("renders brand and all section links", () => {
    render(<Nav onNavigate={() => {}} />);
    expect(screen.getByText(/ATELIER NOIR/i)).toBeInTheDocument();
    ["WORK", "ABOUT", "EXPERIMENTS", "CONTACT"].forEach((l) =>
      expect(screen.getAllByText(l).length).toBeGreaterThan(0)
    );
  });

  it("opens and closes the fullscreen menu", () => {
    render(<Nav onNavigate={() => {}} />);
    const menuBtn = screen.getByRole("button", { name: "MENU" });
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: "CLOSE" })).toBeInTheDocument();
    const dialog = document.getElementById("fullscreen-menu")!;
    expect(dialog.className).toContain("menu--open");
    fireEvent.click(screen.getAllByRole("button", { name: "CLOSE" })[0]);
    expect(screen.getByRole("button", { name: "MENU" })).toBeInTheDocument();
  });

  it("calls onNavigate when a link is clicked", () => {
    const navIds: string[] = [];
    render(<Nav onNavigate={(id) => navIds.push(id)} />);
    fireEvent.click(screen.getAllByText("WORK")[0]);
    expect(navIds).toContain("work");
  });
});

describe("Loader", () => {
  it("renders progress and completes", () => {
    const done = vi.fn();
    render(<Loader onDone={done} />);
    expect(screen.getAllByText(/LOADING EXPERIENCE/i).length).toBeGreaterThan(0);
  });
});

describe("Work section", () => {
  it("renders four projects with case-study buttons", () => {
    render(<Work onOpen={() => {}} />);
    PROJECTS.forEach((p) =>
      expect(screen.getByLabelText(`Open case study: ${p.name}`)).toBeInTheDocument()
    );
  });

  it("opens a case study on click", () => {
    const opened: string[] = [];
    render(<Work onOpen={(p) => opened.push(p.id)} />);
    fireEvent.click(screen.getByLabelText(`Open case study: ${PROJECTS[0].name}`));
    expect(opened).toEqual(["nova"]);
  });
});

describe("Gallery", () => {
  it("renders archive figures with captions", () => {
    render(<Gallery />);
    expect(screen.getAllByText("HALO STUDY").length).toBeGreaterThan(0);
    expect(screen.getAllByText("WAVEFORM").length).toBeGreaterThan(0);
  });
});

describe("Artwork", () => {
  it("renders accessible SVG with role img", () => {
    render(<Artwork variant="monolith" seed={1} label="test artwork" />);
    expect(screen.getByRole("img", { name: "test artwork" })).toBeInTheDocument();
  });

  it("supports all variants without crashing", () => {
    const variants = ["monolith", "orbit", "strata", "signal", "field", "prism", "echo", "grid"] as const;
    variants.forEach((v) => render(<Artwork variant={v} seed={2} label={v} />));
    variants.forEach((v) => expect(screen.getByRole("img", { name: v })).toBeInTheDocument());
  });
});

describe("Contact", () => {
  it("copies email and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Contact />);
    const cta = screen.getByRole("button", { name: /SEND A MESSAGE/i });
    fireEvent.click(cta);
    expect(writeText).toHaveBeenCalledWith("studio@ateliernoir.dev");
    expect(await screen.findByText("MESSAGE COPIED")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("renders availability status and social links", () => {
    render(<Footer />);
    expect(screen.getByText(/AVAILABLE FOR SELECT PROJECTS/i)).toBeInTheDocument();
    ["INSTAGRAM", "GITHUB", "LINKEDIN", "EMAIL"].forEach((s) =>
      expect(screen.getAllByText(s).length).toBeGreaterThan(0)
    );
  });
});
