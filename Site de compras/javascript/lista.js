const LINK = "https://649ccbfb04807571923880bf.mockapi.io/"
if(!localStorage.getItem('codigoCompra')) {
  localStorage.setItem('codigoCompra', 1)
}

// if(localStorage.getItem('listaCompras') && localStorage.getItem('listaProdutos')) {
var armazenamentoLista = JSON.parse(localStorage.getItem('listaCompras'))
var armazenamentoCadastro = JSON.parse(localStorage.getItem('listaProdutos'))
let posisaoAtual = 0
if(armazenamentoCadastro != null && armazenamentoLista != null) {
  armazenamentoLista.forEach(element => {
    var corpoTabela = document.getElementById('produtosLista')
      if(element.ativo === true) {
        console.log(element.coletado)
        let inputId = "inputCodigo" + element.cod
        let trId = "trId" + element.cod
        let checkboxId = "checkboxCodigo" + element.cod
        var linha = `<tr id = "${trId}">
                        <td>${element.cod}</td>
                        <td>${element.nome}</td>
                        <td>${element.unid}</td>
                        <td>${element.quant}</td>
                        <td><input type="number" id="${inputId}" onchange="atualizaValor(${element.cod}, ${element.quant}, ${posisaoAtual})" value="${element.codBarras}"></td>
                        <td><input type="checkbox" disabled id="${checkboxId}"></td>
                    </tr>`
        corpoTabela.innerHTML += linha
        RiscaLinha(posisaoAtual)
      }
      posisaoAtual++
  })
}

function RiscaLinha(posicao){
  if (armazenamentoLista[posicao].coletado === true){
    console.log("trId" + armazenamentoLista[posicao].cod)
    document.getElementById("trId" + armazenamentoLista[posicao].cod).classList.add("risca")
    document.getElementById('inputCodigo' + armazenamentoLista[posicao].cod).setAttribute("disabled","disabled")
    document.getElementById("checkboxCodigo" + armazenamentoLista[posicao].cod).checked = true
  } 
  
}

function atualizaValor(cod, quantidade, posicao) {
  let input,checkbox
  input = document.getElementById('inputCodigo' + cod)
  checkbox = document.getElementById('checkboxCodigo' + cod)
  armazenamentoLista[posicao].codBarras = Number(input.value)

  if(Number(input.value) >= Number(quantidade)) {
    armazenamentoLista[posicao].coletado = true
    RiscaLinha(posicao)
  }
  localStorage.setItem('listaCompras', JSON.stringify(armazenamentoLista))
}

function tudoColetado() {
  let retorno = true
  armazenamentoLista.forEach(elemento => {
    if(elemento.coletado === false) {
      retorno = false
    }
  })
  return retorno
}

function trataDados(dadosCompras, dadosProdutos, posicao) {
  let retorno = {}
  retorno.Nome = dadosCompras[posicao].nome
  retorno.Unidade = dadosCompras[posicao].unid
  retorno.Quantidade = dadosCompras[posicao].quant
  retorno.CodigoBarra = dadosProdutos[posicao].codBarras
  retorno.Ativo = dadosProdutos[posicao].ativo
  retorno.QuantComprada = dadosCompras[posicao].codBarras
  return retorno
}

function salvar(){
  let coletados = true
  armazenamentoLista.forEach(elemento => {
    if(!elemento.coletado === true && elemento.ativo === true) {
      coletados = false
    }
  })
  if(coletados) {
    let metodo = 'POST';
    let data = new Date().getTime()
    fetch(LINK+"Compras",{
      method: metodo,
      body: data
    }
    ).then(function(response) {
        if (response.ok){
            return response.json();
        }
    }).catch (function (error) {
        console.log('Deu ERRO:', error);
    });

    for(let x = 0; x < armazenamentoCadastro.length; x++) {
      console.log(LINK + "Compras/" + localStorage.getItem('codigoCompra') + "/Produtos")
      fetch(LINK + "Compras/" + localStorage.getItem('codigoCompra') + "/Produtos",{
        method: metodo,
        body: JSON.stringify(trataDados(armazenamentoLista, armazenamentoCadastro, x)),
        headers: {'Content-Type': 'application/json'}
      }
      ).then(function(response) {
          if (response.ok){
              return response.json();
          }
      }).catch (function (error) {
          console.log('Deu ERRO:', error);
      });
    }
    localStorage.setItem('codigoCompra', (Number(localStorage.getItem('codigoCompra')) + 1))
    localStorage.removeItem('listaCompras')
    localStorage.removeItem('listaProdutos')
    setTimeout(function (){
      document.location.reload()
    }, 3000)
  }
}
