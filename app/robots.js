export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/review", "/profile", "/certificate", "/apply", "/api/", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: "https://www.thecommercialhive.com/sitemap.xml",
  };
}
