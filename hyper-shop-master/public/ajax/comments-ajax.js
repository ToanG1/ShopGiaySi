$('.comment-form').on('submit', function (e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  const form = $(this);

  const url = form.attr('action');
  const data = form.serialize();
  if (data !== 'comment=') {
    //input is not leave blank
    $.ajax({
      type: 'POST',
      url: url,
      data,
      success: function (data) {
        let commentsList = '';
        //reverse for showing comment in better order
        for (comment of data.comments.reverse()) {
          commentsList += getComment(comment, data.responses);
        }
        $('.comments-list').html(commentsList);
        $('.pages').html(getPagesNumber(data.commentsLastPage, 1));
      },
      error: function (error) {
        if (error.status === 401) {
          alert('Please Login');
        } else if (error.status === 402) {
          alert('Sorry, You have not bought this product yet');
        } else {
          alert('Something bad happend');
        }
      },
    });
    $('.comment-input').val('');
  }
});

$('.pages').on('click', '.page-link', function (e) {
  e.preventDefault();
  let commentsCurrentPage = $(this).text();
  if (commentsCurrentPage === 'First') commentsCurrentPage = 1;
  else if (commentsCurrentPage === 'Last') commentsCurrentPage = $(this).attr('id');
  const productId = $('#productId').val();
  const url = '/api/comments/' + productId;
  if (commentsCurrentPage !== '...') {
    $.ajax({
      url,
      data: {page: commentsCurrentPage},
      dataType: 'json',
      success: function (data) {
        let commentsList = '';
        //reverse để hiện thị bình luận mới nhất xuống dưới
        for (comment of data.comments.reverse()) {
          commentsList += getComment(comment, data.responses);
        }
        $('.comments-list').html(commentsList);
        $('.pages').html(getPagesNumber(data.commentsLastPage, commentsCurrentPage));
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
});

function getComment(comment, responses) {
  let resHtml = `<div class="comment">
<div class="customer-avatar">
  <i class="fa fa-user-circle medium-text"></i>&nbsp &nbsp<span
    >${comment.user.name}</span
  >
</div>
<div class="comment-content">
  <span class="light-gray-color">${comment.body}</span>
</div>`;
  resHtml += getResponses(comment._id, responses);
  resHtml += `<div class="divide"></div>
  </div>`;
  return resHtml;
}

function getResponses(commentId, responses) {
  let resHtml = ``;
  for (response of responses) {
    if (response.comment == commentId) {
      for (res of response.commentRes) {
        resHtml += `<div class="response">
        <i class="fa-solid fa-store"></i>&nbsp &nbsp<span class="red-color"
   >Response by Hyper Shop</span
 >
 <div class="response-content">${res.body}</div>
</div>`;
      }
    }
  }

  return resHtml;
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
