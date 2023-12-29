const modal = document.getElementById("modalPokemon");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const arrayStatsTitulo = Array.from(document.getElementsByClassName("stats__item--titulo"));
const arrayAbasDesc = Array.from(document.getElementsByClassName("description__aba"));

const nomeDoPokemon = document.getElementById("nomeDoPokemon");
const numeroDoPokemon = document.getElementById("numeroDoPokemon");
const tiposDoPokemon = document.getElementById("tiposDoPokemon");
const imagemDoPokemon = document.getElementById("imagemDoPokemon");
const especieDoPokemon = document.getElementById("especieDoPokemon");
const alturaDoPokemon = document.getElementById("alturaDoPokemon");
const pesoDoPokemon = document.getElementById("pesoDoPokemon");
const habilidadesDoPokemon = document.getElementById("habilidadesDoPokemon");
const vidaDoPokemon = document.getElementById("vidaDoPokemon");
const ataqueDoPokemon = document.getElementById("ataqueDoPokemon");
const defesaDoPokemon = document.getElementById("defesaDoPokemon");
const spatkDoPokemon = document.getElementById("spatkDoPokemon");
const spdefDoPokemon = document.getElementById("spdefDoPokemon");
const velDoPokemon = document.getElementById("velDoPokemon");
const evoChain = document.getElementById("evoChain");

// Função assíncrona que abre o modal do Pokémon com base no ID fornecido
async function abrirModalDoPokemon(idDoPokemon) {
    try {
        // Aguarda a conclusão de ambas as operações assíncronas
        await Promise.all([pegarStatsDoPokmeon(idDoPokemon), pegarEvolucoes(idDoPokemon)]);
        
        // Exibe o modal após o sucesso das operações
        modal.showModal();

        // Exemplo de feedback ao usuário (pode ser ajustado conforme necessário)
        // exibirMensagemAoUsuario("Modal aberto com sucesso!");
    } catch (error) {
        // Em caso de erro, imprime mensagem de erro no console e fornece feedback ao usuário
        console.error("Erro ao abrir o modal:", error);
        exibirMensagemAoUsuario("Erro ao abrir o modal. Tente novamente mais tarde.");
    }
}

// Função aprimorada para exibir mensagens ao usuário
function exibirMensagemAoUsuario(mensagem, tipo = "info", tempoExibicao = 3000) {
    // Cria um elemento de mensagem
    const mensagemElemento = document.createElement("div");
    mensagemElemento.className = `mensagem-${tipo}`;
    mensagemElemento.textContent = mensagem;

    // Adiciona a mensagem ao corpo do documento
    document.body.appendChild(mensagemElemento);

    // Remove a mensagem após o tempo especificado
    setTimeout(() => {
        mensagemElemento.remove();
    }, tempoExibicao);
}


async function pegarStatsDoPokmeon(idDoPokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idDoPokemon}`);
        const pokemon = await response.json();
        povoarModalDoPokemon(pokemon);
    } catch (error) {
        console.error("Erro ao obter estatísticas do Pokémon:", error);
    }
}

function povoarModalDoPokemon(pokemon) {
    // Limpa as classes existentes no modal e adiciona as classes necessárias
    modal.classList.remove(...modal.classList);
    modal.classList.add("modal__container", pokemon.types[0].type.name);

    // Preenche os dados do Pokemon no modal
    nomeDoPokemon.innerHTML = pokemon.name;

    if (pokemon.id < 10) {
        numeroDoPokemon.innerHTML = `# 00${pokemon.id}`;
    }else if (pokemon.id < 100) {
        numeroDoPokemon.innerHTML = `# 0${pokemon.id}`;
    }else{
        numeroDoPokemon.innerHTML = `# ${pokemon.id}`;
    }

    // Cria elementos HTML para cada tipo do Pokemon
    const tipoElementos = pokemon.types.map(tipo => `<span class="type ${tipo.type.name}">${tipo.type.name}</span>`).join(" ");
    tiposDoPokemon.innerHTML = tipoElementos;

    // Define a imagem do Pokemon
    imagemDoPokemon.src = pokemon.sprites.other.dream_world.front_default;

    // Popula o about
    especieDoPokemon.innerHTML = pokemon.species.name;
    alturaDoPokemon.innerHTML = `${pokemon.height / 10} m`;
    pesoDoPokemon.innerHTML = `${pokemon.weight / 10} kg`;

    // Cria uma string com as habilidades do Pokemon
    habilidadesDoPokemon.innerHTML = pokemon.abilities.map(habilidade => habilidade.ability.name[0].toUpperCase() + habilidade.ability.name.substring(1)).join(", ");
    
    // Função auxiliar para preencher a barra de range com cor dinâmica
    const povoarRange = (stat, index) => {
        const valor = pokemon.stats[index].base_stat;
        const cor = valor > 49 ? "lightgreen" : "red";
        return `<span>${valor}</span><span class="description__range"><div style="width: ${(valor * 100) / 150}%; background: ${cor};"></div></span>`;
    };

    // Preenche as barras de range para os stats do Pokemon
    vidaDoPokemon.innerHTML = povoarRange("vida", 0);
    ataqueDoPokemon.innerHTML = povoarRange("ataque", 1);
    defesaDoPokemon.innerHTML = povoarRange("defesa", 2);
    spatkDoPokemon.innerHTML = povoarRange("spatk", 3);
    spdefDoPokemon.innerHTML = povoarRange("spdef", 4);
    velDoPokemon.innerHTML = povoarRange("vel", 5);
}


