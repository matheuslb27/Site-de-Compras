
class Usuario {
    constructor(codigo, nome, senha) {
        this.codigo = codigo;
        this.nome = nome; 
        this.senha = senha;
    } 
}

var controladorDados = {
    listaUsuario : [],

    getListaUsuario : function(){
        let str = window.localStorage.getItem('listaUsuario');
        if (str){
            this.listaUsuario = JSON.parse(str);
        } else{
            this.listaUsuario = [];
        }
        return this.listaUsuario;
    },

    setListaUsuario : function(){
        window.localStorage.setItem('listaUsuario', JSON.stringify( this.listaUsuario ) );
    },

    salvarUsuario : function(usuario){
        this.getListaUsuario();
        this.listaUsuario.push(usuario);
        this.setListaUsuario();
    }
}

function salvar() {
    let c = document.getElementById('codigo');
    let n = document.getElementById('nome');
    let s = document.getElementById('senha');

    let u = new Usuario(c.value, n.value, s.value);
    // console.log(u);
    controladorDados.salvarUsuario(u);
}

function carregaTela(){
    let lista = controladorDados.getListaUsuario();

    let tbodyLista = document.getElementById('tbodyLista');
    let str = '';
    for (const u in lista) {
        console.log(u);
        str += `
        <tr>
            <td>${u.codigo}</td>
            <td>${u.nome}</td>
            <td>${u.senha}</td>
            <td><button>Editar</button></td>
        </tr>
        `;
    }
    tbodyLista.innerHTML = str;
}