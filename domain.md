---
title: Domain model for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Domain model

```mermaid
classDiagram
class Player{
        -string username
        -string password
        -number bananas
        -List~Upgrade~ upgrades
        -List~Building~ buildings
        +click() number bananas
        +purchase(Upgrade upgrade) boolean success
        +purchase(Building building) boolean success
    }
    note for Player "Invariants:
    * username is not empty
    * bananas >= 0
    * upgrades exists and may be empty
    * upgrades contains no null elements
    * upgrades contains no duplicate upgrade types
    * buildings exists and may be empty
    * buildings holds each instance of the buildings (i.e 3 instances = 3 owned)
    * each object in buildings are unique
    click() Postconditions:
    * Player's banana count increases by the click value.
    * Returns the number of bananas earned from that click.
    purchase() Postconditions:
    * Returns a boolean indicating if the purchase was successful.
    * If successful, the item is added to the player's collection and its price is deducted from bananas.
    "
class Upgrade {
<<Interface>>
        -string name
        -string description
        -number modifier
        -number price
        +getMultiplier() number
    }
    note for Upgrade "Invariants:
    * modifier >= 1
    * price >= 0
    * name not empty
    * desc not empty
    "
class DoubleClickUpgrade {
        +getMultiplier() number
    }
    note for DoubleClickUpgrade "Multiplies all clicks on the banana by 2"
class TripleClickUpgrade {
        +getMultiplier() number
    }
    note for TripleClickUpgrade "Multiplies all clicks on the banana by 3"

class Building {
<<Interface>>
        -string name
        -string description
        -number price
        -number bananasPerSecond
        +getBps() number
    }
    note for Building "Invariants:
    * price >= 0
    * bananasPerSecond >= 1
    * name not empty
    * desc not empty
    "
class Acuminata {
      +getBps() number
    }
    note for Acuminata "Grows 5 bananas per second."
class Balbisiana {

      +getBps() number
    }
    note for Balbisiana "Grows 10 bananas per second."

    Upgrade <|-- DoubleClickUpgrade
    Upgrade <|-- TripleClickUpgrade
    Building <|-- Acuminata
    Building <|-- Balbisiana
    Player --o Upgrade
    Player --o Building
```

# Changes made

* Removed store object (YAGNI)
* Changed upgrades to inherit the upgrade type instead of being an enum.
* Since store is gone player now does the purchase behaviour.
* Added `Building` interface with `Acuminata`/`Balbisiana` implementations, kept as a separate hierarchy from `Upgrade` rather than a shared parent since buildings and upgrades are different (passive income vs. click modifiers).
* Added `username`  to `Player` to give each player a distinct identity.
* Added a second `purchase()` overload on `Player` for `Building`.
