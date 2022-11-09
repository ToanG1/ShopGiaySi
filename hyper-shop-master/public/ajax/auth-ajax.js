$('.log-in').on('click', function (e) {
  e.preventDefault();
  const password = $("input[name='password']").val();
  const email = $("input[name='email']").val();

  $.ajax({
    url: '/api/login',
    type: 'POST',
    data: {
      password,
      email,
    },
    dataType: 'json',
    success: function (data) {
      const { isSuccess, info, ref } = data;
      console.log(ref);
      if (isSuccess) window.location.href = ref;
      else {
        $('#displayError').removeAttr('hidden');
        $('#displayError').html(info.message);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
});
