create table cotacoes
(
	id_cotacao serial not null
	, codigo_cotacao varchar
	, constraint cotacoes_id_cotacao_pk primary key (id_cotacao)
)

create table propostas
(
	id_proposta serial not null
	, codigo_proposta varchar
	, descr_proposta varchar
	, cod_cotacao integer
	, constraint propostas_id_proposta_pk primary key (id_proposta)
	, constraint propostas_cod_cotacao_fk foreign key (cod_cotacao)
	references cotacoes (id_cotacao) match simple
	on update cascade on delete cascade
)

create table itens_propostas
(
	id_item_proposta serial not null
	, valor float
	, cod_proposta integer
	, descr_item varchar
	, constraint itens_propostas_id_item_proposta_pk primary key (id_item_proposta)
	, constraint itens_propostas_cod_proposta_fk foreign key (cod_proposta)
	references propostas (id_proposta) match simple
	on update cascade on delete cascade
)