// Adicione um ouvinte de evento para a ação de clique no botão
botaoFecharModal.addEventListener("click", () => {
    // A função de callback é executada quando o botão é clicado
    // Fecha o modal utilizando a função close() associada ao modal
    modal.close();
});


// Mapeia cada elemento HTML no array arrayStatsTitulo
arrayStatsTitulo.map((elementoHTML) => {
    // Adiciona um ouvinte de evento para a ação de clique em cada elemento HTML
    elementoHTML.addEventListener("click", (evento) => {
        // Remove a classe "item__ativo" de todos os elementos em arrayStatsTitulo
        arrayStatsTitulo.map((elemento) => {
            elemento.classList.remove("item__ativo");
        });

        // Remove a classe "item__ativo" de todos os elementos em arrayAbasDesc
        arrayAbasDesc.map((elemento) => {
            elemento.classList.remove("item__ativo");
        });

        // Adiciona a classe "item__ativo" ao elemento que foi clicado
        evento.target.classList.add("item__ativo");

        // Adiciona a classe "item__ativo" ao elemento correspondente em arrayAbasDesc
        arrayAbasDesc[arrayStatsTitulo.indexOf(evento.target)].classList.add("item__ativo");
    });
});

// Função para obter as evoluções de um Pokémon com base no seu ID
async function pegarEvolucoes(idDoPokemon) {
    try {
        // Obtém detalhes da espécie do Pokémon usando a API PokeAPI
        const species = await obterDetalhesDaEspecie(idDoPokemon);

        // Obtém os detalhes da cadeia de evolução usando a URL
        const evolutionChain = await obterDetalhesDaCadeiaDeEvolucao(species.evolution_chain.url);
        
        // Obtém nomes das evoluções
        const evolutions = obterNomesDasEvolucoes(evolutionChain);
        
        // Atualiza a interface de usuário com a cadeia de evolução
        atualizarInterfaceComEvolucoes(evolutions);

    } catch (error) {
        // Manipula erros, se houver, durante o processo de obtenção de evoluções
        console.error("Erro ao obter evoluções:", error);
    }
}

// Função para obter detalhes da espécie do Pokémon
async function obterDetalhesDaEspecie(idDoPokemon) {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idDoPokemon}`);
    return await speciesResponse.json();
}

// Função para obter detalhes da cadeia de evolução
async function obterDetalhesDaCadeiaDeEvolucao(evolutionChainURL) {
    const evolutionChainResponse = await fetch(evolutionChainURL);
    return await evolutionChainResponse.json();
}

// Função para obter nomes das evoluções
function obterNomesDasEvolucoes(evolutionChain) {
    const evolutions = [];

    let evolution0, evolution1, evolution2;
    
    evolution0 = evolutionChain.chain.species.name;
    evolutions.push({ name: evolution0 });
    
    if (evolutionChain.chain.evolves_to.length > 0) {
        evolution1 = evolutionChain.chain.evolves_to[0].species.name;
        evolutions.push({ name: evolution1 });
        
        if (evolutionChain.chain.evolves_to[0].evolves_to.length > 0) {
            evolution2 = evolutionChain.chain.evolves_to[0].evolves_to[0].species.name;
            evolutions.push({ name: evolution2 });
        }
    }
    
    return evolutions;
}

// Função para atualizar a interface de usuário com as evoluções
async function atualizarInterfaceComEvolucoes(evolutions) {
    evoChain.innerHTML = `<h3 class="evo__title">Evolution Chain</h3>`;

    for (let index = 0; index < evolutions.length; index++) {
        const evolucao = evolutions[index];
        const evolucaoJson = await obterDetalhesDoPokemon(evolucao.name);

        evolucao.img = evolucaoJson.sprites.other.dream_world.front_default;

        // Adiciona elementos à interface de usuário com base nas evoluções
        if (evolutions.length === 1) {
            adicionarElementoEvolucaoUnica(evolucao);
        }

        if (evolutions.length > 1 && index > 0) {
            adicionarElementosCadeiaEvolucao(evolucao, evolutions[index - 1]);
        }
    }
}
// Função para obter detalhes do Pokémon
async function obterDetalhesDoPokemon(nomeDoPokemon) {
    const evolucaoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeDoPokemon}`);
    return await evolucaoResponse.json();
}

// Função para adicionar elementos à interface de usuário para uma evolução única
function adicionarElementoEvolucaoUnica(evolucao) {
    const cell = criarElemento("div", "evo__cell", `<img class="pokemon__evo--imagem" src=${evolucao.img} alt="imagem de ${evolucao.name}"/><span>${evolucao.name}</span><span>Este pokemon não tem evoluções.</span>`);
    evoChain.appendChild(cell);
}

// Função para adicionar elementos à interface de usuário para uma cadeia de evolução
function adicionarElementosCadeiaEvolucao(evolucao, evolucaoAnterior) {
    const cell1 = criarElemento("div", "evo__cell", `<img class="pokemon__evo--imagem" src=${evolucaoAnterior.img} alt="imagem de ${evolucaoAnterior.name}"/><span>${evolucaoAnterior.name}</span>`);
    const cell2 = criarElemento("div", "evo__cell", "<span class='evo__cell--pointer'>➡</span>");
    const cell3 = criarElemento("div", "evo__cell", `<img class="pokemon__evo--imagem" src=${evolucao.img} alt="imagem de ${evolucao.name}"/><span>${evolucao.name}</span>`);
    const row = criarElemento("div", "evo__row");
    row.append(cell1, cell2, cell3);
    evoChain.appendChild(row);
}

// Função auxiliar para criar elementos HTML
function criarElemento(tag, classe, conteudo = "") {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    elemento.innerHTML = conteudo;
    return elemento;
}
