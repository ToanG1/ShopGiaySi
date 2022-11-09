const url = "/api/order/change-status"


const xchangeStatusHandler = (e)=>{
    let statusStr = e.currentTarget.id;
    let parent = e.currentTarget.closest('.dropdown-menu');
    const index = statusStr.indexOf('-');
    const id = statusStr.substring(index+1);
    const status = statusStr.substring(0,index);
}


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
                    const dropdownMenuButton = document.getElementById('dropdownMenuButton');
                    dropdownMenuButton.innerText = order.status;

                    // const oldScript = document.getElementById('rerun-script');
                    // const newScript = document.createElement('script');
                    // newScript.setAttribute('src', '/js/custom/rerun-change-orderstatus.js');
                    // newScript.setAttribute('id', 'rerun-script');

                    // oldScript.parentNode.insertBefore(newScript, oldScript);
                    // oldScript.parentElement.removeChild(oldScript);
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

