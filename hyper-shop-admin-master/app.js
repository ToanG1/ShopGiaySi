const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongodb-session")(session);
const favicon = require("serve-favicon");

require("./db/mongoose.js");
require("dotenv/config");

const checkAuthenticated = require("./config/auth").checkAuthenticated;
const initializePassport = require("./config/passport");
initializePassport(passport);

const shopRoutes = require("./routes/shop");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const apiRoutes = require("./routes/api");
const adminRoutes = require("./routes/admin");
const errorRoutes = require("./routes/error");

const app = express();
const port = process.env.PORT || 4000;
const store = new MongoDbStore({
  uri: process.env.CONNECTION_STRING,
  collection: "sessions", //tên bảng lưu session trong mongo là sessions
});
//middlewares
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); //để parse request về json
app.use(morgan("tiny"));
app.use(flash());
app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", shopRoutes);
app.use("/products", checkAuthenticated, productRoutes);
app.use("/users", checkAuthenticated, userRoutes);
app.use("/auth", authRoutes);
app.use("/orders", checkAuthenticated, orderRoutes);
app.use("/api", apiRoutes);
app.use("/admins", checkAuthenticated, adminRoutes);
app.use(errorRoutes);

//server;
app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on http://localhost:4000/auth/login");
});
