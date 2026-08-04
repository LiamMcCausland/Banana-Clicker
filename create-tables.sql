-- Players
create table if not exists player(
  username varchar(255) not null unique,
  password_hash text not null,
  password_salt text not null,
  bananas integer not null default 0
);

-- Buildings owned by a player (one row per owned instance)
create table if not exists building(
  id serial not null unique,
  name varchar(255) not null,
  description text not null,
  price integer not null,
  bps integer not null, -- bananasPerSecond
  owner varchar(255) not null references player(username)
    on delete cascade
);

-- Upgrades owned by a player
create table if not exists upgrade(
  name varchar(255) not null,
  description text not null,
  price integer not null,
  modifier float not null,
  owner varchar(255) not null references player(username)
    on delete cascade,
  primary key (owner, name)
);

-- All possible upgrades that can be purchased.
create table if not exists purchaseable_upgrades(
  name varchar(255) not null unique,
  description text not null,
  price integer not null,
  modifier float not null
);

insert into purchaseable_upgrades(name, description, price, modifier) values
    ('Double Click', 'Double your bananas per click', 100, 2.0),
    ('Triple Click', 'Triple your bananas per click', 500, 3.0),
    ('Quadruple Click', 'Quadruple your bananas per click', 1000, 4.0),
    ('Quintuple Click', 'Quintuple your bananas per click', 5000, 5.0),
    ('Sextuple Click', 'Sextuple your bananas per click', 10000, 6.0),
    ('Septuple Click', 'Septuple your bananas per click', 50000, 7.0),
    ('Octuple Click', 'Octuple your bananas per click', 100000, 8.0),
    ('Nonuple Click', 'Nonuple your bananas per click', 500000, 9.0),
    ('Decuple Click', 'Decuple your bananas per click', 1000000, 10.0);

-- All possible buildings that can be purchased.
create table if not exists purchaseable_buildings(
  name varchar(255) not null unique,
  description text not null,
  price integer not null,
  bps integer not null
);

insert into purchaseable_buildings(name, description, price, bps) values
    ('Acuminata', 'A sturdy banana tree', 100, 1),
    ('Balbisiana', 'A banana tree with a unique shape', 500, 5),
    ('Cavendish', 'A popular banana tree', 1000, 10),
    ('Dwarf Brazilian', 'A small but productive banana tree', 5000, 50),
    ('Gros Michel', 'A classic banana tree', 10000, 100),
    ('Lady Finger', 'A sweet and small banana tree', 50000, 500),
    ('Red Banana', 'A red-skinned banana tree', 100000, 1000),
    ('Blue Java', 'A blue-skinned banana tree', 500000, 5000),
    ('Goldfinger', 'A golden-skinned banana tree', 1000000, 10000);
