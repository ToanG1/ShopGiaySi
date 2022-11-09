const productName = document.getElementById("productName");
const brand = document.getElementById("brand");
const price = document.getElementById("price");
const color = document.getElementById("color");
const gender = document.getElementById("gender");
const height = document.getElementById("height");
const closure = document.getElementById("closure");
const material = document.getElementById("material");
const category = document.getElementById("category");
const image = document.getElementById("image");
const addProductForm = document.getElementById('addProductForm');

const url = '/api/products';

const product = {
    productName :productName.value,
    brand :brand.value,
    price :price.value,
    color :color.value,
    gender :gender.value,
    height :height.value,
    closure :closure.value,
    material :material.value,
    category :category.value,
    image :image.value,
}

const addProductHandler=async(event)=>{
    await fetch(url,{
        method:"POST",
        body: JSON.stringify(product),
        headers:{
            'Content-type':'application/json; charset=utf-8'
        }
    }).then(response=>{
        if (response.status>= 200 && response.status<300){
            return response.json().then(item=>{
                const itemRow = document.getElementById(`row-${item._id}`);
                itemRow.innerHTML='';
            });
        }else{
            response.json().then(error=>{
                console.log('ERROR: '+error);
            });
        }
    }).catch(error=>{
        console.log(error);
    })
}
 

