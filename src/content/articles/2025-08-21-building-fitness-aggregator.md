---
title: "From World Computer to Guarantee Machine"
urlSlug: building-fitness-aggregator
published: 2025-08-26
summary: "Part one of a three-part series illustrating why we need domains—taking the developer's point of view to show where blockchains fundamentally fall short."
---

## Pt. I: Building a fitness aggregator

*This is the first section of a three‑part series on why we need domains.* 

- *Pt. I: a developer’s view of where blockchains are the wrong tool.*
- *Pt. II: the conceptual shift that separates "the computer" from "the guarantee machine."*
- *Pt. III: what the app looks like as a domain.*

You want to build a real-time fitness aggregator. Starting out with a simple Python script, you create a fresh virtual environment with your preferred cloud provider and start pulling wearable-sensor data out of thin air. Oura's API exposes yesterday's heart rate curve; Garmin Connect streams workout data while you run; Hevy's webhook fires the moment a friend hits a 1RM. One by one these feeds pour into an asyncio loop for event-driven data processing.

After just a few minutes of coding, your app is **listening**. Not polling, not batch-importing, but genuinely *breathing* alongside the sensors. A tiny in-memory buffer holds the last five thousand inter-beat intervals, and a basic scikit-learn model whispers a VO₂-max estimate every time the buffer rolls over. When the algorithm suspects over-training, a Slack bot DMs you "take a rest day." While that runs, another coroutine grabs weather forecasts so the afternoon tempo run can be mapped to a cooler route.

You tweak, redeploy, observe. A firmware update drops; you patch a parser, `git push`, and your CI restarts the $5 VPS. Metrics flow into Prometheus—packet loss, inference latency, an HRV histogram—Grafana renders panels you glance at between sets.

### Enter: Verifiable guarantees

After a few weeks you notice something: the app isn't just logging workouts—it's creating **stakes**. Leaderboards, friendly wagers, bragging rights—things people care about.

**Rule of thumb:** If an output decides something valuable and the people affected can't—or won't—just trust a single party, you need a **guarantee machine**. Value can be money, rank, access, or even just the right to talk trash without being called a liar.

And then it clicks: you could make this way more interesting if the output actually **decided something valuable**.

Maybe you spin up a week‑long challenge with a prize pool (or winner donates to charity). Now "fastest 5K" isn't just a number; it's a trigger for a payout. If someone's going to walk away with the pot, no one should be arguing screenshots.

So you look at blockchains. They're good at **guarantees**: preventing unauthorized state transitions, making outcomes final, auditable, and tamper‑resistant.

### The capability mismatch

Unfortunately, you immediately realize that transitioning your app to run on a blockchain is impossible. Your simple hobby app, which you have hacked together over the course of a few evenings, could never live as a smart contract on a blockchain. Here's why:

| Capability  | How the App Uses It | Why a Blockchain Can't Follow |
| --- | --- | --- |
| **Continuous external streams** | Wearables drip heart-rate packets every few seconds straight into an event loop. | Onchain code can't open sockets or subscribe to feeds; it waits for an oracle to deliver stale, batched data. |
| **Event-driven updates** | Each new packet triggers an immediate VO₂-max update or "take a rest day" alert—no user click required. | A smart contract mutates state only when someone pushes a signed transaction. "Just listen and act" is off-limits. |
| **Side-effect autonomy** | The bot pings Slack, syncs to Google Fit, and writes to a private db the moment thresholds are crossed | Contracts can't send webhooks or call external APIs; every outward action must be staged offchain. |
| **Real-time randomness** | Nightly hyper-parameter sweeps pick fresh model settings with `numpy.random.uniform`. | Determinism forbids RNG; you'd need an expensive oracle just to roll a die. |
| **Hot-patch redeploys** | Edit one formula, `git push`, and GitHub Actions restarts the VPS instantly | Upgrading a contract involves expensive audits, proxy gymnastics, governance, and gas—measured in hours and fees, not minutes and free. |
| **Rich local tooling** | Jupyter notebooks, TensorBoard, and a live Python debugger tune models on the fly | On-chain "debugging" means sifting through immutable logs after multi-minute finality—no breakpoints, no notebooks. |
| **Non-trivial program size** | NumPy/Pandas/ML models measured in MBs/GBs. | Storing and executing these programs is beyond infeasible |
| **Authenticated inputs** | All the sensor measurements must be verified | Inputs can only be provided via oracles |
| **Live observability** | Prometheus tallies packet loss, Grafana charts HRV in real time | You'd need a separate indexer to scrape on-chain events, inevitably a step behind the ledger |
| **Private state** | A RAM ring-buffer stores 5 000 recent beat-to-beat intervals for sub-millisecond inference. | Ledger storage is slow, public, and every update is paid for in gas |
| **File-system & cloud bursts** | Bulk-export a month of workouts to S3, back-fill analytics, delete the temp file—routine ops. | Smart contracts can't read or write files; they live inside a hermetic sandbox with no disk. |
| **Clock & timezone freedom** | The code calls `datetime.now()` to align workouts with sunset or jetlag schedules. | Onchain time is the block timestamp, set by validators; not the real world. |

In fact, every time you try to make the app onchain, you end up pushing most of the work back offchain to oracles, keeper networks, and other offchain service providers.

### Fundamental limitations

It's not about TPS or block times, it's not about optimizing blockchains. It's about **role**. Computers create and transform state; guarantee machines prevent bad state transitions. 

Look at the current state of blockchain applications. We can cling onto the Clayton Christensen quote that all revolutionary innovations initially look like toys. Maybe it's even ok that they look just as toy-like as they did five years ago, billions of dollars and work hours later…

But the reality is that any product idea which was not explicitly designed for the extreme limitations of blockchains, is inherently impossible to ever realize as a blockchain application. A fundamentally new approach is needed.
