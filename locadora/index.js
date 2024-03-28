const express = require ('express')
const exphbs = require ('express-handlebars')
const mysql = require ('mysql2')

const app = express()

app.engine('handlebars' , exphbs.engine())
app.set('view engine' , 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true,
}),
)

app.use(express.json())

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cadastro'
})

app.get('/' , function(req,res){
    res.render('home')
})

app.get('/veiculos', function(req,res){
    res.render('veiculos')
})

app.get('/reserva',function(req,res){
    res.render('reserva')
})
app.get('/clientes',function(req,res){
    res.render('clientes')
})

app.get('/cadc', function(req,res){
    const query = 'SELECT * FROM cliente'
    conn.query(query, function(err,data){
        if(err){
            console.log(err)
        }
        const cliente = data
        res.render('cad_cliente', {cliente})
    })
})


app.post('/cliente/insertcliente', function(req,res){
 const nome = req.body.nome
 const endereco = req.body.endereco
 const telefone = req.body.telefone
 const email = req.body.email
 const query = `INSERT INTO cliente (nome, endereco , telefone, email) VALUE ('${nome}', '${endereco}', '${telefone}', '${email}')`
  
 conn.query(query , function (err){
    if(err){
        console.log(err)

    }
    res.render('clientes')
 })

})


app.get('/cadv', function(req,res){
    const query = 'SELECT * FROM veiculos'
    conn.query(query, function(err,data){
        if(err){
            console.log(err)
        }
        const veiculos = data
        res.render('cad_veiculo', {veiculos})
    })
})

app.post('/veiculo/insertveiculo', function(req,res){
const marca = req.body.marca
const modelo = req.body.modelo
const ano = req.body.ano
const disponibilidade = req.body.disponibilidade

const query = `INSERT INTO veiculos (marca,modelo,ano,disponibilidade) VALUE ('${marca}','${modelo}','${ano}','${disponibilidade}')`

conn.query(query , function (err){
    if(err){
        console.log(err)

    }
    res.render('veiculos')
 })

})


app.post('/reserva/insertreserva',function(req,res){
const cliente = req.body.cliente
const veiculo = req.body.veiculo
const data_inicio = req.body.data_inicio
const data_fim = req.body.data_fim

const query = `INSERT INTO reservas (cliente , veiculo, data_inicio , data_fim) VALUE ('${cliente}','${veiculo}','${data_inicio}','${data_fim}')`
 
conn.query(query , function (err){
    if(err){
        console.log(err)

    }
    res.render('reserva')
 })

})


app.get('/cadr', (req, res) => {
    conn.query(`SELECT C.ID,C.NOME AS NOME_CLIENTE, V.ID AS ID_CARRO,V.MARCA, V.MODELO, R.DATA_INICIO, R.DATA_FIM
        FROM RESERVAS R
        JOIN CLIENTE C ON R.CLIENTE = C.ID
        JOIN VEICULOS V ON R.VEICULO = V.ID
        ORDER BY NOME_CLIENTE ASC;`
    , function (error, results, fields) {
        if (error) throw error;
      
      res.render('cad_reserva', {reservas: results});
    });
  });



conn.connect(function(err){
    if(err){
        console.log(err)
    }
    console.log('Conectando ao MYSQL')
    app.listen(4000)
})

