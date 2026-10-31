import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import publications from "./generated/writing.json";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
});

it("renders the homepage with publication and language links", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  const writing = div.querySelector("#writing");
  expect(writing).not.toBeNull();
  expect(writing.querySelectorAll(".writing-preview")).toHaveLength(
    Math.min(3, publications.length)
  );
  expect(writing.querySelector(".writing-view-all").getAttribute("href")).toBe(
    "/writing/"
  );
  expect(
    writing.querySelector(".writing-preview-title a").getAttribute("href")
  ).toBe(publications[0].url);
  for (const {lang, url} of publications[0].languages) {
    expect(
      writing.querySelector(`a[hreflang="${lang}"]`).getAttribute("href")
    ).toBe(url);
  }
  ReactDOM.unmountComponentAtNode(div);
});
