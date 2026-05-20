
let automoveis = JSON.parse(localStorage.getItem('automoveis')) || [];
let estadias = JSON.parse(localStorage.getItem('estadias')) || [];

document.addEventListener('DOMContentLoaded', () => {
  
    if (document.getElementById('formAutomovel')) {
        inicializarAutomoveis();
    }
    
    if (document.getElementById('formEstadia')) {
        inicializarEstadias();
    }
});

// AUTOMOVEIS

function inicializarAutomoveis() {
    const formAutomovel = document.getElementById('formAutomovel');
    listarAutomoveis();

    formAutomovel.addEventListener('submit', (e) => {
        e.preventDefault();

        const placa = document.getElementById('placa').value.toUpperCase().trim();

        if (automoveis.some(auto => auto.placa === placa)) {
            alert('Este automóvel com esta placa já está cadastrado!');
            return;
        }

        const novoAutomovel = {
            placa: placa,
            proprietario: document.getElementById('proprietario').value,
            tipo: document.getElementById('tipo').value,
            modelo: document.getElementById('modelo').value,
            telefone: document.getElementById('telefone').value,
            marca: document.getElementById('marca').value,
            cor: document.getElementById('cor').value || 'Não informada',
            ano: document.getElementById('ano').value || 'Não informado'
        };

        automoveis.push(novoAutomovel);
        localStorage.setItem('automoveis', JSON.stringify(automoveis));
        
        formAutomovel.reset();
        listarAutomoveis();
        alert('Automóvel cadastrado com sucesso!');
    });
}

function listarAutomoveis() {
    const listaDiv = document.getElementById('listaAutomoveis');
    if (!listaDiv) return;

    if (automoveis.length === 0) {
        listaDiv.innerHTML = '<p>Nenhum automóvel cadastrado.</p>';
        return;
    }

    let html = '<table border="1" style="width:100%;text-align: center;">';
    html += '<tr><th>Placa</th><th>Modelo/Marca</th><th>Proprietário</th><th>Tipo</th><th>Telefone</th><th>Excluir</th></tr>';

    automoveis.forEach(auto => {
        html += `<tr>
            <td><strong>${auto.placa}</strong></td>
            <td>${auto.modelo} (${auto.marca})</td>
            <td>${auto.proprietario}</td>
            <td>${auto.tipo}</td>
            <td>${auto.telefone}</td>
            <td><button onclick="excluirAutomovel('${auto.placa}')" style="color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    Excluir
                </button></td>
        </tr>`;
    });

    html += '</table>';
    listaDiv.innerHTML = html;
}


// ESTADIAS

function inicializarEstadias() {
    const formEstadia = document.getElementById('formEstadia');
    listarEstadias();

    formEstadia.addEventListener('submit', (e) => {
        e.preventDefault();

        const placaProc = document.getElementById('automovelPlaca').value.toUpperCase().trim();
        
        const veiculoExiste = automoveis.some(auto => auto.placa === placaProc);
        if (!veiculoExiste) {
            alert('Aviso: Esta placa não está cadastrada no sistema de Automóveis. Cadastre-o primeiro.');
            return;
        }

        const estadiaAtiva = estadias.some(est => est.placa === placaProc && est.status === 'ativa');
        if (estadiaAtiva) {
            alert('Este veículo já possui uma estadia ativa no momento!');
            return;
        }

        const novaEstadia = {
            id: Date.now(),
            placa: placaProc,
            valorHora: parseFloat(document.getElementById('valorHora').value),
            entrada: new Date().toISOString(),
            saida: null,
            valorTotal: null,
            status: 'ativa'
        };

        estadias.push(novaEstadia);
        localStorage.setItem('estadias', JSON.stringify(estadias));

        formEstadia.reset();
        listarEstadias();
        alert('Estadia iniciada com sucesso!');
    });
}

function listarEstadias() {
    const listaDiv = document.getElementById('listaEstadias');
    if (!listaDiv) return;

    if (estadias.length === 0) {
        listaDiv.innerHTML = '<p>Nenhuma estadia registrada.</p>';
        return;
    }

    let html = '<table border="1" style="width:100%; border-collapse: collapse; text-align: left;">';
    html += '<tr><th>Placa</th><th>Entrada</th><th>Saída</th><th>Valor/Hora</th><th>Total</th><th>Ações</th></tr>';

    estadias.forEach(est => {
        const dataEntrada = new Date(est.entrada).toLocaleString('pt-BR');
        const dataSaida = est.saida ? new Date(est.saida).toLocaleString('pt-BR') : '-';
        const total = est.valorTotal ? `R$ ${est.valorTotal.toFixed(2)}` : '-';
        
        const botaoAcao = est.status === 'ativa' 
            ? `<button onclick="finalizarEstadia(${est.id})">Finalizar Estadia</button>` 
            : 'Encerrada';

        html += `<tr>
            <td><strong>${est.placa}</strong></td>
            <td>${dataEntrada}</td>
            <td>${dataSaida}</td>
            <td>R$ ${est.valorHora.toFixed(2)}</td>
            <td><span style="color: ${est.status === 'ativa' ? 'orange' : 'green'}">${total}</span></td>
            <td>${botaoAcao}</td>
        </tr>`;
    });

    html += '</table>';
    listaDiv.innerHTML = html;
}

window.finalizarEstadia = function(id) {
    const estadia = estadias.find(est => est.id === id);
    if (!estadia) return;

    estadia.saida = new Date().toISOString();
    
    const tempoMs = new Date(estadia.saida) - new Date(estadia.entrada);
    
    const tempoHoras = Math.max(tempoMs / (1000 * 60 * 60), 0.1); 
    
    estadia.valorTotal = tempoHoras * estadia.valorHora;
    estadia.status = 'encerrada';

    localStorage.setItem('estadias', JSON.stringify(estadias));
    listarEstadias();
    
    alert(`Estadia finalizada!\nTempo cobrado: ${tempoHoras.toFixed(2)} horas.\nTotal: R$ ${estadia.valorTotal.toFixed(2)}`);
};