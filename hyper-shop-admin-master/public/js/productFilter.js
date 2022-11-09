$(function () {
  sessionStorage.clear();
  sessionStorage.setItem('lastPage', $('#lastPage').val());
  sessionStorage.setItem('productsCount', $('#productsCount').val());

  //nếu người dùng nhập truy vấn trên url thì lưu lại để mỗi khi call ajax thì dùng các tham số này
  url_string = window.location.href;
  const url = new URL(url_string);
  const category = url.searchParams.get('category');
  const productsPerPage = url.searchParams.get('productsPerPage') || 12;
  if (category !== null) sessionStorage.setItem('category', category);
  if (productsPerPage !== null)
    sessionStorage.setItem('productsPerPage', productsPerPage);
  //còn nhiều filter nữa từ từ làm
});
$('.category-menu').on('click', '.category-filter', function () {
  sessionStorage.removeItem('page');
  sessionStorage.setItem(
    'category',
    $(this).clone().children().remove().end().text() //remove span tag
  );
  $('#search').val('');
});
$('.pages').on('click', '.page-link', function () {
  //const page = this.text;
  sessionStorage.setItem('page', this.text);
});
$('.products-number').on('click', '.show-products-quantity', function () {
  sessionStorage.setItem('productsPerPage', this.text);
  sessionStorage.removeItem('page');
});
