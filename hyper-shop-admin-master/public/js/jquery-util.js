$('.products').on('mouseenter', '.maxproduct', function (e) {
  if (e.type === 'mouseenter') $(this).prev().show();
});
$('.products').on('mouseleave', '.captionshop', function (e) {
  if (e.type === 'mouseleave') $(this).hide();
});

// $(document).bind('click', function (e) {
//   const target = $(e.target);
//   if (target.is('.hiddenCaption')) {
//     console.log('test');
//     $(this).css('background-color', 'black');
//   }
// });
