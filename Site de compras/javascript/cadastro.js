function listaProdutos(cod,nome,unid,quant,codBarras,ativo) {
    this.cod = cod
    this.nome = nome
    this.unid = unid
    this.quant = quant
    this.codBarras = codBarras
    this.ativo = ativo
}
function listaProdutos(cod,nome,unid,quant,codBarras,ativo,coletado) {
    this.cod = cod
    this.nome = nome
    this.unid = unid
    this.quant = quant
    this.codBarras = codBarras
    this.ativo = ativo
    this.coletado = coletado
}
var controleProdutos = {
    listaProdutos:[],
    listaCompras:[],
    getListaProdutos:function(){
        if(!localStorage.getItem('listaProdutos')){
            this.setListaProdutos()
            return this.listaProdutos
        }
        this.listaProdutos = JSON.parse(localStorage.getItem('listaProdutos'))
        return this.listaProdutos
    },
    getListaCompras:function(){
        if(!localStorage.getItem('listaCompras')){
            this.setlistaCompras()
            return this.listaCompras
        }
        this.listaCompras = JSON.parse(localStorage.getItem('listaCompras'))
        return this.listaCompras
    },
    setListaProdutos:function(){
        localStorage.setItem('listaProdutos',JSON.stringify(this.listaProdutos))
    },
    setlistaCompras:function(){
        localStorage.setItem('listaCompras',JSON.stringify(this.listaCompras))
    },
    getProduto:function(cod){
        return this.listaProdutos.find(u =>{return u.cod == cod})
    },
    salvarProduto:function(produto,compra){
        this.getListaProdutos()
        this.getListaCompras()
       
        if(produto.cod > 0){
            // Cadastro
            let u = this.listaProdutos.find(u =>{return u.cod == produto.cod})
            u.cod = produto.cod
            u.nome = produto.nome
            u.codBarras = produto.codBarras
            u.ativo = produto.ativo
            u.quant = produto.quant
            u.unid = produto.unid
            // Lista Compra
            let p = this.listaCompras.find(p =>{return p.cod == compra.cod})
            p.cod = compra.cod
            p.nome = compra.nome
            p.codBarras = compra.codBarras
            p.ativo = compra.ativo
            p.quant = compra.quant
            p.unid = compra.unid
        }
        else{
            // Cadastro
            let count = 0
            this.listaProdutos.forEach(x=>{count = Math.max(count,x.cod)})
            produto.cod = count+1
            this.listaProdutos.push(produto)

            // Lista Compra
            let count2 = 0
            this.listaCompras.forEach(x=>{count2 = Math.max(count2,x.cod)})
            compra.cod = count2+1
            this.listaCompras.push(compra)
        }
        this.setListaProdutos()
        this.setlistaCompras()        
    },
    excluirProduto:function(cod){
        this.getListaProdutos()
        this.getListaCompras()
        let index =  this.listaProdutos.findIndex(p=>{return p.cod == cod})
        if(index>=0){
            this.listaProdutos.splice(index,1)
            this.listaCompras.splice(index,1)
        }
        this.setListaProdutos()
        this.setlistaCompras()
    }
}
function carregarLista(){
    let lista = controleProdutos.getListaProdutos();
    var t1 = document.getElementById('produtosCadastro');
    var linha = '';
    for(let i = 0; i < lista.length; i++){
        var {cod,nome,unid,quant,codBarras,ativo} = lista[i];
        if (ativo === true){
            ativo = "Ativo"
        }
        else{
            ativo = "Não ativo"
        }

        linha += `<tr>
                    <td>${cod}</td>
                    <td>${nome}</td>
                    <td>${unid}</td>
                    <td>${quant}</td>
                    <td>${codBarras}</td>
                    <td>${ativo}</td>
                    <td> <button onclick="carregarProdutos(${cod})" class="btn btn-primary">Editar</button></td>
                    </tr>`;
    }
    t1.innerHTML = linha;
}

function salvar(){
    let cod = document.getElementById('cod')
    let nome = document.getElementById('nome')
    let unid = document.getElementById('unid')
    let quant = document.getElementById('quant')
    let codBarras = document.getElementById('codBarras')
    let ativo = document.getElementById('ativo')

    if(nome.value != "" && unid.value != "" && quant.value != ""){
        let p = new listaProdutos(cod.value != "" ? parseInt(cod.value) : 0, nome.value, unid.value,quant.value,codBarras.value,ativo.checked)
        let c = new listaProdutos(cod.value != "" ? parseInt(cod.value) : 0, nome.value, unid.value,quant.value,0,ativo.checked,false)
        controleProdutos.salvarProduto(p,c)
        carregarLista()
        novo()
    }
}

function novo(){
    document.getElementById('cod').value = ""
    document.getElementById('nome').value = ""
    document.getElementById('unid').value = ""
    document.getElementById('quant').value = ""
    document.getElementById('codBarras').value = ""
    document.getElementById('ativo').checked = false
}

function excluir(){
    let cod = document.getElementById('cod')
    controleProdutos.excluirProduto(cod.value)
    carregarLista()
    novo()
}

function carregarProdutos(codigo){
    let p = controleProdutos.getProduto(codigo);
    document.getElementById('cod').value = p.cod
    document.getElementById('nome').value = p.nome
    document.getElementById('unid').value = p.unid
    document.getElementById('quant').value = p.quant
    document.getElementById('codBarras').value = p.codBarras
    if(p.ativo === true){
        document.getElementById('ativo').checked = true
    }
    else{
        document.getElementById('ativo').checked = false
    }
    
}