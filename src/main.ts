import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container was not found.");
}

app.innerHTML = `
  <main class="landing" aria-label="Lucas's portfolio">
    <h1 class="name-card">Lucas</h1>
  </main>
`;
