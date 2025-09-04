---
title: "From World Computer to Guarantee Machine: Part III"
urlSlug: how-to-build-app-blockchains-cant-handle
published: 2025-09-04
summary: "Part three of a three-part series demonstrating how to build the fitness aggregator as a domain—keeping the app where it thrives while making claims verifiable."
---

## How to Build an App Blockchains Can't Handle

*This is the third section of a three‑part series on why we need domains.*

- *Pt. I: a developer's view of where blockchains are the wrong tool.*
- *Pt. II: the conceptual shift that separates "the computer" from "the guarantee machine."*
- *Pt. III: what the app looks like as a domain.*

In Pt. I, you were a hobby dev shipping a verifiable fitness aggregator. You wanted friends and rivals to trust your claimed VO₂ max and related stats. You tried a blockchain and hit a wall—not edge cases, but basic developer needs:

- **Continuous external streams**
- **Event-driven updates**
- **Side-effect autonomy**
- **Real-time randomness**
- **Hot-patch redeploys**
- **Rich local tooling**
- **Live observability**
- **Private state**
- **File-system & cloud bursts**
- **Clock & timezone freedom**
- **Non-trivial program size**

In Pt. II we explained why: blockchains are **guarantee machines** that enforce constraints through replicated, deterministic execution. Programmability didn't remove the walls; it codified them. Chasing "better computers" on chain is the wrong axis. The value is what chains **prevent**, not what they **compute**.

With delta, verifiability can be achieved without resorting to a bad computer. Keep your app on ordinary infra and export only the **claims** others must trust—under explicit rules that can be verified.

### Building a verifiable fitness aggregator app

Instead of rebuilding your app inside a chain, you attach a [**domain**](https://spjoleh.com/articles/what-is-a-domain/) to it: a thin adapter plus a set of **local laws**. You publish claims to a shared state network (**delta**) that enforces **global laws**.

**How it looks for the fitness app**

1. **(Pick state to share)** You first choose which parts of the app's state to keep on delta. In this case, you only care about the VO₂ max estimate so you just design a thin adapter to post this data to delta at a certain frequency.
2. **(Specify guarantees)** The VO₂ max estimate will be driven by an event within the app, e.g. the daily estimate based on factors such as the heart rate and activity data of that day. You write a Rust program to prove that the estimate was based on authenticated data and a recognized formula. 
3. **(Publish)** Deploy the domain with the stated guarantee to delta; validity will now be checked automatically.

That's it. Your app keeps its streams, models, sockets, files, redeploys, and monitoring. Only the narrow, explicit **guarantee surface** goes on the network.

> Principle: Run the app where it thrives. Publish only what others must be able to verify.
> 

Note that a more complex system would likely share multiple types of data with different event triggers (e.g. based on user transactions), and write a variety of local laws to provide various guarantees. In many cases, the adapter will also both read data from delta and write to it, whilst our fitness app only does the latter.

### What changes (and what doesn't)

<div class="table-wrapper">

| Capability  | How the App Uses It | post-delta |
| --- | --- | --- |
| **Continuous external streams** | Wearables feed heart-rate packets every few seconds straight into an event loop. | Unchanged. Streams drive your app; you publish summarized claims. |
| **Event-driven updates** | Each packet can update VO₂ or trigger a "rest day" alert. | You don't need to post every micro‑update—just the committed daily claim. |
| **Side-effect autonomy** | The bot pings Slack, syncs to Google Fit, and writes to a private db the moment thresholds are crossed | All of this happens outside of delta. No special middleware required. |
| **Real-time randomness** | Nightly hyper-parameter sweeps pick fresh model settings with `numpy.random.uniform`. | Keep it. If needed, cite a signed randomness beacon (e.g., signed by [random.org](http://random.org)) inside your local laws. |
| **Hot-patch redeploys** | Edit one formula, `git push`, restart the VPS | Updates to the core app live outside of delta and work just as before |
| **Rich local tooling** | Jupyter notebooks, TensorBoard, and a live Python debugger tune models on the fly | All the same tools can be used in exactly the same way |
| **Live observability** | Prometheus tallies packet loss, Grafana charts HRV in real time | No need for blockchain middleware such as indexers; use Prometheus and Grafana directly as before |
| **Private state** | A RAM ring-buffer stores 5 000 recent beat-to-beat intervals for sub-millisecond inference. | This state is still private |
| **File-system & cloud bursts** | Bulk-export a month of workouts to S3, back-fill analytics, delete the temp file—routine ops. | Happens outside of delta |
| **Clock & timezone freedom** | The code calls `datetime.now()` to align workouts with sunset or jetlag schedules. | No issue here |
| **Non-trivial program size** | Models and libraries are large. | Irrelevant. delta cost scales with local‑law complexity, not app size. |

</div>

### Conclusion: The future is negative

Most of tech focuses on expansion, on enabling new functionalities. Insane demos from generative AI companies like Lovable hit our feeds on the daily. But verifiable systems are not like AI. They are about scarcity. Ironically, by following tech's example and trying to inject our blockchains with abundance, we are locking ourselves in place.

Verifiable compute's purpose is to **constrain**. Trying to make blockchains act like full computers locks ordinary software out. The leverage is in **verifiability**, not throughput or VM features. Domains narrow the surface to just the rules others rely on and publish those to shared state. Everything else remains a normal program.

You've always been able to write software that defines and manipulates assets. With domains and delta, you can now do it **credibly**, across the open internet—without putting your app in a straightjacket.

### Bonus: Example Spec for Fitness Aggregator Local Laws

**Local Law: `vo2_daily_v1`**

- **Inputs**
    - Device stream: signed HR + activity packets from registered device IDs.
    - Coverage window: `[00:00, 24:00)` local time with ≤ N short gaps (each ≤ G seconds).
    - Model spec: `F_v`.
- **Preconditions**
    - `device.pubkey` bound to `user`.
    - Packet timestamps monotonic and within `[D, D+1day)`.
    - Signatures valid for all packets used.
- **Invariant**
    - `VO2_D = F_v(packets, params)` for some specific `F_v` .
- **Postconditions**
    - `10 ≤ VO2_D ≤ 90`.
    - Output carries `(user, date)`.
