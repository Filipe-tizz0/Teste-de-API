const express = require('express');
const cors = require('cors');
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const uuid = require('uuid');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yye',
    password: 'filipe',
    port: 5432
});

const uuidv4 = uuid.v4();

app.use(cors());

const port = 3000;

app.use(express.static('api aula video'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
});

app.get('/db-test', async (req, res) => {
    try {
        const consulta = await pool.query('SELECT NOW()');
        res.json({
            time: consulta.rows[0].now
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao encontrar dados' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});

let users = [];

/*app.post('/envia/nome_senha', async (req, res) => {
    const { nome, senha } = req.body;
    const id = uuid.v4();
    let error = false;
    let exeption = "";

    if (!nome || !senha) {
        error = true;
        exeption = "todos os campos são obriagatórios";
        res.status(400).json({
            error, exeption
        });
    }
    users.forEach(username => {
        if (username.nome == nome) {
            error = "usuario_cadastrado";
            res.status(400).json({ error });
        }
    });

    const senhahash = await hash(senha, 8);

    const user = { error, nome, senhahash, id };
    users.push(user);
    res.status(201).json(user);
})*/

/*app.get('/itensapi', (req, res) => {
    const itens = [
        { id: 1, nome: 'filipe' },
        { id: 2, nome: 'davi' },
        { id: 3, nome: 'sara' }
    ];

    res.json(itens);
});*/

/*app.get('/apresentar/url', (req, res) => {
    const itens = [{ thing: 'a' }];

    res.json(itens);
});*/

app.post('/calcular_media', async (req, res) => {
    const { x, y, z } = req.body;
    const media_send = { media: (x + y + z) / 3 };

    if (!x || !y || !z) {
        res.status(400).send("Todos os campos são obrigatórios");
    }

    res.status(200).json(media_send);
});

/*app.post('/lista_tarefa/:id', (req, res) => {
    const { id } = req.params;
    const { nome, description } = req.body;
    let userExist = 0;

    if (users.length === 0) {
        return res.status(404).send(`Nenhum usuário cadastrado.`);
    }

    users.forEach(username => {
        if (username.id === id) {
            userExist = users;
        }
    });

    if (userExist) {
        res.status(200).json({
            message: 'usuario encontrado com sucesso',
            nome: userExist
        });
    } else {
        res.status(404).send(`Usuário não encontrado.`);
    }
});*/

app.get('/getiing/users', async (req, res) => {
    let usuarios_cadastrados = await pool.query(`SELECT users.nome, users.user_id FROM users`);
    res.json(usuarios_cadastrados.rows);
});

app.post('/envia/nome_senha/db', async (req, res) => {
    const { nome, senha } = req.body;
    let error = false;
    let exeption = "";

    if (!nome || !senha || nome.length <= 0 || senha.length <= 0) {
        error = true;
        exeption = "todos os campos são obriagatórios";
        res.status(400).json({
            error, exeption
        });
    } else {
        const senhahash = await hash(senha, 8);

        try {
            const userduplicado = await pool.query('SELECT nome FROM users WHERE nome = $1', [nome]);
            if (userduplicado.rows.length > 0) {

                error = "Usuário já cadastrado."
                res.status(400).json({ error });

            } else {

                await pool.query('INSERT INTO USERS (nome, senha) VALUES ($1,$2)', [nome, senhahash]);
                let users_ = await pool.query(`SELECT * FROM users WHERE nome = $1`, [nome]);
                res.status(201).json(users_.rows);
            }


        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'Erro ao enviar os dados'
            });
        }
    }

})

app.post('/delete-users', async (req, res) => {
    await pool.query(`update produtos set user_id_fk = NULL; DELETE FROM users; ALTER SEQUENCE public.users_user_id_seq RESTART 1`);
    res.status(200).json({
        status_: "deletado"
    });
});

app.post('/login/nome_senha', async (req, res) => {
    try {
        const { nome, senha } = req.body;


        const verify = await pool.query('SELECT users.nome,users.senha,users.user_id FROM users WHERE users.nome like $1', [nome]);

        if (verify.rows.length > 0) {
            let senhahash_login = await bcrypt.compare(senha, verify.rows[0].senha);

            if (senhahash_login) {
                res.status(200).json({
                    status_: "Logado com sucesso",
                    user_id: verify.rows[0].user_id,
                    username: verify.rows[0].nome
                });
            } else {
                res.status(400).json({
                    verifysenha: false,
                    senha: senha,
                    senha_hash: senhahash_login,
                    senhadb: verify.rows[0].senha,
                    status_: "Dados incorretos"
                });
            }
        } else {
            res.status(404).json({
                status_: "Não encontrado"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao comparar os dados'
        });
    }

});

app.post('/cadastro_produtos', async (req, res) => {
    const { prod_nome, prod_ean, user_id_prod } = req.body;

    if (!prod_nome || !prod_ean || !user_id_prod) {

        let faltam = '';
        if (!prod_nome) {
            faltam = 'Nome';
        }

        if (!prod_ean) {
            faltam = `${faltam}, Ean`;
        }

        if (!user_id_prod) {
            faltam = `${faltam}, Id do usuário`;
        }
        res.status(400).json({
            erro: true,
            resposta: 'Todos os campos são obrigatórios',
            faltaram: faltam
        })
    } else {

        const verifica_prod = await pool.query("SELECT produtos.descricao, produtos.ean FROM produtos where produtos.ean like $1 and produtos.descricao like $2 and produtos.user_id_fk = $3", [prod_ean, prod_nome, user_id_prod]);

        if (verifica_prod.rows.length > 0) {
            //console.log(verifica_prod.rows);
            res.status(400).json({
                erro: true,
                resposta: "Esse produto já está registrado para este usuário"
            });
        } else {

            await pool.query(`INSERT INTO produtos(descricao,ean,user_id_fk) values($1,$2,$3)`, [prod_nome, prod_ean, user_id_prod]);

            res.status(201).json({
                erro: false,
                resposta: `Criado com sucesso e linkados no usuário ${user_id_prod}`
            });
        }
    }

})

app.get('/busca_produtos/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const prod = await pool.query(`SELECT * FROM produtos WHERE user_id_fk = $1 order by prod_id limit 20`, [user_id]);

        if (prod.rows.length > 0) {
            res.status(200).json({
                user_id: user_id,
                produtos: prod.rows
            });
        } else {
            res.status(400).json({
                resposta: "Não foram encontrados dados"
            });
        }
    } catch {
        res.status(500).json({
            resposta: "Erro interno na API"
        });
    }
});