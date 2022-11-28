let isDesc = 0; //sort tang hay giam dan
let brand = [];
let closureType = [];
let sex = [];
let material = [];
let shoesHeight = [];
let color = [];
$(".pages").on("click", ".page-link", reloadProduct);
$(".category-menu").on("click", ".category-filter", reloadProduct);
$(".products-number").on("click", ".show-products-quantity", reloadProduct);
$(".search-form").on("click", ".search-button", function (e) {
  sessionStorage.removeItem("page"); //nếu products đc reload vì người dùng search, set page lại bằng 1
  reloadProduct(e);
});
$(".search-form-container").on("submit", "#search-form", function (e) {
  sessionStorage.removeItem("page"); //nếu products đc reload vì người dùng search, set page lại bằng 1
  reloadProduct(e);
});
$(".sort-by").on("change", reloadProduct);
$(".sort-order").on("click", function (e) {
  const sortBy = $(this).attr("id");
  if (sortBy == "desc") {
    if (!$("#desc").hasClass("btn-primary")) {
      $("#desc").toggleClass("btn-primary");
      $("#asc").toggleClass("btn-primary");
      isDesc = 1;
    }
  } else {
    if (!$("#asc").hasClass("btn-primary")) {
      $("#desc").toggleClass("btn-primary");
      $("#asc").toggleClass("btn-primary");
      isDesc = 0;
    }
  }
  reloadProduct(e);
});
$(".brand-button").on("click", function (e) {
  sessionStorage.removeItem("page"); //nếu products đc reload vì người dùng dùng filter, set page lại bằng 1
  brand = []; //array cũ chỉ có brand giữ địa chỉ
  $(".brand-form input:checked").each(function () {
    brand.push($(this).val());
  });
  reloadProduct(e);
});

