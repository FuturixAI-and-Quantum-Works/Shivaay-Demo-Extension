export default {
  contentScripts: {
    index: {
      matches: ["<all_urls>"], // Load on all websites
      entries: ["./content/index.tsx"]
    }
  }
}
