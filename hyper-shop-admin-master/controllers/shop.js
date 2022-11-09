exports.getIndex = (req, res, next)=>{
    res.status(200).render('shop/index',{
        pageTitle:'Hyper shop',
        products:[
            {
                id:'154435',
                sport:'casual',
                name:'Air force 1 Fontanka',
                description:'This is a short excerpt to generally describe what the item is about.',
                price:120,
                image:'images/air-force-1-fontanka.jpg'
            },
            {
                id:'135345',
                sport:'Basketball',
                name:'KD 14',
                description:'This is a short excerpt to generally describe what the item is about.',
                price:110,
                image:'images/kd14.jpg'
            },
            {
                id:'423433',
                sport:'Baskeball',
                name:'Zoom Freak 3',
                description:'This is a short excerpt to generally describe what the item is about.',
                price:120,
                image:'images/zoom-freak-3.jpg'
            },
        ],
        user:req.user
    });
}



