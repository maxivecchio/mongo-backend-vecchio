const usersRouter = require('./users');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const cartRouter = require('./cart');
const auth = require('../middlewares/auth');

function routerAPI( app ){
    app.use('/api/users', usersRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/categories', categoriesRouter);
    app.use('/api/cart', auth, cartRouter);
}

module.exports = routerAPI;