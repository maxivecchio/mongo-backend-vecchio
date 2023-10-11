const usersRouter = require('./users');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const cartRouter = require('./cart');

function routerAPI( app ){
    app.use('/users', usersRouter);
    app.use('/products', productsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/cart', cartRouter);
}

module.exports = routerAPI;