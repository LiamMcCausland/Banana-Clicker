create table if not exists upgrade (
    id serial primary key,
    name varchar(255) not null,
    price integer not null,
    modifier float not null
);

create table if not exists building (
    id serial primary key,
    name varchar(255) not null,
    price integer not null,
    click_rate integer not null
);

create table if not exists users (
    id serial primary key,
    username varchar(255) not null unique,
    password varchar(255) not null,
    bananas integer not null default 0,
    created_at timestamp not null default current_timestamp
);

create table if not exists user_upgrades (
    user_id integer not null references users(id) on delete cascade,
    upgrade_id integer not null references upgrade(id) on delete cascade,
    purchased_at timestamp not null default current_timestamp,
    primary key (user_id, upgrade_id)
);

create table if not exists user_sessions (
    session_id varchar(255) primary key,
    user_id integer not null references users(id) on delete cascade,
);
