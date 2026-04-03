---
title: "The Verification Gap in Agentic Commerce"
urlSlug: verification-gap-agentic-commerce
published: 2026-04-01
summary: "Merchant-side authorization solves the wrong half of agentic commerce. The missing piece is a buyer-side policy enforcement layer that verifies intent across merchants before funds move."
---

![From point-of-sale to point-of-intent](/articles/verification-gap-agentic-commerce/hero.png)

An agent books you a trip. Flight on United, hotel through Booking.com, car from Hertz. Your constraint: under $3,000 total, arriving before 3pm on the 14th so you make your dinner meeting. The agent finds options that work. Flight at $680, hotel at $1,450 for three nights, rental car at $340. Total: $2,470. Well within budget, timing checks out.

Now what?

Three separate merchants are involved. No individual merchant knows about the other two. No individual merchant can verify that the total is under $3,000—it can only see its own leg. No individual merchant can confirm that the arrival time on the flight is compatible with the hotel check-in.

The harder failure mode is not just violating budget. It is confirming one leg while another reprices, expires, or fails, leaving the buyer with a broken bundle.

Somebody needs to verify the bundle and control commitment, because once one leg is confirmed and another fails, the buyer absorbs the breakage unless the platform owns that risk.

This is not a hypothetical. ChatGPT already has shopping features. Google is building agent commerce into Gemini. Every major AI lab and a growing number of startups are working on agents that transact on your behalf. The technology for agents to *find and negotiate* purchases is moving fast. The infrastructure for agents to *verify and enforce* that a purchase actually satisfies your intent—before anything irreversible happens—is basically nonexistent.

This is the central unsolved problem in agentic commerce.

Not discovery, not negotiation, not even fraud detection. Verification. Specifically:

**How do you ensure that an agent only commits to actions that provably satisfy your constraints?**

Merchant-side authorization is necessary but insufficient. Agentic commerce also needs a buyer-side policy, approval, and funding-control layer, and no broadly deployed cross-merchant implementation exists yet.

---

## What Merchant-Side Authorization Gets Right

Protocols like Google's AP2 focus on a specific question: should the merchant authorize this transaction? The merchant receives a request from an agent, evaluates it against its own policies—inventory, pricing, eligibility, fraud signals—and either rejects or approves. When it approves, it produces some form of attestation: a signed object that says "I, merchant X, agreed to provide Y on terms Z."

This solves three concrete problems:

1. **The merchant retains sovereignty over its own transaction decisions.** If an agent sends a malformed request, tries to exploit a pricing error, or does something outside the merchant's terms, the merchant can reject it.
2. **It creates an audit trail on the merchant side.** If a dispute arises, the merchant can point to the signed authorization object.
3. Merchant-side acceptance can also provide **reservation / quote validity / expiry semantics**, which matter a lot in travel and inventory-sensitive flows.

For simple, single-merchant transactions, merchant-side authorization is generally sufficient. If an agent is reordering your regular coffee subscription or buying a specific product from a known merchant, the merchant-side check is a reasonable gate. The merchant can verify the agent's request, produce its attestation, and the transaction proceeds.

**The problem is that this class of transactions is precisely the class where agents add the least value.**

---

## Where It Breaks

The entire point of delegating commerce to an agent is that the agent can do things you can't easily do yourself. Clicking "reorder" on Amazon is not that. What *is* that is cross-merchant optimization, complex multi-step purchases, and constrained bundle construction. These are the use cases that justify having an agent in the first place.

Here are four scenarios. In each, pay attention to where the constraint lives.

