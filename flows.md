---
title: Flows of interaction for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Flows of interaction

This flows of interaction represents the main page of the game. Its assumed that the user can see all the buttons present on the page and that flows in this diagram do *not* represent transitions to a new page of the website.

Its also assumed that the game does not have a *end* or *exit* function at any point and that simply closing the webpage is the way of exiting the game.

**Banana Click Flow:**

```mermaid
flowchart TB
    subgraph Banana Click Flow
        direction TB
        getAction1[[Choose Action]]
        incrementBanana{Process Click}
        clickEnd[[Banana Count Updated]]

        getAction1 -- Banana GUI clicked --> incrementBanana
        incrementBanana -. bananas incremented .-> clickEnd
    end
```

**Upgrade Purchase Flow:**

```mermaid
    flowchart TB
    subgraph Upgrade Purchase Flow
        direction TB
        getAction2[[Choose Action]]
        purchaseU{Attempt Purchase}
        purchaseSuccess[[Upgrade Purchased]]

        getAction2 -- Desired upgrade clicked --> purchaseU
        purchaseU -. Not enough bananas, click for more! .-> getAction2
        purchaseU -. Upgrade already purchased, choose another .-> getAction2
        purchaseU -. Sufficient bananas .-> purchaseSuccess
    end
```
# Changes

* Seperate flows into two diagrams.
  * one for the purchase and one for clicking

