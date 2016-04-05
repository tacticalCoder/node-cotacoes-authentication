var pg = require('pg');
var database = require('config/database.js');

// var client = new pg.Client(database.url);

function Fornecedor(){
	this.id_fornecedores = 0;
	this.username = "";
	this.senha = "";
    this.nm_fornecedor = "";

	this.validPassword = function(senha){
		return (senha == this.senha);
	};
}

Fornecedor.findOne = function(username, callback){

	var isNotAvailable = false;
	var client = new pg.Client(database.url);
	client.connect();

	client.query("select * from sigh.fornecedores where username = $1",[username], function(err, result){
		var fornecedor;

		if (err) {
			return callback(err, isNotAvailable, null);
		}

		if (result.rows.length > 0) {
			fornecedor = new Fornecedor();
			isNotAvailable = true;
			fornecedor.id_fornecedores = result.rows[0].id_fornecedores;
			fornecedor.username = username;
			fornecedor.senha = result.rows[0].senha;
            fornecedor.nm_fornecedor = result.rows[0].nm_fornecedor;
		} else {
			isNotAvailable = false;
		}

		client.end();
		return callback(false, isNotAvailable, fornecedor);
	});
};

Fornecedor.findById = function(id, callback){
	var client = new pg.Client(database.url);
	client.connect();
	client.query("select * from sigh.fornecedores where id_fornecedores = $1",[id], function(err, result){

		if (err) {
			return callback(err, null);
		}

		if (result.rows.length > 0) {
			var fornecedor = new Fornecedor();
			fornecedor.username = result.rows[0].username;
			fornecedor.senha = result.rows[0].senha;
			fornecedor.id_fornecedores = result.rows[0].id_fornecedores;
            fornecedor.nm_fornecedor = result.rows[0].nm_fornecedor;
			client.end();
			return callback(null, fornecedor);
		} else {
			client.end();
		}


	});
};

module.exports = Fornecedor;
