---
title: What is a domain
published: 2025-08-14
summary: "A domain is an open‑world verifiable system: non‑deterministic, event‑driven, and integrable."
---
A domain is an *open-world verifiable system*. We use *open-world* as an umbrella term which encompasses some of the core differentiating properties from other verifiable systems such as blockchains. Domains are:

- **Non-deterministic:** Domains can rely on file I/O, use any API, human-in-the-loop, syscalls, true randomness etc.
- **Event-driven:** Domains can trigger verifiable state changes based on arbitrary events, such as sensor readings, an API output, or clock time; not just user transactions.
- **Integrable:** Domains can integrate with any external system and use its private state.

Domains live on the boundary between a shared state machine (in our case delta) and the outside world, and have access to computational resources from both:

- They can use the regular internet, local storage, a GPU cluster, and so on;
- They use delta’s bandwidth, proof verification, and deterministic settlement infrastructure.

### Verifiability

A domain is a verifiable system just as a blockchain is, but it’s a different form of verifiability:

- Blockchains are *process-verifiable*: The entire execution path is verifiable;
- A domain is *outcome-verifiable*: For any outcome (state change) settled to delta, the domain must prove certain properties, but not the full execution. Beyond that, domains can be bound to prove that arbitrary constraints hold for their results.

In particular, since execution itself is not verifiable on a domain, there is no need for resource metering via gas fees. A domain can run arbitrarily complex code without increasing the cost of verifiability.

### Example: An AI Domain

Incorporating even a tiny regression model into a smart contract on a blockchain is prohibitively expensive. A domain could run Llama 405B with no problem. Let’s say you wanted to use an AI as an asset exchange, where users send it requests of the form “I have 100 $AAPL and want $ETH”. This is an application which could very easily live as a domain, in delta's case using the global assets that live on delta.

Additionally, the domain could add guard rails: We should expect people to try to attack the AI via prompt injection. The domain could use standard price feeds and execute a given trade only if the ratio falls within some margin of the actual prices.

### What is delta[^1]

delta is a permissionless network of domains with shared state:

- **Permissionless:** Anyone can deploy a domain, issue an asset, or join as a user;
- **Shared state:** The domains all share state. Assets are global, there is no bridging, and users can move easily between domains, as they could move between smart contracts on the same blockchain.

This highlights another important difference between blockchains and domains: Blockchains are *self-contained* state machines, whereas domains participate in shared state, with access to an existing pool of users, assets, and other domains.

### Conclusion

Domains are a new kind of verifiable systems, with different properties than blockchains. They remove the resource and capability constraints of blockchains while retaining verifiability. They also simplify distribution and interoperability. And they allow companies to ignore all blockchain-related quirks and build modern systems that are positively indistinguishable from Web2 while retaining the guarantees of Web3.

[^1]: Since most applications made possible by domains could not live on a blockchain or any other verifiable system, I expect other domain infrastructure than delta to pop up over time. For example, a permissioned version of delta would make sense for multi-opco companies looking to minimize audit costs and reconcile their internal ledgers.