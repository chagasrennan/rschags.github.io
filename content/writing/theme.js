(function () {
  function preference() {
    try {
      const saved = localStorage.getItem("isDark");
      if (saved === "true" || saved === "false") {
        return saved === "true" ? "dark" : "light";
      }
    } catch (error) {
      // Use the device preference when browser storage is unavailable.
    }
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.documentElement.dataset.theme = preference();
  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("writing-theme-toggle");
    if (!button) return;
    function label() {
      const dark = document.documentElement.dataset.theme === "dark";
      button.textContent = dark ? "Light theme" : "Dark theme";
      button.setAttribute("aria-pressed", String(dark));
    }
    button.addEventListener("click", function () {
      const dark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      try {
        localStorage.setItem("isDark", JSON.stringify(dark));
      } catch (error) {
        // The theme still works without persistent storage.
      }
      label();
    });
    label();
  });
})();
