create table if not exists building (
    name varchar(255) primary key,
    description text not null,
    price integer not null,
    click_rate integer not null
);

create table if not exists upgrade (
    name varchar(255) primary key,
    description text not null,
    price integer not null,
    modifier float not null
);

create table if not exists player (
    username varchar(255) primary key,
    password varchar(255) not null,
    bananas integer not null default 0
);

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

create table if not exists player_session (
    session_id varchar(255) primary key,
    player varchar(255) not null references player(username),
    expires_at timestamp not null
);
