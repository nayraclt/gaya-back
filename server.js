const express = require('express')
// Criando uma instancia do express
const server = express()

/**
 * O body_parse é um middleware que permite que você recupere os dados
 * que serão passados pelo usuário
 */
const body_parser = require('body-parser')

//importando o CORS para acessos externos do frontend
const cors = require('cors')

// Aqui é injetado o body_parser ao express
server.use(body_parser.json())
server.use(cors())

//importando o json inicial com os dados dos produtos
let data = require('./products')

//criacao de uma rota para navegar pelo browser
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// rota que lista todos os produtos armezenados no Json
server.get('/products', (req, res) => {
    res.json(data)
})

// Rota para recupera um produto especifico
server.get('/product/:id', (req, res) => {
    const itemId = req.params.id
    const item = data.find(_item => _item.id = itemId)
    if (item) {
        res.json(item)
    } else {
        res.json({ message: `O item ${itemId} não existe!` })
    }
})

// Gera o proximo ID na criacao do produto
const generateId = () => {
    const maxId = data.length > 0 ? 
    Math.max(...data.map(n => n.id)) : 0
    return maxId + 1
}

// Cria um novo produto no Json
server.post('/product', (req, res) => {
    const body = req.body,
    product = {
        id: generateId(),
        name: body.name,
    }
    // Usando o concat e criado um clone do objeto atual adicionando o item inserido
    data = data.concat(product)
    res.json(data)
})

//delete um item da lista de produtos do Json
server.delete('/product/:id', (req, res) => {
    const idItem = Number(req.params.id)
    data = data.filter(item => item.id !== idItem)
    res.json(data).status(204).end()
})

// Declaro a porta para subir o sevidor express no node
const port = 4000

// apresenta no teminal o log a aplicacao
server.listen(port, () => {
    console.log(`Server listening at ${ port }`)
})
