---
title: Flows of interaction for my clicker project!
author: Liam McCausland (mccausll@myumanitoba.ca)
date: Summer 2026
---

# Flows of interaction

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

**Upgrade/Building Purchase Flow:**

```mermaid
    flowchart TB
    subgraph Upgrade and Building Purchase Flow
        direction TB
        getAction2[[Choose Action]]
        purchaseU{Attempt Purchase}
        purchaseSuccess[[Item Purchased]]

        getAction2 -- Desired upgrade/building clicked --> purchaseU
        purchaseU -. Not enough bananas, click for more! .-> getAction2
        purchaseU -. Item has already been purchased, choose another .-> getAction2
        purchaseU -. Sufficient bananas .-> purchaseSuccess
    end

```
**Account Flow**:

```mermaid
flowchart TB
subgraph Account Flow
direction TB
        getAction3[[Choose Action]]
        checkAccount{Check Credentials}
        createAccount{Create Account}
        signedIn[[Signed In]]

        getAction3 -- Sign in clicked --> checkAccount
        checkAccount -. Invalid username or password .-> getAction3
        checkAccount -. Valid credentials .-> signedIn

        getAction3 -- Create account clicked --> createAccount
        createAccount -. Username already taken .-> getAction3
        createAccount -. Account created .-> signedIn
end
```

# Changes

* Seperate flows into two diagrams.
  * one for the purchase and one for clicking
* Added account flow to demonstrate the flows of interaction for creating an account and signing in.
* updated purchase flow to include buildings (essentially the exact same flow)

