---
title: Flows of interaction for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Flows of interaction

This flows of interaction represents the main page of the game. Its assumed that the user can see all the buttons present on the page and that flows in this diagram do *not* represent transitions to a new page of the website.

Its also assumed that the game does not have a *end* or *exit* function at any point and that simply closing the webpage is the way of exiting the game.

```mermaid
flowchart 
    subgraph Game Flow 
        direction TB
        gameStart[[Game Start]]
        getAction[User action]
        incrementBanana{Check upgrades and increment Bananas}
        purchaseU{Check Purchase}

        gameStart --> getAction

        %% Banana Logic
        getAction -- Banana GUI clicked --> incrementBanana
        incrementBanana -. bananas incremented .-> getAction

        %% Shop Logic
        getAction -- Desired upgrade clicked --> purchaseU
        purchaseU -. Not enough bananas, click for more! .-> getAction
        purchaseU -. Upgrade applied successfully  .-> getAction
end
```
