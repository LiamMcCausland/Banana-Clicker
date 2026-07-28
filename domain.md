---
title: Domain model for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---
# Domain model
```mermaid
classDiagram
class Player{
        -~string username
        -string password
        -number bananas
        -List~Upgrade~ upgrades
        -List~Building~ buildings
        +click() number bananas
        +purchase(Upgrade upgrade) boolean success
        +purchase(Building building) boolean success
        +login(username, password) Player
        +register(username, password) Player
    }
    note for Player "Invariants:
    * username is not empty
    * bananas >= 0
    * upgrades exists and may be empty
    * upgrades contains no null elements
    * upgrades contains no duplicate upgrade types
    * buildings exists and may be empty
    click() Postconditions:
    * Player's banana count increases by the click value.
    * Returns the number of bananas earned from that click.
    purchase() Postconditions:
    * Returns a boolean indicating if the purchase was successful.
    * If successful, the item is added to the player's collection and its price is deducted from bananas.
    "
class Upgrade {
        -string name
        -string description
        -number modifier
        -number price
        -Player owner
        +getMultiplier() number
    }
    note for Upgrade "Invariants:
    * modifier >= 1
    * price >= 0
    * name not empty
    * desc not empty
    * owner not empty
    * name's value must be one of the values defined in UpgradeName
    * (owner, name) is unique so a player owns at most one of each upgrade type
    "
class Building {
        -string name
        -string description
        -~number id
        -number price
        -number bps
        -Player owner
        +getBps() number
    }
    note for Building "Invariants:
    * price >= 0
    * bananasPerSecond(bps) >= 1
    * name not empty
    * desc not empty
    * owner not empty
    * name's value must be one of the values defined 
in BuildingName
    "
class UpgradeName {
    <<enumeration>>
    DoubleClick
    TripleClick
}
class BuildingName {
    <<enumeration>>
    Acuminata
    Balbisiana
}

    Player "1" o--* "*" Upgrade
    Player "1" o--* "*" Building
    Upgrade --> UpgradeName
    Building --> BuildingName
```

# Changes made since last submission
* removed specific upgrade and building types since they will be data in the `player` and `building` tables.
* removed interface keyword since upgrades and buildings will be instantiated objects.
* added an enum to simply denote the possible building and upgrade names since their values will be predefined.
* added relationship one to many for player and its upgrades/buildings.
* a building's quantity will now be the number of rows it is added in the table to avoid over complicating the table layout.
* added `owner` to `Upgrade` and `Building` to reflect the foreign key back to `Player`, getting rid of the need for additional tables.
* removed `~` from Building.name since building names are not unique across instances (a player can own multiple buildings of the same type).
