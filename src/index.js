const app = require("./app");

// if (!module.parent) {
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
// }