$(".brand-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  brand = []; //array cũ chỉ có brand giữ địa chỉ
  $(".brand-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});

$(".closure-button").on("click", function (e) {
  sessionStorage.removeItem("page");
  closureType = [];
  $(".closure-form input:checked").each(function () {
    closureType.push($(this).val());
  });
  reloadProduct(e);
});

$(".closure-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  closureType = [];
  $(".closure-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});
$(".gender-button").on("click", function (e) {
  sessionStorage.removeItem("page");
  sex = [];
  $(".gender-form input:checked").each(function () {
    sex.push($(this).val());
  });
  reloadProduct(e);
});

$(".gender-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  sex = [];
  $(".gender-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});

$(".material-button").on("click", function (e) {
  sessionStorage.removeItem("page");
  material = [];
  $(".material-form input:checked").each(function () {
    material.push($(this).val());
  });
  reloadProduct(e);
});

$(".material-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  material = [];
  $(".material-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});
$(".shoesHeight-button").on("click", function (e) {
  sessionStorage.removeItem("page");
  shoesHeight = [];
  $(".shoesHeight-form input:checked").each(function () {
    shoesHeight.push($(this).val());
  });
  reloadProduct(e);
});

$(".shoesHeight-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  shoesHeight = [];
  $(".shoesHeight-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});
$(".color-button").on("click", function (e) {
  sessionStorage.removeItem("page");
  color = [];
  $(".color-form input:checked").each(function () {
    color.push($(this).val());
  });
  reloadProduct(e);
});

$(".color-clear").on("click", function (e) {
  sessionStorage.removeItem("page");
  color = [];
  $(".color-form input:checked").each(function () {
    $(this).prop("checked", false);
  });
  reloadProduct(e);
});

function reloadProduct(e) {
  const name = $(".search").val() !== "" ? $(".search").val() : null; //search by name
  let sortBy = $(".sort-by option:selected").val();
  if (isDesc) {
    sortBy = "-" + sortBy;
  }
  e.preventDefault();
  const url = "/api/products";
  let page = sessionStorage.getItem("page") || 1;
  if (page === "First") page = 1;
  if (page === "Last") page = sessionStorage.getItem("lastPage");
  let lastPage;
  let productsPerPage = sessionStorage.getItem("productsPerPage") || 12;
  if (productsPerPage === "All")
    //productsPerPage = sessionStorage.getItem('productsCount');
    productsPerPage = "All"; //sẽ bị remove trong filter=> query all
  const filters = {
    sortBy,
    name,
    productsPerPage,
    page,
    category: sessionStorage.getItem("category"),
    brand,
    color,
    sex,
    shoesHeight,
    closureType,
    material,
  };

  // remove các filter null or undefined
  Object.keys(filters).forEach(
    (key) => filters[key] === undefined && delete filters[key]
  );
  Object.keys(filters).forEach(
    (key) => filters[key] === null && delete filters[key]
  );

  if (page !== "...")
    $.ajax({
      url,
      data: filters,
      dataType: "json",
      success: function (data) {
        const oldScript = document.getElementById("reRunScript");
        const newScript = document.createElement("script");
        newScript.setAttribute("src", "/js/reRunScript.js");
        newScript.setAttribute("id", "reRunScript");

        oldScript.parentNode.insertBefore(newScript, oldScript);
        oldScript.parentElement.removeChild(oldScript);

        const urlPath = this.url.replace("/api", "");
        window.history.replaceState(null, "", urlPath); //update url after ajax call success
        lastPage = data.lastPage;
        if (page === "Last") page = lastPage;

        sessionStorage.setItem("lastPage", lastPage);
        sessionStorage.setItem("productsCount", data.productsCount);
        const productShowing = getProductShowing(
          data.queriedProductCount,
          data.productsCount
        ); // Showing ? of ? product

        const productsNumber = getProductsNumber(); //selected quantity of product
        let productsList = "";
        let productBox;
        if (data.products.length > 0) {
          data.products.forEach((product) => {
            productBox = getProductBox(product);
            productsList += productBox;
          });
        } else {
          productsList =
            '<div><p style="text-align: center" >Xin lỗi, chúng tôi không tìm thấy sản phẩm bạn tìm</p></div>';
        }
        const pagesNumber = getPagesNumber(lastPage, page); //paging number ở dưới
        $(".products").html(productsList);
        $(".pages").html(pagesNumber);
        $(".products-showing").html(productShowing);
        $(".products-number").html(productsNumber);
      },
      error: function (error) {
        console.log(error);
      },
    });
}

function getProductBox(product) {
  return `<div class="col-lg-4 col-md-6">
  <div class="product">
    <div class="flip-container">
      <div class="flipper">
        <div class="front">
          <a href="/products/${product._id}"
            ><img src="${product.image}" alt="" class="img-fluid"
          /></a>
        </div>
        <div class="back">
          <a href="/products/${product._id}"
            ><img src="${product.image}" alt="" class="img-fluid"
          /></a>
        </div>
      </div>
    </div>
    <a href="/products/${product._id}" class="invisible"
      ><img src="${product.image}" alt="" class="img-fluid"
    /></a>
    <div class="text">
      <h3><a href="/products/${product._id}">${product.name}</a></h3>
      <p class="price"><del></del>${product.price}VND</p>
      <p class="buttons">
        <a href="/products/${product._id}" class="btn btn-outline-secondary"
          >View detail</a
        >
      </p>
    </div>
  </div>
</div>
`;
}
function getProductShowing(queriedProductCount, productsCount) {
  return `Hiện
        <strong
          >${queriedProductCount}
          </strong
        >
        trong số <strong>${productsCount}</strong> sản phẩm`;
}
function getProductsNumber() {
  let res = `
  <strong>Hiện</strong>`;
  res +=
    sessionStorage.getItem("productsPerPage") == 12
      ? `<a class="btn btn-primary btn-sm show-products-quantity">12</a>`
      : `
    <a class="btn btn-outline-secondary btn-sm show-products-quantity"
    >12</a
  >`;
  res +=
    sessionStorage.getItem("productsPerPage") == 24
      ? `<a class="btn btn-primary btn-sm show-products-quantity">24</a>`
      : `<a class="btn btn-outline-secondary btn-sm show-products-quantity"
  >24</a
>`;

  res +=
    sessionStorage.getItem("productsPerPage") === "All"
      ? `<a class="btn btn-primary btn-sm show-products-quantity">All</a>`
      : ` <a class="btn btn-outline-secondary btn-sm show-products-quantity"
>All</a
>`;
  res += `<span></span>`;
  return res;
}
function getPagesNumber(lastPage, page) {
  let res = `
<nav
  aria-label="Page navigation example"
  class="d-flex justify-content-center"
>`;
  if (lastPage > 0) {
    res += `<ul class="pagination"><li class="page-item cursor-pointer"><a class="page-link">Đầu tiên</a></li>`;
    let i = Number(page) > 5 ? Number(page) - 4 : 1;
    if (i !== 1) {
      res += `<li class="page-item cursor-pointer"><a class="page-link">...</a></li>`;
    }
    for (; i <= Number(page) + 4 && i <= lastPage; i++) {
      if (i == page) {
        res += `<li class="page-item cursor-pointer active"><a class="page-link">${i}</a></li>`;
      } else {
        res += `<li class="page-item cursor-pointer"><a class="page-link">${i}</a></li>`;
      }
      if (i == Number(page) + 4 && i < lastPage) {
        res += `<li class="page-item cursor-pointer"><a class="page-link">...</a></li>`;
      }
    }
    res += `<li class="page-item cursor-pointer">
  <a class="page-link">Cuối cùng</a>
</li>`;
    res += `</ul>`;
  }

  res += `</nav>`;
  return res;
}
