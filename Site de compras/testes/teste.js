function Usuario(codigo,nome,senha){
    this.codigo = codigo;
    this.nome = nome;
    this.senha = senha;
}

var controleDados = {
    listaUsuarios : [],
    getlistaUsuarios : function(){
        this.listaUsuarios = JSON.parse( localStorage.getItem('usuarios') );
        return this.listaUsuarios;
    },
    setlistaUsuarios : function(){
        localStorage.setItem('usuarios',JSON.stringify(this.listaUsuarios));
    },
    getUsuario : function(codigo){
        return this.listaUsuarios.find( u => { return u.codigo == codigo});
    },
    salvarUsuario : function(usuario){
        this.getlistaUsuarios();
        if (usuario.codigo > 0){
            let u = this.listaUsuarios.find( u => { return u.codigo == usuario.codigo});
            u.codigo = usuario.codigo;
            u.nome = usuario.nome;
            u.unidade = usuario.unidade;
        }else{
            let count = 0;
            this.listaUsuarios.forEach(u =>{ count = Math.max(count, u.codigo)});
            usuario.codigo = count + 1; 
            this.listaUsuarios.push(usuario);    
        }        
        this.setlistaUsuarios();
    },
    excluirUsuario : function(codigo){
        this.getlistaUsuarios();
        let index = this.listaUsuarios.findIndex( p => { return p.codigo == codigo});
        if (index >= 0){
            this.listaUsuarios.splice(index,1);
        }
        console.log(this.listaUsuarios);
        this.setlistaUsuarios();
    }    
}

function carregarLista(){
    let lista = controleDados.getlistaUsuarios();
    var t1 = document.getElementById('tbodyLista');
    var linha = '';
    for(let i = 0; i < lista.length; i++){
        var {codigo,nome,senha} = lista[i];
        linha += `<tr>
                    <td>${codigo}</td>
                    <td>${nome}</td>
                    <td>${senha}</td>
                    <td> <button onclick="carregarUsuario(${codigo})" >Editar</button></td>
                    </tr>`;
    }
    t1.innerHTML = linha;
}

function salvar(){
    let c = document.getElementById('codigo');
    let n = document.getElementById('nome');
    let s = document.getElementById('senha');

    let u = new Usuario(c.value != '' ? parseInt(c.value) : 0, n.value, s.value);
    controleDados.salvarUsuario(u);
    carregarLista();
    novo();
}

function novo(){
    document.getElementById('codigo').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('senha').value = '';
}

function excluir(){
    let c = document.getElementById('codigo');
    controleDados.excluirUsuario(c.value);
    carregarLista();
    novo();
}

function carregarUsuario(codigo){
    let u = controleDados.getUsuario(codigo);
    document.getElementById('codigo').value = u.codigo;
    document.getElementById('nome').value = u.nome;
    document.getElementById('senha').value = u.senha;
}