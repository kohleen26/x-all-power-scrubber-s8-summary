(() => {
  const panels = [...document.querySelectorAll(".view-panel")];
  const tabs = [...document.querySelectorAll(".view-tab")];
  const search = document.querySelector("#siteSearch");
  const filter = document.querySelector("#statusFilter");
  const productTable = document.querySelector("#productTable tbody");
  const sortButton = document.querySelector("#sortButton");
  let descending = false;

  function updateCatalog() {
    const query = search.value.trim().toLowerCase();
    const status = filter.value;
    [...productTable.rows].forEach((row) => {
      const statusMatch = status === "all" || row.dataset.status === status;
      const searchMatch = !query || row.innerText.toLowerCase().includes(query);
      row.hidden = !(statusMatch && searchMatch);
    });
  }

  function updateSearch() {
    const active = panels.find((panel) => panel.classList.contains("active"));
    if (!active || active.id === "view-catalog") return updateCatalog();
    const query = search.value.trim().toLowerCase();
    active.querySelectorAll(".searchable").forEach((item) => {
      item.hidden = Boolean(query) && !item.innerText.toLowerCase().includes(query);
    });
    active.querySelectorAll(".compare-table tbody tr").forEach((item) => {
      item.hidden = Boolean(query) && !item.innerText.toLowerCase().includes(query);
    });
  }

  function setPage(name, updateHash = true) {
    const panel = panels.find((item) => item.id === `view-${name}`) || panels[0];
    panels.forEach((item) => item.classList.toggle("active", item === panel));
    tabs.forEach((tab) => {
      const selected = tab.dataset.page === panel.id.replace("view-", "");
      tab.classList.toggle("active", selected);
      if (selected) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    document.title = `${panel.dataset.title} · X-All Power Scrubber (Old Q1 Model Vs. S8 New Model Summary)`;
    document.body.classList.toggle("catalog-view", panel.id === "view-catalog");
    if (updateHash) history.replaceState(null, "", `#${panel.id.replace("view-", "")}`);
    updateSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });
  search.addEventListener("input", updateSearch);
  filter.addEventListener("change", updateCatalog);
  sortButton.addEventListener("click", () => {
    descending = !descending;
    const rows = [...productTable.rows].sort((a, b) => {
      const order = a.dataset.name.localeCompare(b.dataset.name);
      return descending ? -order : order;
    });
    rows.forEach((row) => productTable.append(row));
    sortButton.setAttribute("aria-label", `Sort ${descending ? "ascending" : "descending"} by product name`);
  });

  setPage(location.hash.slice(1) || "catalog", false);
  window.addEventListener("hashchange", () => setPage(location.hash.slice(1), false));
})();
