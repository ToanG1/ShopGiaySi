const deleteProdBtns = document.getElementsByClassName('delete-product-btn');
const itemQuantityInput = document.getElementsByClassName('item-quantity');

const url = '/api/cart';
const urlChangeQuantity = '/api/cart/change-quantity';

const deleteProductHandler = async event => {
  let product = {
    id: event.target.id,
  };
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(product),
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
  })
    .then(async response => {
      if (response.status >= 200 && response.status < 300) {
        const item = await response.json();
        let itemRow = null;
        if (!item._id) {
          itemRow = document.getElementById(`row-${item.product._id}`);
        } else {
          itemRow = document.getElementById(`row-${item._id}`);
        }
        const total = document.getElementById('total');
        total.value = total.value - item.product.price * item.quantity;
        itemRow.innerHTML = '';
      } else {
        await response.json().then(error => {
          console.log('ERROR: ' + error);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const quantityOnchangeHandler = async event => {
  const itemQuantity = {
    id: event.currentTarget.id,
    quantity: event.currentTarget.value,
  };

  // const itemQuantityRow = document.getElementById(`quantity-${item._id}`);
  // const quantityInput = itemQuantityRow.children[0];

  const totalPerItem = document.getElementById(
    `totalPerItem-${itemQuantity.id}`
  );
  const total = document.getElementById('total');

  await fetch(urlChangeQuantity, {
    method: 'POST',
    body: JSON.stringify(itemQuantity),
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
  })
    .then(async response => {
      if (response.status >= 200 && response.status < 300) {
        const item = await response.json();
        total.value = total.value - totalPerItem.value;
        let value = parseInt(total.value) + item.product.price * item.quantity;
        totalPerItem.value = item.product.price * item.quantity;
        total.value = value;
        //itemRow.innerHTML = '';
      } else {
        await response.json().then(error => {
          console.log('ERROR: ' + error);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
};

for (let input of itemQuantityInput) {
  input.addEventListener('change', quantityOnchangeHandler);
}

for (let btn of deleteProdBtns) {
  btn.addEventListener('click', deleteProductHandler);
}
