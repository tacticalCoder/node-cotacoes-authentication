var express = require('express');
var pg = require('pg');
var path = require('path');
var database = require('config/database.js');


module.exports = function(app, passport){

  app.get('/api/cotacoes', isLoggedIn, function(req, res, next) {

    var results = [];
    pg.connect(database.url, function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         console.log('username: ' + req.user);

        var query = client.query(
            "select * from sigh.v_cons_cotacoes_por_fornecedor where cod_fornecedor = $1 and status_cotacao <> 4",[req.user.id_fornecedores]
        );

        query.on('row', function(row) {
            results.push(row);
        });
        
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

  });

  app.get('/api/proposta/:id_proposta', function(req, res, next) {

    var results = [];

    var id_proposta = req.params.id_proposta;

    // Get a Postgres client from the connection pool
    pg.connect(database.url, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query(
          "SELECT "+
          "	id_item_proposta "+
          "	, nm_produto "+
          "	, codigo_cotacao "+
          "	, nm_fornecedor "+
          "	, ip.qtd as qtd_proposta "+
          "	, to_char(ip.vlr_unitario,'FM999999999990.00') as vlr_unitario "+
          "	, ip.vlr_total "+
          "	, ip.cod_fabricante "+
          "	, um.descr_red_unid_med "+
          "	, ic.observacao "+
          "	, ic.qtd as qtd_cotacao "+
          "FROM "+
          "	sigh.propostas "+
          " left join sigh.cotacoes on (cod_cotacao = id_cotacao) "+
          " left join sigh.fornecedores on (cod_fornecedor = id_fornecedores) "+
          "	left join sigh.itens_propostas ip on (cod_proposta = id_proposta) "+
          "	left join sigh.itens_cotacoes as ic on (cod_item_cotacao = id_item_cotacao) "+
          "	left join sigh.produtos on (cod_produto = id_produto) "+
          "	left join sigh.unidades_medidas as um on (cod_unid_medida = id_unid_medida) "+
          "where "+
          "	id_proposta = ($1) "
          , [id_proposta]  );

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
            // res.render('proposta',{proposta: results[0], itens_propostas: results});
        });

    });

  });


  app.put('/api/item_proposta/:id_item_proposta', function(req, res) {
    var results = [];
    var id_item_proposta = req.params.id_item_proposta;
    var data = { quantidade: req.body.qtd, valor: req.body.vlr_unitario, fabricante: req.body.cod_fabricante };
    var valor_total = data.quantidade * data.valor;
    console.log(data);
    console.log(valor_total);
    console.log(id_item_proposta);
    pg.connect(database.url, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        client.query("update sigh.itens_propostas set qtd = $1, vlr_unitario = $2, vlr_total = $3, cod_fabricante = $5 where id_item_proposta = $4 ", [data.quantidade, data.valor, valor_total,  id_item_proposta, data.fabricante] );
        var query = client.query("select * from sigh.itens_propostas where id_item_proposta = $1", [id_item_proposta]);
        query.on('row', function(row){
          results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
            // res.redirect('/proposta/' + results[0].cod_proposta);
        });
    });
  });

  app.get('/api/fabricantes', isLoggedIn, function(req, res){
      
      var results = [];
      
      pg.connect(database.url, function(err, client, done){
         if (err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});  
         };
         
         var query = client.query("select * from sigh.fabricantes where ativo");
         
         query.on('row', function(row){
             results.push(row);
         });
         
         query.on('end', function(){
             done();
             return res.json(results);
         });
      });
      
  });
  
  app.get('/api/hospital', function(req, res){
     var results = [];
     
     pg.connect(database.url, function(err, client, done){
         if (err){
             done();
             console.log(err);
             return res.status(500).json({success: false, data: err});
         };
         
         var query = client.query("select * from sigh.hospitais limit 1");
         
         query.on('row', function(row){
             results.push(row);
         });
         
         query.on('end', function(){
             done();
             return res.json(results);
         });
     }) 
  });

  app.get('/login2', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });
  
  app.get('/user/logout', function(req, res) {
      req.logout();
    //   res.status(200).json({
    //         status: 'Bye!'
    //     });
      res.redirect('/user/login');
  });

//   app.post('/user/login', passport.authenticate('local-login', {
//       succ
//       successRedirect : '/', // redirect to the secure profile section
//       failureRedirect : '/login', // redirect back to the signup page if there is an error
//       failureFlash : true // allow flash messages
//   }));

    app.get('/user/status', function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(200).json({
            status: false
            });
        }
        res.status(200).json({
            status: true , user: req.user 
        });
    });

    app.post('/user/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info){
            if (err){
                return next(err);
            }
            if(!user){
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err){
                if(err){
                    return res.status(500).json({
                        err: 'could not'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!' 
                });
            });
        })(req, res, next);
    });

  app.get('/*', function(req, res){
    // res.render('index.ejs', {user : req.user});
    res.render('index.ejs');
  });
  
  

}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/');
}