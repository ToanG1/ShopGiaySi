const url = "/api/order/change-status"

const changeStatusHandler=async(e)=>{
    let statusStr = e.currentTarget.id;
    const index = statusStr.indexOf('-');
    const id = statusStr.substring(index+1);
    const status = statusStr.substring(0,index);
    const itemStatus ={
        id:id,
        status: status,
    }

    let currentStatus = e.currentTarget.closest('.dropdown-menu').getAttribute("data-status");
    if(currentStatus!=status){
        await fetch(url,{
            method:"POST",
            body: JSON.stringify(itemStatus),
            headers:{
                'Content-type':'application/json; charset=utf-8'
            }
        }).then(response=>{
            if (response.status>= 200 && response.status<300){
                return response.json().then(order=>{
                    const oldRow = document.getElementById(id);
                    oldRow.remove();
                    let table;
                    if(order.status=="Delivering"){
                        table = document.getElementById('delivering-table');
                    }
                    if(order.status=="Delivered"){
                        table = document.getElementById('delivered-table');
                    }
                    if(order.status=="Pending"){
                        table = document.getElementById('pending-table');
                    }
                    const tableBody = table.querySelector('tbody');
                    const row = document.createElement('tr');
                    row.setAttribute('id',order._id);
                    row.innerHTML=`
                        <th scope="row">${order._id}</th>
                        <td>${order.user.email}</td>
                        <td>${order.phone}</td>
                        <td>${order.address}</td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                                    ${order.status}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <div class="order-status">
                                        <div class="dropdown-item data-status" id="Pending-${order._id}">Pending</div>
                                        <div class="dropdown-item data-status" id="Delivering-${order._id}">Delivering</div>
                                        <div class="dropdown-item data-status" id="Delivered-${order._id}">Delivered</div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <a href="/orders/${order._id}" class="btn btn-primary">Details</a>
                        </td>
                    `
                    alert("Change order status successfully.");
                    tableBody.appendChild(row);

                    const oldScript = document.getElementById('rerun-script');
                    const newScript = document.createElement('script');
                    newScript.setAttribute('src', '/js/custom/rerun-change-orderstatus.js');
                    newScript.setAttribute('id', 'rerun-script');

                    oldScript.parentNode.insertBefore(newScript, oldScript);
                    oldScript.parentElement.removeChild(oldScript);
                } 
                
            );
            }else{
                response.json().then(error=>{
                    console.log('ERROR: '+error);
                });
            }
        }).catch(error=>{
            console.log(error);
        })
    }
}

