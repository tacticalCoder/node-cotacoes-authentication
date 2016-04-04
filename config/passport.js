var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');

var Fornecedor = require('app/models/fornecedor');

module.exports = function(passport) {

	passport.serializeUser(function(fornecedor, done){
        console.log('serialize');
		done(null, fornecedor.id_fornecedores);
	});

	passport.deserializeUser(function(id, done){
        console.log('desiarliafwe');
		Fornecedor.findById(id, function(err, fornecedor){
            console.log('encontrou fornecedor');
			done(err, fornecedor);
		});
	});

	passport.use('local-login', new LocalStrategy({
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, username, password, done){
            console.log('tentando encontrar usuario');
			Fornecedor.findOne(username, function(err, isNotAvailable, fornecedor){
				if (err)
					return done(err);

				if(!fornecedor)
					return done(null, false, req.flash('loginMessage','Nenhum usuário encontrado.'));

				console.log(fornecedor);

				if(!fornecedor.validPassword(password))
					return done(null, false, req.flash('loginMessage','Senha incorreta.'));
				console.log('Fornecedor Validado');
				return done(null, fornecedor);
			});
		}
	));

};
