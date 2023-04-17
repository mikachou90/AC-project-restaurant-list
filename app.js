const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const port = 3000;
const restaurantData = require("./restaurant.json");

//set handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//靜態資料
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { restauranList: restaurantData.results });
});

app.get("/restaurants/:res_id", (req, res) => {
  console.log("restaurant_id", req.params.res_id);
  const restaurant = restaurantData.results.find(function (resId) {
    return resId.id.toString() === req.params.res_id;
  });
  res.render("show", { restaurant: restaurant });
});

app.get("/search", (req, res) => {
  //若沒輸入字母導回index頁面
  if (!req.query.keywords) {
    return res.redirect("/");
  }
  const keywords = req.query.keywords.trim().toLocaleLowerCase();

  //設定查詢店名、餐廳分類、地址
  const filterRestaurant = restaurantData.results.filter(
    function (restaurant) {
      return (
        restaurant.name.toLocaleLowerCase().includes(keywords) ||
        restaurant.category.includes(keywords) ||
        restaurant.location.includes(keywords)
      );
    }
  );

  //以評分來排序查詢出來的店家
  const sortRestaurant = filterRestaurant.sort(function (restaurant, nextRestaurant) {
    return nextRestaurant.rating - restaurant.rating;
  });

  const mappedRestaurant = sortRestaurant.map(function (restaurant, index) {
     console.log('best', restaurant)
    if (index === 0) { // This is the first restaurant, so it's the best
      
      restaurant.theBest = true;
      return restaurant;

      // return { ...restaurant, theBest: true}
    } else {
      return restaurant;
    }

  })

  res.render("index", { restauranList: mappedRestaurant, keyword: keywords });
});

app.listen(port, () => {
  console.log("This page is running with Express");
});
