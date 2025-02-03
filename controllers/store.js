async function getHomePage(req, res) {
  res.render("home", { title: "home" });
}
export { getHomePage };
