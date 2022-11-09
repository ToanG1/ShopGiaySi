exports.get404Error = async (req, res, next)=>{
    res.status(404).render('shop/404', {
        pageTitle: "Page not found",
        user: req.user,
    });
}