module.exports = function (app, passport, db, fetch, omdb, ObjectId) {
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("searches")
      .find({
        name: req.user.local.email,
      })
      .toArray((err, result) => {
        var resultFiltered = null;
        var dataFiltered = null;
        var movieQuery = null;

        if (result.length > 0) {
          movieQuery = result[result.length - 1].search;
        }

        if (result.length >= 6) {
          resultFiltered = result.splice(result.length - 5);
        } else {
          resultFiltered = result;
        }

        if (result.length >= 1) {
          fetch(`https://www.omdbapi.com/?s=${movieQuery}&apikey=${omdb.api}`)
            .then((response) => response.json())
            .then((data) => {
              dataFiltered = data.Search;
              if (err) return console.log(err);
              res.render("profile.ejs", {
                user: req.user,
                searches: resultFiltered,
                info: dataFiltered,
                last: movieQuery,
              });
            });
        } else {
          res.render("profile.ejs", {
            user: req.user,
            searches: result,
            info: null,
          });
        }
      });
  });

  app.get("/pinned", isLoggedIn, function (req, res) {
    db.collection("pinned")
      .find({
        name: req.user.local.email,
      })
      .toArray(function (err, result) {
        var pinnedFiltered = result.filter((x) => x.pinned === true);
        if (err) return console.log(err);
        res.render("pinned.ejs", {
          user: req.user,
          pinned: pinnedFiltered,
        });
      });
  });

  app.get("/pinnedProfile/:id", isLoggedIn, function (req, res) {
    db.collection("pinned")
      .find({
        name: req.params.id,
      })
      .toArray(function (err, result) {
        var pinnedFiltered = result.filter((x) => x.pinned === true);
        if (err) return console.log(err);
        res.render("pinnedProfile.ejs", {
          user: req.user,
          profile: req.params.id,
          pinned: pinnedFiltered,
        });
      });
  });

  app.get("/lounge", isLoggedIn, function (req, res) {
    res.render("lounge.ejs", {
      user: req.user,
    });
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.post("/searches", (req, res) => {
    db.collection("searches").insertOne(
      {
        name: req.body.name,
        search: req.body.search,
      },
      (err, result) => {
        if (err) return console.log(err);
        res.redirect("/profile");
      }
    );
  });

  app.put("/searches", (req, res) => {
    db.collection("pinned").findOneAndUpdate(
      {
        name: req.body.name,
        title: req.body.title,
        year: req.body.year,
        poster: req.body.poster,
      },
      {
        $set: {
          pinned: req.body.pinned === true ? true : false,
        },
      },
      {
        sort: {
          _id: -1,
        },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/searches", (req, res) => {
    db.collection("searches").findOneAndDelete(
      {
        name: req.body.name,
        search: req.body.search,
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  app.delete("/pinned", (req, res) => {
    db.collection("pinned").findOneAndDelete(
      {
        title: req.body.title,
        year: req.body.year,
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", {
      message: req.flash("loginMessage"),
    });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/signup", function (req, res) {
    res.render("signup.ejs", {
      message: req.flash("signupMessage"),
    });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
