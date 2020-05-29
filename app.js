const mongoose = require("mongoose"),
  express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  session = require("express-session"),
  LocalStrategy = require("passport-local"),
  passport = require("passport"),
  fileUpload = require("express-fileupload"),
  path = require("path"),
  flash = require("connect-flash"),
  app = express();

// Include models
const User = require("./models/users");

// Include keys
const keys = require("./config/keys");

//Calling routes
const hotelRoutes = require("./routes/hotels");
const commentRoutes = require("./routes/comments");
const usersRoutes = require("./routes/users");

// mongoose
mongoose
  .connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database is running"))
  .catch((err) => console.log(`Database Errorrrr: ${err}`));

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "shit",
    resave: "false",
    saveUninitialized: "false",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function (req, res, next) {
  (res.locals.currentUser = req.user),
    (res.locals.error = req.flash("error")),
    (res.locals.success = req.flash("success")),
    next();
});

app.use("/", usersRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);

const port = process.env.PORT || 7000;

app.listen(port, (req, res) => {
  console.log("Server is running on port " + port);
});
