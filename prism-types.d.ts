declare global {
  interface Window {
    Prism: prism.Prism;
  }
}

window.Prism = window.Prism || {};
