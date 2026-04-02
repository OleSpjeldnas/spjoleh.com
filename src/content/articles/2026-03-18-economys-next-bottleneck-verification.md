---
title: "The Economy's Next Bottleneck Is Verification"
urlSlug: economys-next-bottleneck-verification
published: 2026-03-18
summary: "As AI agents automate execution, verification becomes the new economic bottleneck. The path to scaling the economy runs through making verification machine-checkable."
---

**As AI agents automate execution, the core challenge to scaling the economy becomes automating verification.**

The recent paper ["Some Simple Economics of AGI"](https://arxiv.org/pdf/2602.20946) by Catalini et al. is based on a premise that many are already seeing: while agents can execute more and more tasks, humans are still needed to verify that the task was done correctly.

Catalini and his coauthors describe the consequences of the shift toward an economy in which the role of the human goes from being primarily to execute tasks, to one in which agents do all execution.

Their point is blunt: automate verification where you can, or you get stuck with a bad choice: either productivity caps at human review capacity, or you ship unverified actions, and you end up with compounding systems operating outside your rules.

Put differently:

> If execution scales faster than verification, verification becomes the limiting factor on real productivity.
>

### Autonomous math research = AI + Lean. The autonomous economy = AI + ?

Over the past few months, we have started to see early glimpses of a world where mathematics research is largely carried out by AI. Agentic math needs two ingredients: capable models, and cheap verification. Even if the model can write proofs, humans still have to certify them. Proof review is slow, expert labor, and it's easy to write something that *looks* valid. Even with intelligent models, human review time becomes the bottleneck.

So the second ingredient is Lean. In Lean, a proof is executable: it either type-checks or it doesn't. The proof is verifiable.

With verifiable proofs, the human bottleneck of verification is removed. Lean shows what happens *when verification is mechanized*. Recently, the math agent Gauss by Math, Inc. wrote a 200k LOC Lean proof of the 2022 Fields Medal theorems on sphere packing (see [here](https://www.math.inc/sphere-packing)). Imagine verifying a proof of that size manually. Instead, with Lean, the proof was automatically verified by running the code.

Most work doesn't have a Lean—so as execution gets cheap, verification becomes the bottleneck.

In human organizations, execution is the bottleneck. As AI drives execution cost toward zero, verification becomes the bottleneck. Human time is scarce. Unless we speed up verification, that's where the time goes.

The economic ceiling on agents is verification. Verifiability raises it.

> Only when verification is cheap can we safely scale execution.
>

### Internal vs External Verifiability

The verification bottleneck shows up in two forms:

- **Internal (correctness):** can we mechanically check the output against a spec?
- **External (integrity):** can a third party mechanically check our claims?

They guarantee different things. Here's the split:

| **Dimension** | **Internal Verifiability** | **External Verifiability** |
| --- | --- | --- |
| Core property | Correctness | Integrity |
| Protects against | Bugs, logical errors | Fraud, misrepresentation, breach |
| Threat model | Non-adversarial | Adversarial |
| Primary toolbox | Formal methods | Cryptography |

Internal verifiability speeds things up *inside* a trust boundary. External verifiability lets you do the same *across* one.

Put simply:

> Internal verifiability lets the agent work faster; External verifiability lets the economy move faster.
>

Today, most agents operate inside trust boundaries. In practice, that means internal verification dominates—look at coding. The best agent-aided programmers currently spend the majority of their time performing code reviews for their agents. Make more of the work machine-checkable and reviews collapse to edge cases. For example, if the agent writes Rust, the compiler will help the human out by giving detailed error messages to the agent.

Longer-term, expect coding agents to produce formal proofs in languages such as Coq or Lean along with the code itself. This saves human time (scarce) at the cost of agent time/compute (abundant).

Internal verifiability is about making teams faster inside one system. But the real scaling wall is when agents start acting **between** systems—where incentives don't align and trust boundaries matter.

## External verifiability

> External verifiability means receipts: a third party can check your claims without trusting you.
>

At machine speed, 'trust me' doesn't scale. We need verifiable receipts.

Imagine an AI agent that can execute a company's back office: paying invoices, onboarding vendors, issuing refunds, negotiating terms. Execution becomes cheap. What doesn't become cheap is the verification work around it: "Is this counterparty legitimate?", "Does this payment violate policy?", "Can we prove we followed AML rules?", "Who approved this exception?" If the transaction volume goes up 100×, we can't scale verification by hiring 100× more reviewers.

In practice you need a checklist you can verify later: who acted, under what authorization, on what inputs, under what policy.

In practice, a "receipt" might look like:

- a signed statement that *policy P* was evaluated against *inputs X* at time *T*
- a tamper-evident log showing *who approved what* (and when)
- a proof that a transaction satisfied constraints (limits, sanctions rules) without revealing sensitive details

Toolbox: signatures for provenance, plus proofs that policy constraints were satisfied.

Blockchains demonstrate external verifiability at scale: anyone can replay execution and verify the rules. But that guarantee stops at the chain boundary. The moment you depend on offchain facts—identity, documents, sanctions lists, delivery confirmation, internal policy—the verification burden comes roaring back.

The agentic economy won't live entirely inside a single blockchain or even across chains. It will run on the existing internet: SaaS systems, ERP software, supply chains, and regulated institutions.

To scale the real economy, we need to take the cryptographic proofs used in blockchains and apply them to standard internet infrastructure. We replace counterparty trust with checkable math.

This is where we see delta's role: attach verifiable settlement constraints in the form of cryptographic proofs to any economic (execution workflow). This adds work to execution, but it dramatically cuts verification time. In a world where execution (AI/compute) is abundant and verification (human time) is scarce, this trade-off is the key to scaling.

The paper by Catalini et al. has carved out the path the economy needs to follow: wherever the rules are well-defined (in their terms: the work is measurable), we need to replace human review with automated verification.

In other words, verifiability is the key to scaling the economy.
