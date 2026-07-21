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
    click() Postconditions:
    * Player's banana count increases by the click value.
    * Returns the number of bananas earned from that click.
    purchase() Postconditions:
    * Returns a boolean indicating if the purchase was successful.
    * If successful, the item is added to the player's collection and its price is deducted from bananas.
    "
class Upgrade {
<<Interface>>
        -number modifier
        -number price
        +getMultiplier() number
    }
    note for Upgrade "Invariants:
    * modifier >= 1
    * price >= 0
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
        -number price
        -number bananasPerSecond
        +getBps() number
    }
    note for Building "Invariants:
    * price >= 0
    * bananasPerSecond >= 1
    "
class Acuminata {

    }
    note for Acuminata "Grows 5 bananas per second."
class Balbisiana {

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
* Added `Building` interface with `Acuminata`/`Balbisiana` implementations, kept as a separate hierarchy from `Upgrade` rather than a shared parent since buildings and upgrades are different (passive income vs. click modifiers) and are stored in separate tables (`building`/`upgrade`) in the SQL schema, so the domain model mirrors that.
* Added `username`  to `Player` to give each player a distinct identity.
* Added a second `purchase()` overload on `Player` for `Building`, alongside the existing `Upgrade` overload, and generalized the postcondition note to cover both.
