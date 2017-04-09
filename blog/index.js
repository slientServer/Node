var express= require('express');
var app= express();
var indexRouter= require('./routes/index');
var usersRouter= require('./routes/users');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3000);
