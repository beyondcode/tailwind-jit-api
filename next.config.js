module.exports = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/api/redirect",
      },
      {
        source: "/tailwind.css",
        destination: "/api/tailwind/",
      },
    ];
  },
};
