import { mensagem_erro } from '/funcs/Messages.js';
let usuário_logado = sessionStorage.getItem('user_logado');
let user_id_logado = sessionStorage.getItem('user_id_logado');

if (usuário_logado && usuário_logado != null) {
    const H1element = document.createElement('h1');
    H1element.innerHTML = `Bem vindo de volta ${usuário_logado}`;

    const textouser = document.getElementById("logado_sucesso");
    textouser.appendChild(H1element);
} else {
    window.location.href = 'login.html';
}

document.getElementById("form_cad").addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome_prod = document.getElementById("produto_nome").value;
    const ean_prod = document.getElementById("produto_ean").value;

    fetch('http://localhost:3000/cadastro_produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prod_nome: nome_prod,
            prod_ean: ean_prod,
            user_id_prod: user_id_logado
        })
    })
        .then(response => response.json())
        .then(data => {
            let message = '';
            let color = '';
            if (data.erro == false) {
                message = 'Produto cadastrado com sucesso';
                color = 'green';
                mensagem_erro(message, color, 'mensagem_cad');
            } else {
                //alert(`falha ao enviar ${data.resposta}, ${data.faltaram}`)
                if (data.resposta == "Esse produto já está registrado para este usuário") {
                    mensagem_erro(`${data.resposta}`, 'red', 'mensagem_cad');
                    console.log(ean_prod, nome_prod);
                } else if (data.resposta == "Todos os campos são obrigatórios") {
                    mensagem_erro(`${data.resposta}. Faltaram preencher ${data.faltaram}`, 'red', 'mensagem_cad');
                    console.log(ean_prod, nome_prod);
                }
            }
        });
});

let test_id = document.createElement('p');
test_id.innerHTML = '';
test_id.textContent = `User_id: ${user_id_logado}`;

const test_list_id = document.getElementById("listagem_produtos");
test_list_id.appendChild(test_id);

fetch(`http://localhost:3000/busca_produtos/${user_id_logado}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
    .then(response => response.json())
    .then(data => {

        if (!data.resposta) {
            const test_list_produtos = document.getElementById("table_prod");
            test_list_produtos.innerHTML = `<tr>
              <th>ID</th>
              <th>DESCRIÇÂO</th>
              <th>EAN</th>  
            </tr>`;

            data.produtos.forEach(list_prod => {
                let pular_linha = document.createElement('tr');
                let id_produtos = document.createElement('th');
                let desc_produtos = document.createElement('th');
                let ean_produtos = document.createElement('th');

                id_produtos.textContent = `${list_prod.prod_id}`;
                desc_produtos.textContent = `${list_prod.descricao}`;
                ean_produtos.textContent = `${list_prod.ean}`;

                test_list_produtos.appendChild(pular_linha);
                pular_linha.appendChild(id_produtos);
                pular_linha.appendChild(desc_produtos);
                pular_linha.appendChild(ean_produtos);

            });
        } else {
            let color = 'red';
            let message = "Não foram encontrados produtos";
            mensagem_erro(message, color, 'mensagem_list');
        }

    })
    .catch(error => console.log(error));

document.getElementById('atualizar_lista').addEventListener('click', async function () {
    console.log('botão clicado');

    await fetch(`http://localhost:3000/busca_produtos/${user_id_logado}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {

            if (!data.resposta) {

                document.getElementById("mensagem_list").innerHTML = '';

                const test_list_produtos = document.getElementById("table_prod");
                test_list_produtos.innerHTML = `<tr>
                  <th>ID</th>
                  <th>DESCRIÇÂO</th>
                  <th>EAN</th>  
                </tr>`;

                data.produtos.forEach(list_prod => {
                    let pular_linha = document.createElement('tr');
                    let id_produtos = document.createElement('th');
                    let desc_produtos = document.createElement('th');
                    let ean_produtos = document.createElement('th');

                    id_produtos.textContent = `${list_prod.prod_id}`;
                    desc_produtos.textContent = `${list_prod.descricao}`;
                    ean_produtos.textContent = `${list_prod.ean}`;

                    test_list_produtos.appendChild(pular_linha);
                    pular_linha.appendChild(id_produtos);
                    pular_linha.appendChild(desc_produtos);
                    pular_linha.appendChild(ean_produtos);

                });
            } else {
                let color = 'red';
                let message = "Não foram encontrados produtos";
                mensagem_erro(message, color, 'mensagem_list');

                document.getElementById("table_prod").innerHTML = '';
            }

        })
        .catch(error => console.log(error));
})

document.getElementById("link_logout").addEventListener('click', function () {
    sessionStorage.clear();
    location.replace(location.href);
});