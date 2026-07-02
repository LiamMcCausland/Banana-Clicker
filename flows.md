---
title: Flows of interaction for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Flows of interaction

```mermaid
flowchart 
    subgraph Game Flow 
        direction TB
        gameStart[[Game Start]]
        getAction[Wait for action]
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
