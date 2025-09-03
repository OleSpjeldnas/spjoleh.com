---
title: "From World Computer to Guarantee Machine: Part II"
urlSlug: stop-treating-blockchains-like-computers
published: 2025-09-03
summary: "Part two of a three-part series exploring the conceptual shift that separates 'the computer' from 'the guarantee machine' and introduces the domain model."
---

## Pt. II: Stop Treating Blockchains Like Computers

*This is the second section of a three‑part series on why we need domains.*

- *Pt. I: a developer's view of where blockchains are the wrong tool.*
- *Pt. II: the conceptual shift that separates "the computer" from "the guarantee machine."*
- *Pt. III: what the app looks like as a domain.*

The term *blockchain application* is at the heart of what's wrong with the current paradigm of smart contract-based verifiable compute. It suggests you should run your app on a blockchain. In reality, blockchains are bad computers and great **guarantee machines**. Their value lies not in what they *do* but in what they *prevent*.

- **Computer**: Where your business logic runs—streams, models, files, side‑effects, everything ergonomic and fast.
- **Guarantee machine**: A system whose sole job is to prevent bad state transitions and make the outcomes verifiable. Think "constrained, explicit surfaces," not general compute.

The mistake is to ask the guarantee machine to impersonate the computer. Instead, we should export only *claims we want others to trust* and prove those claims satisfy explicit rules.

In the following, we will explore how we can create a verifiable system which separates the computer from the verifiable system. That is, we will free the computer from all of the constraints a blockchain-like system presents, and instead add explicit guarantees directly.

### Shrinking the guarantee surface

In the fitness aggregator from Pt. I, we didn't need a blockchain to *build* features. We needed it to make one narrow claim **credible to others**: "for user X, on day D, **VO₂ max = 65**." 

**In general, all code can be split up into functional requirements (positive) and anti-requirements (negative)**. 

A helpful way to scope what belongs on a guarantee machine is to split the codebase:

- **Functional (positive) code:** the stuff that creates value—streams, models, Slack messages, exports, dashboards.
- **Negative code:** logic that prevents bad outcomes. This further splits into:
    - **Handling:** retries, idempotency, backfills, pagination, rate‑limits—everything for unhappy paths.
    - **Guarantees:** explicit correctness conditions that counterparties care about.

For the fitness app, examples of relevant guarantees look like:

- **Preconditions** (inputs are acceptable): *wearable messages are authentic, device is bound to the user, timestamps are sane*.
- **Postconditions** (outputs are sane): `*10 ≤ VO₂ max ≤ 90*`.
- **Invariants** (how outputs are derived): *VO₂ is computed by spec `F_v`*.

**Principle:** a guarantee machine should execute **neither** the functional code **nor** the handling code—and usually **not most** guarantees either. It should verify only the **minimal** set of guarantees that counterparties require, made **explicit** and **versioned**.

Applied here: we might publish a guarantee for **cardio** (VO₂ max, fastest 5K) and publish **nothing** about **strength** (best lifts). Lifting stays outside the guarantee surface; bragging rights over cardiovascular fitness do not.

### From blockchain to rollup to domain: Freeing the computer from the guarantee machine

Historically, programmable blockchains enforced guarantees via **replicated execution**: every validator re‑runs the same code. That yields determinism and safety, but at the cost of capability (no sockets, no wall clocks, no large models) and speed.

Recent years have seen a new flavor of blockchains emerge, in the form of rollups. Rollups changed *how* we get assurances (cryptographic proofs instead of re‑execution) but not *what* we ask the assurance layer to do: they still assume a **deterministic computer** proving full execution. The same constraints remain.

The way out is to narrow the role of the cryptographic computer:

> Run only the guarantees you want to expose in the cryptographic computer; run everything else on an ordinary computer.
> 

That's one half of a **domain**: take your existing system and attach **local laws** that specify the guarantees you're publishing about its outputs.

The other half is **shared state**. Networks like **delta** let domains publish these guaranteed outputs to a common ledger, under a uniform set of **global laws**. This gives:

- permissionless deployment,
- inter‑domain composability (others can build on your claims, you get a shared economy),
- a single source of truth with consistent security properties.

**Examples:**

- **Global laws** (network‑wide, always on):
    - **Authorization & attribution:** only *you* can publish a claim for your account (your key signs it).
    - **Anti‑replay & ordering:** claims have nonces, are ordered, and finalize (no double‑publishing "today's" result).
    - **Versioning:** claims carry the version of the rules they followed (so consumers can whitelist versions).
- **Local laws** (program‑specific, you choose them):
    
    For our app, these are exactly the constraints your friends (or a wager app) need before they'll pay or rank you. Examples:
    
    - Inputs came from your registered devices and are vendor‑authenticated.
    - The sensor window covers the whole day (or the whole run) with small, bounded gaps.
    - VO₂ was computed with a named formula/model version.

### From World Computer to Guarantee Machine

The last decade tried to make blockchains bigger computers: more throughput, more features, more VM. But a blockchain's advantage isn't what it *does*; it's what it *refuses to let happen*. Its value is **negative**: preventing unauthorized or contradictory state transitions and making the acceptable ones final and attributable. That's the job of a **guarantee machine**, not an application runtime.

**delta** embraces this directly. It's a network of **domains**—each domain = your existing system (**the computer**) + a narrow, cryptographically verified surface (**the guarantee machine**). The computer keeps its sockets, files, models, and fast deploys. The guarantee machine enforces only the minimal, explicit rules you want others to rely on.

Think of delta less as a "world computer" and more as a **shared USB hub**. Any system can plug in with a lightweight adapter to publish *just* the state it wants to share (e.g., "VO₂ max = 65 for 2025‑08‑24"), while keeping the rest private (raw beat‑to‑beat intervals, strength logs). The hub enforces a uniform set of **global laws** (authorization, ordering, replay protection, versioning) alongside each domain's **local laws** (e.g., authenticated device data, coverage windows, pinned computation spec). The result is composable, credible shared state—without dragging your whole app into replicated, deterministic execution.

Next, we'll build the fitness aggregator as a domain on delta: the thin adapter, the local‑law specs for VO₂ and fastest‑5K, and how other apps consume those claims for payouts and rankings.
