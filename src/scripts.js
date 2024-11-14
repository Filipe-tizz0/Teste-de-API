/*document.getElementById("Form_cadastro").addEventListener('submit',async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    await fetch('http://localhost:3000/envia/nome_senha',{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        
        body: JSON.stringify({nome,senha}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert("Usuário já cadastrado");
        }else{
            alert(`mensagem da API => Error: ${data.error} - Nome: ${data.nome} - Senha: ${data.senhahash}`);
        }
    })
    .catch(error => {
        console.error("não foi possível enviar o nome e a senha: ",error);
    });
})  */

/*document.getElementById("apresentar").addEventListener('click',async function () {

    //console.log('button working');
    fetch('http://localhost:3000/itensapi')
    .then(response => response.json())
    .then(data => {
        const listaritem = document.getElementById("list-item");
        listaritem.innerHTML = '';

        data.forEach(item => {
            const listar = document.createElement('li');
            listar.textContent = `Nome: ${item.id} e Id: ${item.nome}`;
            listaritem.appendChild(listar);
        });
    })
    .catch(error => console.error("Falha ao buscar itens: ",error));
});*/

/*fetch('http://localhost:3000/apresentar/url')
.then(response => {
if(!response.ok){
    throw new Error("Erro na requisição " + response.status);
}

    return response.json();
})
.then(data => {
    console.log(data);
    const listaritem = document.getElementById("list-item");

    if (!listaritem) {
        throw new Error("Elemento com id 'list-item' não encontrado.");
    }
    
    data.forEach(item=>{
        const listar = document.createElement('li')
        listar.textContent = ` - ${item.thing}`;
        listaritem.appendChild(listar);
    })
})
.catch(error=> console.error("erro: ",error));*/

import { mensagem_erro } from '/funcs/Messages.js';

document.getElementById("calculo_media").addEventListener('submit', async function (e) {
    e.preventDefault();
    const x = Number(document.getElementById("x").value);
    const y = Number(document.getElementById("y").value);
    const z = Number(document.getElementById("z").value);

    console.log(x + y + z);

    await fetch('http://localhost:3000/calcular_media', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y, z }),
    })
        .then(response => response.json())
        .then(data => {
            const create_response = document.getElementById("response_media");
            create_response.innerHTML = '';

            const media = document.createElement('p');
            media.textContent = `Media: ${data.media}`;
            console.log(`${data.media}`);
            create_response.appendChild(media);
        })
        .catch(error => console.error("erro ao calcular a media: ", error));

});

document.getElementById("Users_button").addEventListener('click', async function () {
    fetch('http://localhost:3000/getiing/users')
        .then(response => response.json())
        .then(data => {
            const listar_usuarios = document.getElementById("table_users");
            listar_usuarios.innerHTML = `
            <tr>
                <th>Nome:</th>
                <th>ID:</th>
            </tr>
            `;

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(users_itens => {
                    const listar_pular_item = document.createElement('tr');
                    const users_listar_nome = document.createElement('th');
                    const users_listar_id = document.createElement('th');

                    users_listar_nome.textContent = `${users_itens.nome}`;
                    users_listar_id.textContent = `${users_itens.user_id}`;

                    //listar_usuarios.appendChild(listar_pular_item);
                    listar_usuarios.appendChild(users_listar_nome);
                    listar_usuarios.appendChild(users_listar_id);
                    listar_usuarios.appendChild(listar_pular_item);
                });
            } else {
                alert("campos não definidos");
            }
        })
        .catch(error => alert("erro: " + error));
});


//envio de informações para o banco
document.getElementById("Form_cadastro").addEventListener('submit', async function (e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let senha = document.getElementById("senha").value;

    let message = "";
    let color = "";

    console.log("nome e senha: ", nome, senha);
    console.log(JSON.stringify({ nome, senha }))

    await fetch('http://localhost:3000/envia/nome_senha/db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, senha: senha }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                if (data.exeption == "todos os campos são obriagatórios") {
                    mensagem_erro("Todos os campos são obrigatórios", "red")
                } else {
                    mensagem_erro("Usuário já cadastrado", "red");
                }
            } else {
                message = "Cadastrado com sucesso";
                color = "green";
                mensagem_erro(message, color);
                //console.log(`nome: ${data[0].nome}, senha: ${data[0].senha}`);
            }
        })
        .catch(error => {
            alert(`Algo de errado não está certo - ${error}`);
        });
});


//delete ususarios e reseta a contagem dos ids
document.getElementById("delete_users").addEventListener('click', async function () {
    await fetch('http://localhost:3000/delete-users', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.status_);
            alert(data.status_);
            let message = "deletado";
            mensagem_erro(message);
        })
        .catch(error => {
            alert(error);
        });
});

