document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://tailwind-jit.beyondco.de/tailwind.css",
      {
        method: "POST",
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          html: document.documentElement.outerHTML,
        }),
      }
    );
    const css = await response.text();

    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
});
