declare const scrolledScript = "\n  window.addEventListener(\"scroll\", () => {\n    if (window.scrollY) {\n      document.documentElement.classList.add(\"scrolled\")\n    } else {\n      document.documentElement.classList.remove(\"scrolled\")\n    }\n  })\n";
export default scrolledScript;
