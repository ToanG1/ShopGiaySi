$('.pages').on('click', '.page-link', function (e) {
  e.preventDefault();
  let ordersCurrentPage = $(this).text();
  if (ordersCurrentPage === 'First') ordersCurrentPage = 1;
  else if (ordersCurrentPage === 'Last') ordersCurrentPage = $(this).attr('id');

  const url = '/api/order';
  if (ordersCurrentPage !== '...') {
    $.ajax({
      url,
      data: {page: ordersCurrentPage},
      dataType: 'json',
      success: function (data) {
        let ordersList = '';
        //reverse để hiện thị bình luận mới nhất xuống dưới
        for (order of data.orders) {
          ordersList += getOrders(order);
        }
        $('.orders').html(ordersList);
        $('.pages').html(getPagesNumber(data.lastPage, data.currentPage));
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
});

function getOrders(order) {
  orderHtml = `<div class="col-lg-4"> 
  <div id="order-summary" class="box">
    <div class="box-header">
        <h3 class="mb-0">Order summary</h3>
    </div>
    <p class="text-muted">`;
  let totalPrice = 0;
  for (item of order.orderItems) {
    totalPrice += item.product.price * item.quantity;
    orderHtml += `<div class="row">
    <div class="col-7">
                <span><strong>${item.product.name}</strong></span>
            </div>
            <div class="col-5">
                <span>$${item.product.price} x ${item.quantity}</span><br>
                <span>Size: ${item.size}</span>
            </div>
</div>
<hr/>`;
  }
  orderHtml += `</p>
  <div class="table-responsive">
      <table class="table">
          <tbody>
              <tr>
                  <td>Order subtotal</td>
                  <th>$${totalPrice}</th>
              </tr>
              <tr>
                  <td>Shipping and handling</td>
                  <th>$10.00</th>
              </tr>
              <tr>
                  <td>Tax</td>
                  <th>$0.00</th>
              </tr>
              <tr>
                  <td>Ordered Date</td>
                  <th>${new Date(order.orderedDate).toDateString()}</th>
              </tr>
              <tr>
                  <td>Status</td>
                  <th>${order.status}</th>
              </tr>
              <tr class="total">
                  <td>Total</td>
                  <th>$${totalPrice + 10}</th>
              </tr>
          </tbody>
      </table>
  </div>
</div>
</div>`;
  return orderHtml;
}
function getPagesNumber(lastPage, page) {
  let res = `
  <nav
    aria-label="Page navigation example"
    class="d-flex justify-content-center"
  >`;
  if (lastPage > 0) {
    res += `<ul class="pagination"><li class="page-item cursor-pointer"><a class="page-link">First</a></li>`;
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
    <a class="page-link" id="${lastPage}">Last</a>
  </li>`;
    res += `</ul>`;
  }

  res += `</nav>`;
  return res;
}
