# The case for agent payments with stablecoins: verification, not settlement

![Screenshot 2026-02-26 at 12.54.56.png](The%20case%20for%20agent%20payments%20with%20stablecoins%20verif/Screenshot_2026-02-26_at_12.54.56.png)

- Citrini Research: [*The 2028 Global Intelligence Crisis*](https://www.citriniresearch.com/p/2028gic)

Citrini’s scenario isn’t a payments paper. One idea still escaped containment to the point of [moving markets](https://invezz.com/news/2026/02/23/citrinis-thought-exercise-on-ai-sparks-selloff-in-visa-doordash-others): agents will use stablecoins because they’re cheaper and faster. But reducing payments to cost and latency is wrong.

That framing ignores compliance, disputes, and liability—the things rails are *actually* selling. In reality payments is failure-mode handling. Cards dominate consumer payments because disputes are native: chargebacks are part of the rail.

The way I like to think about payments is execution vs verification.

- **Execution** is moving money: clearing, settlement, finality. The knobs are cost and time.
- **Verification** is everything that decides whether the transfer should happen, and who eats the loss when it shouldn’t have.
    - **Intent & consent** (what the user authorized)
    - **Risk, compliance & controls** (KYC/AML/sanctions, fraud, velocity limits)
    - **Dispute & recourse** (chargebacks, refunds, arbitration)

Execution is necessary. Verification is what makes it legal, safe, and economically viable. 

Most “agents will use stablecoins” takes stop at execution and treat verification as legacy cruft. 

That’s not how adoption plays out. 

If agent payments bypass sanctions screening, sanctions stop working; you’ve built a loophole. Regulators will close it. Substitute “sanctions” with any policy constraint—AML, spend limits, corporate procurement—and the conclusion is the same: verification has to be native.

Without verification, agent payments never leave toy scale. Commercial actors need protection against:

- benign mis-execution (misparse, wrong variant)
- adversarial manipulation (prompt injection, poisoned listings)
- compromised keys (agent or wallet)
- merchant-side dark patterns (cart/checkout games)

People’s obsession is settlement. But settlement is easy. The bottleneck is authorization, enforceability, and evidence. That’s where stablecoins matter.

A programmable account controlling a stablecoin balance can encode spend rights—limits, allowlists, expiries, and conditions—in a way that’s enforceable *before money moves* and auditable *after it does*.

## The Intent Matching Problem

> The intent matching problem is the gap between what the user asked for and what the payment irrevocably commits to.
> 

You ask for a green sweater; it buys red. You ask for authentic; it buys counterfeit. You ask for one-time; it signs you up for a subscription. That’s the **intent matching problem**. When a user’s prompt leads to an agent’s payment, current systems can’t answer:

- Was this authorized?
- Did it satisfy the mandate, or did the agent mis-execute?
- Who’s on the hook when it didn’t?

This is structural: every party inherits a new loss mode.

- **User**: if mistakes aren’t recoverable, they won’t delegate spend.
- **Merchant**: if errors look like fraud/chargebacks, they’ll reject or surcharge.
- **Issuer/PSP/network**: if “agent error” becomes a dominant dispute class, existing fraud + chargeback economics break.
- **Agent developer/platform**: if they become the de facto insurer for agent mistakes, margins collapse.

You’ve added a new dispute class—semantic mismatch—to a system built for fraud, non-delivery, and stolen cards. Everything breaks.

### The world is trying to fix it: AP2

The industry has found the right problem. Google’s AP2 is the cleanest attempt so far. AP2 gets a lot right:

- It names the core: authorization, authenticity, accountability.
- It pushes verifiable intent (signed mandates), not inferred action.
- It’s rail-agnostic—which is the point: verification must travel across rails.

The catch: AP2 is merchant/PSP-distribution constrained: the protocol’s guarantees only exist where the merchant side can produce and sign the required artifacts. This has practical consequences:

- Agents can only shop where merchants implemented it.
- The merchant has to be part of the mandate, which rules out open-web shopping.
- Composite intents (“book me a trip…”) don’t fit.

**AP2 is the best articulation of the problem—but its distribution and delegation constraints are real.**

AP2’s mandate chain is strongest in human-present flows: the user can start with a merchant-agnostic intent (“find me running shoes”) and only bind to a specific merchant when signing the final cart mandate.

AP2 shines in closed loops. The open web is the hard case.

## Stablecoins and programmable authorization

> Stablecoins matter less as settlement rails and more as programmable enforcement.
> 

Stablecoins offer an alternative to merchant-side protocols: put authorization logic on the spender side via smart accounts. We can then incorporate semantic intent matching logic with:

- **preventative authorization** (don’t spend unless constraints are met), and
- **tamper-proof evidence artifacts** for disputes.

Concretely: the user issues a signed mandate (“you may spend up to $X, on Y class of goods, under Z conditions”), and the infrastructure enforces it.

Users get a hard guarantee: the agent cannot settle a payment outside the mandate (e.g. if the mandate says “green sweater” and the offer artifact the agent is trying to buy says “red,” the spend simply can’t settle.). 

For the merchant and any intermediary, the evidence artifacts determine liability based on whether the user’s intent was satisfied. Their baseline threat model doesn’t expand: the payment now carries a proof of what was authorized.

The key unlock is that disputes become adjudicable: the transaction carries an evidentiary trail of what the agent believed it was buying, what the user authorized, and what the merchant claimed to sell.

Note: Programmable verification does not magically solve typical disputes regarding quality, cancellation or “not as described”; it does not altogether remove the need for human institutions.

## Near-term: Hybrid systems

While stablecoins solve the intent matching problem via programmable authorization, stablecoin-based systems to deal with traditional verification-related challenges do not yet exist at scale. These systems will take years to earn trust and distribution.

In the short to medium term, we expect hybrid systems to pop up: agentic commerce platforms that sit between the user and the merchant, such that:

1. Users initiate payments that are conditional on their intent being satisfied;
2. The platform, using agents, finds and makes purchases that satisfy the user’s intent, using e.g. cards or other rails;
3. The user’s payment settles once the platform proves that the intent was satisfied.

These systems solve the intent matching problem without having to reinvent payments. They use stablecoins as a verification overlay: mandates + escrow + proof-based release. 

![Screenshot 2026-02-26 at 12.19.56.png](The%20case%20for%20agent%20payments%20with%20stablecoins%20verif/Screenshot_2026-02-26_at_12.19.56.png)

Of course, this pushes liability onto the platform: it becomes the adjudicator and may take regulatory and credit exposure. The bet is that programmable mandates + strong evidence shrink that liability enough to make the business viable. It starts looking like a credit card issuer for agents, but the risk being underwritten is agent error.

The hybrid approach is not competitive with protocols such as AP2, which have been explicitly designed to work across payment methods. 

## Conclusion: stablecoins win by automating verification

Ultimately, stablecoins will dominate agentic payments because it’s the only mainstream rail where *users* can make authorization programmable and verifiable. Beyond solving the intent matching problem, any policy will be encodable as settlement-gating authorization logic, e.g.

- AML/sanctions screening
- compliance checks
- company-specific rules

Automating these verification tasks becomes increasingly important as AI agents scale our ability to execute payments—without it, the human overhead will scale with the amount of payments activity.

Agents scale execution faster than humans scale verification. Verification has to be automated, or humans become the bottleneck. 

Autonomy without verifiability doesn’t scale. No other mainstream rail gives you verifiability by default.

Stablecoins win by enforcing the existing rules in code—and emitting lightweight, auditable evidence.