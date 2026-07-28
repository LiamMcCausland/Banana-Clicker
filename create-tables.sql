-- Players
create table if not exists player(
  username varchar(255) not null unique,
  password varchar(255) not null,
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
