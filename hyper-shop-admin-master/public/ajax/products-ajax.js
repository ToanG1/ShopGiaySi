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
$("#search").on("input", function (e) {
  sessionStorage.removeItem("page"); //nếu products đc reload vì người dùng search, set page lại bằng 1
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
  const name = $("#search").val() !== "" ? $("#search").val() : null; //search by name

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
  if (filters.category == "all categories") filters.category = null;
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
        const urlPath = this.url.replace("/api", "");
        window.history.replaceState(null, "", urlPath); //update url after ajax call success
        lastPage = data.lastPage;
        if (page === "Last") page = lastPage;

        sessionStorage.setItem("lastPage", lastPage);
        sessionStorage.setItem("productsCount", data.productsCount);
        const productShowing = getProductShowing(
          data.productsPerPage,
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
            "<div><p>Sorry, we don't have thing you need</p></div>";
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
  return `<div class="col-md-4">
  <div class="productbox">
    <div class="fadeshop">
      <div class="captionshop text-center" style="display: none">
        <h3>${product.name}</h3>
        <p class="row">
          <a href="/products/editProduct/${product._id}" class="learn-more detailslearn col-6"
            ><i class="fa fa-shopping-cart"></i> Edit</a
          >
          <a href="/products/${product._id}" class="learn-more detailslearn col-6"
            ><i class="fa fa-link"></i> Details</a
          >
        </p>
      </div>
      <span class="maxproduct"
        ><img src="${product.image}" alt="shoes"
      /></span>
    </div>
    <div class="product-details">
      <a href="/products/${product._id}">
      <h1>${product.name}</h1>
      </a>
      <span class="price">
        <span class="edd_price">$${product.price}</span>
      </span>
    </div>
  </div>
</div>
`;
}
function getProductShowing(productsPerPage, productsCount) {
  return `Showing
        <strong
          >${productsPerPage <= productsCount ? productsPerPage : productsCount}
          </strong
        >
        of <strong>${productsCount}</strong> products`;
}
function getProductsNumber() {
  let res = `
  <strong>Show</strong>`;
  res +=
    sessionStorage.getItem("productsPerPage") == 2
      ? `<a class="btn btn-primary btn-sm show-products-quantity">2</a>`
      : `
    <a class="btn btn-outline-secondary btn-sm show-products-quantity"
    >2</a
  >`;
  res +=
    sessionStorage.getItem("productsPerPage") == 4
      ? `<a class="btn btn-primary btn-sm show-products-quantity">4</a>`
      : `<a class="btn btn-outline-secondary btn-sm show-products-quantity"
  >4</a
>`;

  res +=
    sessionStorage.getItem("productsPerPage") === "All"
      ? `<a class="btn btn-primary btn-sm show-products-quantity">All</a>`
      : ` <a class="btn btn-outline-secondary btn-sm show-products-quantity"
>All</a
>`;
  res += `<span>products</span>`;
  return res;
}
function getPagesNumber(lastPage, page) {
  let res = `
<nav
  aria-label="Page navigation example"
  class="d-flex justify-content-center"
>`;
  if (lastPage > 0) {
    res += `<ul class="pagination"><li class="page-item custom-hover"><a class="page-link">First</a></li>`;
    let i = Number(page) > 5 ? Number(page) - 4 : 1;
    if (i !== 1) {
      res += `<li class="page-item custom-hover"><a class="page-link">...</a></li>`;
    }
    for (; i <= Number(page) + 4 && i <= lastPage; i++) {
      if (i == page) {
        res += `<li class="page-item custom-hover active"><a class="page-link">${i}</a></li>`;
      } else {
        res += `<li class="page-item custom-hover"><a class="page-link">${i}</a></li>`;
      }
      if (i == Number(page) + 4 && i < lastPage) {
        res += `<li class="page-item custom-hover"><a class="page-link">...</a></li>`;
      }
    }
    res += `<li class="page-item custom-hover">
  <a class="page-link">Last</a>
</li>`;
    res += `</ul>`;
  }

  res += `</nav>`;
  return res;
}
