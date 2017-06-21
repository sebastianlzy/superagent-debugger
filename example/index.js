let express = require("express");
let app = express();

app.get("/debug", function(req, res) {
  res.json({ message: "What an awesome debugger" });
});

app.get("/404", function(req, res) {
  res.status(404).end();
});

app.post("/post", function(req, res) {
  res.json({ message: "i am a post request" }).end();
});

app.listen(3000, function() {
  console.log("Superagent-debugger app listening on port 3000!");
});