1. **Cross-merchant budget constraints.** "Book me flights and a hotel for my London trip. Total budget: $3,000." The agent finds a flight for $900 and a hotel for $1,800. Both are within the total budget. But the airline doesn't know about the hotel, and the hotel doesn't know about the flight. Neither merchant can verify that the combined total satisfies the user's constraint, because neither merchant can see the other leg of the transaction. The budget constraint is buyer-side. It cannot be evaluated merchant-side.
2. **Temporal bundles with cross-dependencies.** "Find me a conference ticket for NeurIPS, a hotel for those dates, and a flight arriving the day before." The hotel dates depend on the conference dates. The flight date depends on the hotel check-in. These temporal dependencies span three merchants, none of whom are aware of each other. The merchant-side authorization for the hotel cannot verify that the flight arrives in time. Only something with visibility into all three legs can enforce the constraint.
3. **Enterprise procurement policies.** "Purchase 500 units of component X from approved vendors. Not to exceed $12 per unit. Requires manager approval above $5,000 total. Charge to the Q2 hardware budget." This is a set of constraints that live entirely on the buyer side—approved vendor lists, per-unit caps, approval thresholds, budget allocation. No merchant has access to any of this. In practice, enterprises already solve this with procurement systems (Coupa, SAP Ariba, etc.) that enforce buyer-side policy before a purchase order ever reaches a supplier. We need to be able to insert the agent without bypassing existing controls. Merchant-side checks don't help here.
4. **Standing orders with substitution logic.** "Reorder office supplies monthly. If an item is unavailable, substitute with the closest equivalent. Keep total within 10% of last month's order." This requires state across time (last month's total), substitution logic that spans the merchant's catalog, and a global budget constraint that applies to the aggregate. The merchant can tell you whether item X is in stock. It cannot evaluate whether the substituted bundle satisfies your 10% constraint across all items. It requires buyer-side state.

The pattern is clear. In every case, the constraint is defined by the buyer and evaluated across merchants. The merchant can only see its own piece.

It can answer "should I, the merchant, allow this transaction?"

It cannot answer "does this transaction satisfy the buyer's intent?"

These are fundamentally different questions. Agent commerce requires both.

---

## The Three-Layer Architecture

At the decision layer, human e-commerce looks like a two-party interaction: buyer and seller.

Agentic commerce splits the buyer into two parties:

- The user (principal);
- The agent (agent).

Just as in human-to-human principal-agent relationships, the user issues a mandate which the agent has to follow. Unlike the purely human case, the agent is not bound to the principal via a legal agreement with potential recourse. You can't sue your agent.

Instead, we need policy infrastructure, approval infrastructure and evidence infrastructure around the agent.

The user needs strong guarantees that unapproved spends will not take place, as well as auditable evidence of executed purchases matched against user intent.

When the principal is an enterprise, this is no longer just important, but a requirement for adoption to take place at all.

Given the three-party model, the architecture for verified agent commerce falls naturally into three layers. Each layer has a clear owner, a clear function, and a clear role in dispute resolution.

**Layer 1: The Delegated Purchase Mandate**

Before any shopping happens, the user defines a mandate. The mandate is a typed policy object—not (necessarily) scoped to a specific merchant, but scoped to an intent. It specifies what the agent is authorized to do, under what constraints, with what budget, and optionally for what purpose.

Examples of mandates:

- "Book travel to London for under $3,000, economy or premium economy, departing between March 5–7"
- "Procure 500 units of component X from approved vendors, not to exceed $12/unit, charge to Q2 hardware budget"
- "Reorder last month's office supplies, allow substitutions, keep within 10% of last month's total"

The mandate is the verifiable intent object. It is the ground truth for what the user wanted. Everything downstream gets measured against it. In a dispute, the mandate is what you point to: "Here is what I authorized. Did the outcome match?"

The mandate gates everything. No fund release or final commit without a verifiable mandate.

**Layer 2: Merchant Authorization**

The agent goes shopping. It visits merchants, negotiates or selects terms, and presents purchase requests. Each merchant evaluates the request against its own state—inventory, pricing, eligibility, fraud—and either rejects or produces a signed authorization object.

The merchant authorization says: "I, merchant X, will provide product Y at price Z under terms W. This authorization is valid until [timestamp]."

This is where existing merchant-side protocols (AP2 and others) live, and they do this part well. The merchant authorization protects the merchant. It's the merchant's receipt of what it agreed to, and in a dispute, the merchant points to this object: "Here is exactly what I committed to. I fulfilled it."

The agent collects merchant authorizations as it shops—potentially from multiple merchants, potentially over time.

**Layer 3: Policy Enforcement**

This is the missing piece.

A buyer-side policy and commit engine takes the normalized mandate, candidate supplier offers, and required approvals, then evaluates whether the proposed bundle satisfies budget, timing, vendor, compliance, and settlement constraints. If it passes, the platform reserves or releases funds through the appropriate credential layer and emits an evidence record linking the mandate version, supplier offer IDs, approvals, and payment reference. If it fails, no final commit occurs.

The beauty of this layering is the dispute resolution model. Any dispute reduces to examining three objects:

1. The **mandate** proves what the user intended.
2. The **merchant authorizations** prove what each merchant committed to.
3. The **verification proof** proves that the agent verified the match before proceeding.

If the merchant didn't deliver what it authorized, that's the merchant's problem—the authorization object makes this clear. If the agent exceeded the mandate, the verification layer should have caught it—if it didn't, that's the platform's problem. If the user's mandate was ambiguous, that's visible too. Every party's obligations and every failure point are auditable.

---

## Two Common Models

In both of these models, a discovery layer is assumed—the agent finds merchants, compares options, and negotiates terms. This is the part that current AI capabilities already handle well. The interesting architectural question is what happens *after* discovery, when money needs to move.

**Consumer: The agent platform**

![Screenshot 2026-04-01 at 14.29.40.png](/articles/verification-gap-agentic-commerce/Screenshot_2026-04-01_at_14.29.40.png)

While a handful of nerds may make purchases through their personal agents, the vast majority of agentic consumer commerce will happen through platforms, either via interfaces such as ChatGPT, existing online merchants, or dedicated agentic commerce platforms (likely vertical-specific).

Here the agent lives inside the platform, and the trust gap to be solved is that between agent and platform—in consumer agentic commerce, the platform often becomes the de facto trust anchor. The flow will therefore look something like this:

1. User issues a mandate to the agent (on the platform);
2. Agent finds and initiates the purchases;
3. Each merchant authorizes the relevant transactions;
4. Platform enforces the conditional release of the user's funds.

**Enterprise: Making existing systems enforceable**

![Screenshot 2026-04-01 at 14.37.24.png](/articles/verification-gap-agentic-commerce/Screenshot_2026-04-01_at_14.37.24.png)

Enterprise procurement already has the right form factor, with ERP systems used to define the constraints for permissible purchases. For agents to be used in the Accounts Payable (AP) function where they are executing the release of funds, the enforcement layer is used to enforce the upstream procurement constraints from the ERP system (and potentially more complex constraints).

Unlike consumer commerce, enterprise procurement typically doesn't rely on merchant-side authorization in the same way—suppliers respond to purchase orders rather than authorizing card transactions—and so the enforcement layer operates directly between the ERP-defined mandate and the payment execution, without needing a merchant authorization step in the middle.

1. ERP system (Coupa, SAP Ariba) is used to define a procurement order;
2. Agent finds and initiates the purchases;
3. Enforcement layer enforces the conditional release of the enterprise's funds.

---

## The Bootstrapping Problem

An obvious objection: this architecture assumes merchants produce machine-readable authorization objects, and most merchants today produce nothing of the sort. The checkout flow on a typical e-commerce site is a web form, not an API endpoint that returns signed attestations.

This is temporary. The same wave of agent commerce that creates the need for buyer-side enforcement is simultaneously pressuring merchants to expose structured, machine-readable interfaces. Google's AP2, Shopify's agent APIs, and a growing number of merchant platforms are already moving in this direction—not because of any enforcement layer, but because agents can't shop on sites designed for human eyeballs.

The merchant-side interface problem is solving itself for independent reasons.

In the meantime, the enforcement layer can operate in a degraded but still useful mode: enforcing buyer-side constraints (budgets, policies, approval flows) even when merchant authorizations are informal or absent. An enterprise procurement agent that enforces a $12/unit cap and requires manager approval above $5,000 is valuable today, regardless of whether the supplier returns a signed authorization object or just a confirmation email. Full cryptographic verification of the end-to-end chain is the end state, but useful enforcement doesn't require waiting for it.

---

## The Conceptual Shift

It's worth naming what changes here, because this is not a minor tweak to the checkout flow. It is a fundamentally different model of commerce.

**From point-of-sale to point-of-intent.** In human commerce, the atomic moment of commitment is the checkout: you click "buy," you enter your card, the charge processes. The entire infrastructure—shopping carts, checkout pages, 3DS challenges—is built around that moment. In the mandate model, the moment of commitment moves earlier and becomes more abstract. You commit to an intent ("book me this trip under $3K"), and the actual transactions are downstream consequences. The mandate is the point of commitment, not the checkout.

This means the mandate is, in a sense, a programmable letter of credit. The user is saying: I authorize up to this much, for this purpose, under these constraints. The platform guarantees to merchants that funds exist within the mandate's bounds. The merchants are essentially drawing against the mandate rather than charging a card at checkout.

**From synchronous to asynchronous.** Checkout is synchronous. Click, charge, confirm—all in one session, usually seconds. In the mandate model, verification is inherently asynchronous. The agent might collect merchant authorizations over hours or days for a complex purchase. Verification triggers when the platform determines that the bundle of authorizations satisfies the mandate. This looks much more like B2B procurement or financial settlement than consumer checkout.

**From merchant-orchestrated to buyer-orchestrated.** Today, the merchant controls the flow. The merchant presents options, runs the checkout, initiates the charge. The buyer is reactive—choosing among options and authorizing charges the merchant requests. In the mandate model, the buyer (as principal and agent) orchestrates. The agent solicits merchant authorizations and brings them back. Its policy engine decides when to proceed. The merchant still gatekeeps its own inventory and terms, but it is no longer the orchestrator.

**From transaction-scoped to intent-scoped trust.** A traditional payment authorization is scoped to a single transaction: this amount, this merchant, right now. The mandate is scoped to an intent, which may span multiple transactions, multiple merchants, and an extended timeframe. The trust model is fundamentally different.

## What Needs to Exist

The infrastructure for agent discovery and merchant authorization is being built, rapidly, by well-funded teams at Google, Stripe, Shopify, and others. This is necessary work. But it solves the merchant's problem—"should I accept this transaction?"—not the buyer's problem: "does this transaction satisfy my intent?"

What's missing is the buyer-side enforcement layer. A system that takes a user's mandate, collects merchant commitments, and produces a verifiable proof that the mandate was satisfied before any funds move. Not a recommendation engine. Not a chatbot with a credit card. A policy enforcement layer with cryptographic or auditable guarantees.

This is not a feature that can be bolted onto existing checkout flows. It requires new primitives: a mandate format expressive enough to capture real purchasing intent, a verification engine that can evaluate cross-merchant constraints, and a settlement mechanism that conditions fund release on verified policy satisfaction.

The companies building agent commerce infrastructure are focused, understandably, on making agents useful. Making them *verifiably trustworthy* is a different problem, and it's the one that will determine whether enterprises and high-value consumers actually delegate real purchasing authority to agents—or keep them as glorified search tools with a human approving every checkout.

The enforcement gap is the bottleneck. Closing it is the unlock.
