---
title: Domain model for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Domain model

```mermaid
classDiagram

    class Player{
        -number bananas
        -List~Upgrade~ upgrades

        +click() number bananas
    }

    note for Player "Invariants:
    * bananas >= 0
    * upgrades exists and may be empty
    * upgrades contains no null elements
    * upgrades contains no duplicate UpgradeTypes
    click() Postconditions:
    * Player's banana count increases by the click value.
    * Returns the number of bananas earned from that click.
"

    class Store{
        -List~Upgrade~ shopItems
        +purchase(Player, Upgrade) boolean success
    }

    note for Store "Invariants:
    * shopItems exists by may be empty (all items bought)
    * shopItems contains no null elements
    purchase() Postconditions:
    * purchase() returns a boolean indicating if the item was purchased successfuly.
    "

    class Upgrade {
        -UpgradeType type 
        -number modifier
        -number price
    }

    note for Upgrade "Invariants:
    * type is not null
    * modifier >= 1
    * price >= 0
    "

    class UpgradeType {
        <<enumeration>>
        DOUBLE_CLICK
        TRIPLE_CLICK
    }

    note for UpgradeType "Upgrade Types:
    * DOUBLE_CLICK: multiplies all clicks on the banana by 2
    * TRIPLE_CLICK: multiplies all clicks on the banana by 3
    "

    Upgrade --> UpgradeType
    Store --o Upgrade
    Player --o Upgrade
```

