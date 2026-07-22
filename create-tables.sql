create table if not exists player (
    username varchar(255) primary key,
    password varchar(255) not null,
    bananas integer not null default 0,
    last_login timestamp default current_timestamp
);

-- Table that holds all possible building types
create table if not exists building (
    name varchar(255) primary key,
    description text not null,
    price integer not null,
    bps integer not null -- bananasPerSecond
);

-- Table for all possible upgrade types
create table if not exists upgrade (
    name varchar(255) primary key,
    description text not null,
    price integer not null,
    modifier float not null
);

-- Tables for player ownership of buildings and upgrades:
create table if not exists player_building (
    player varchar(255) not null references player(username),
    building varchar(255) not null references building(name),
    quantity integer not null default 0,
    primary key (player, building)
);

create table if not exists player_upgrade (
    player varchar(255) not null references player(username),
    upgrade varchar(255) not null references upgrade(name),
    primary key (player, upgrade)
);
