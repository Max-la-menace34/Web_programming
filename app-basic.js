const app = require('express')();
const basicAuth = require("express-basic-auth");
app.use(
    basicAuth({
    users: { admin: "supersecret" },
    challenge: true,
    })
  );
  app.use("/",(req,res) => {
      res.send("Success");
  });
  app.listen(3000, () => {
    console.log(`Ouvrez http://localhost:3000`);
  });