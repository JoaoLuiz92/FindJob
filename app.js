//Fazendo requisição e criando app
const express    = require ('express');
const exphbs    = require ('express-handlebars');
const path = require ('path');
const app = express();
const db = require('./db/connection');
const bodyParser = require('body-parser');
const router = require('./routes/jobs.js');
const Job = require('./models/Job');
const { query } = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//add porta
const PORT = 3000;
// Dizer que vai usar o body paser para o app
//body-parser
app.use(bodyParser.urlencoded ({extended: false}));

//utilizando handlebars
app.set('views',path.join (__dirname,'views'));
app.engine('handlebars', exphbs ({defaultLayout :'main'}));
app.set('view engine', 'handlebars');

//static folder

app.use (express.static(path.join(__dirname,'public')));

//fazer escutar porta
app.listen(3000,() => {
    console.log(`O express está escutando na porta`);
});


// db connection

db
.authenticate ()
.then(() => {
    console.log(`conectou com sucesso no banco de dados`)
})
.catch(err => {
    console.log(`occorreu um erroo.`,err)
})
//rota add

router.get ('/add', (req,res) => {
    res.render('add')
})


//ROTA

app.get('/', (req,res) => {

    let search = req.query.job;
    let query = '%'+search+'%'; //PH -> PHP, WORD -> WORDPRESS

    if(!search) {
        Job.findAll({order:[
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            });
        })
        .catch(err => console.log(err));   
    } else {
        Job.findAll({
            where : {title : {[Op.like] : query}},
            order:[
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }
});

//usa as rotas
app.use('/jobs', require('./routes/jobs.js'));

