$('.response-form').on('submit', function (e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  const form = $(this);
  const url = form.attr('action');
  const data = form.serialize();
  if (data !== 'response=') {
    $.ajax({
      type: 'POST',
      url: url,
      data,
      success: function (data) {
        const responses = form.prev();
        responses.after(renderResponse(data));
      },
      error: function (error) {},
    });
    $('.rep-comment').val('');
  }
});

function renderResponse(res) {
  return `<div class="comment-response">
      <div class="arrow"></div>
      <i class="fas fa-store"></i> &nbsp
      <span class="extra-small-text red-color">Response from Hyper Shop</span>
      <div class="small-text black-color">${res.body}</div>
    </div>
    <div class="divide" style="width: 100px"></div>`;
}
