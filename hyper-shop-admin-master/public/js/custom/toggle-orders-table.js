const filterPending = document.getElementById("filter-pending");
const filterDelivering = document.getElementById("filter-delivering");
const filterDelivered = document.getElementById("filter-delivered");
//const filterAll = document.getElementById('filter-all');

const pendingTable = document.getElementById("pending-table");
const deliveringTable = document.getElementById("delivering-table");
const deliveredTable = document.getElementById("delivered-table");
//const allTable = document.getElementById('all-table');

const tableName = document.getElementById("order-table-name");

const togglePendingTable = () => {
  //allTable.classList.add('hidden');
  pendingTable.classList.remove("hidden");
  deliveringTable.classList.add("hidden");
  deliveredTable.classList.add("hidden");

  tableName.innerText = "Danh sách đơn hàng đang chờ xử lý";
};
const toggleDeliveringTable = () => {
  //allTable.classList.add('hidden');
  pendingTable.classList.add("hidden");
  deliveringTable.classList.remove("hidden");
  deliveredTable.classList.add("hidden");

  tableName.innerText = "Danh sách đơn hàng đang giao";
};
const toggleDeliveredTable = () => {
  //allTable.classList.add('hidden');
  pendingTable.classList.add("hidden");
  deliveringTable.classList.add("hidden");
  deliveredTable.classList.remove("hidden");

  tableName.innerText = "Danh sách đơn hàng đã giao thành công";
};

const toggleAllTable = () => {
  //allTable.classList.remove('hidden');
  pendingTable.classList.add("hidden");
  deliveringTable.classList.add("hidden");
  deliveredTable.classList.add("hidden");

  tableName.innerText = "Danh sách đơn hàng đã giao thành công";
};

filterPending.addEventListener("click", togglePendingTable);
filterDelivered.addEventListener("click", toggleDeliveredTable);
filterDelivering.addEventListener("click", toggleDeliveringTable);
//filterAll.addEventListener('click', toggleAllTable);
