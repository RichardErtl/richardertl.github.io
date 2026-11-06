---
title: "When Agent Telemetry Lies"
description: "Three telemetry failures in an AI coding system, and why their repairs needed checks of identity, aggregation, and capture."
type: "case-study"
tags:
  - Agentic Engineering
  - Observability
  - Telemetry
  - Evaluation
draft: false
publishedAt: 2026-11-06
order: 2
---

> **TL;DR:** In one session, telemetry labeled all **311 recorded tool-call spans** as conductor work; reconstruction assigned **272 to workers**. After repairs to context, ownership and model reporting, I found that later enrichment could still corrupt correct records. Before using a metric, I now require its unit, identity key, population and aggregation rule.

I build **SystemPrinter**, an Agentic Software Engineering Production System in which a *conductor* delegates work to *workers*. I use telemetry to guide handovers and understand delegation and model use. Three repairs in July and August 2026, followed by an audit, showed why I could not treat the resulting dashboards as validated measurements.

The telemetry in this article is my own: a recorder I built on Claude Code's hooks writes one record for each session, tool and subagent event. Claude Code's session transcripts are what I check those records against.

Transcripts retain request and tool-call evidence. Telemetry stores activity records; enrichment adds fields later. Dashboard readers select and combine those records. Each part needs checking.

## A percentage of what?

Context readings help decide when an agent should hand over. A manual transcript check produced **183%** under this formula:

```text
display_percent = round(transcript_bytes / 819_200 * 100)
```

Transcript bytes stood in for prompt tokens, and the 800 KiB denominator implied a window near 200,000 tokens. Above 100% meant escalating alarms.

A turn-end gate had just reported 182%; its 150% threshold blocked **one turn end** and instructed the agent to wind down.

In tokens, the picture was different: fill at the gate was approximately 484,000 tokens, or 48% of the **1M context window** I adopted afterward from the vendor's reference.

The increase had been abrupt. Following a documentation-skill load, one request added **325,742 cache-write tokens**, taking prompt fill from about 15% to 47% under that same window assumption.

The repair divided the latest request's prompt tokens by that window and set the gate at 90%. Because capacity remained unverified, I also added an absolute limit, later set to warn at 400,000 tokens and block at 500,000.

## Correct identity did not guarantee a correct tree

To assess delegation, I need to know who used each tool and where that work belonged in the execution tree. The original recorder labeled every tool span as conductor-owned. A span represents a recorded operation; several stored lines can describe it.

The diagram recounts one delegation-heavy session. All **311 recorded tool-call spans** carried the conductor label. Reconstruction from surviving evidence assigned **39 to the conductor and 272 to workers**: approximately **87.5% misattribution** among those recorded spans.

![One historical session contains 631 raw telemetry lines. Deduplication identifies 315 unique spans; filtering selects 311 recorded tool-call spans, all originally labeled conductor-owned. Ownership reconstruction assigns 39 to the conductor and 272 to workers, giving approximately 87.5% misattribution among those 311 spans.](/images/articles/telemetry-counting-units.svg)

*Deduplicate lines, select tool-call spans, then reconstruct ownership: each step asks a different question of the same recorded session.*

The repair read worker identity and role from event metadata. Linking a tool call to its worker span worked only while that span remained open: a turn-end flush closed background-worker spans. In later data, only **9.8%** of recorded worker calls were parented to their own worker span.

Session, agent, role, model, parentage, and tool ownership needed distinct meanings. Fixing one relationship did not validate the others.

## Missing data became a model

A per-model view should show which models did the work. Across three devices, about 88% of stored worker lines lacked a model. A fallback assigned token-bearing workers without models to Opus, and one measured worker could make the whole slice read as measured.

The span field was only a day old, so older lines predated instrumentation. Worker-model enrichment ran at session end, but could select the newest transcript rather than the ending session. Live sessions could lack those values; hard-killed sessions could miss enrichment entirely.

The repair read worker transcripts at worker stop and turn-end flush, and missing worker models became unknown. This was a partial repair.

## The corrections needed correcting

I then checked how many workers still lacked a recorded model. The answer changed with the identity key.

I first counted span IDs as workers, although one worker could produce multiple spans. Grouping by the agent field suggested about 1% of worker identities with worker rows lacked models. That field was also unreliable: a fallback could attach a stopping worker's transcript and model to another worker's identity.

Following each row's transcript reference instead gave **38 of 8,828, or 0.4%**. Of 286 workers apparently lacking worker rows, only 24 still lacked one after reconciliation. Including those tool-only workers gave **62 of 8,852, or 0.7%**, versus 4.2% under agent-field matching. These references were incomplete; workers invisible to telemetry remained outside the denominator, making 0.7% a lower bound.

## Validation depends on what the reader sees

I compared retained October–November transcripts from two of the four devices with their telemetry. Correctly recorded calls could still acquire wrong ownership labels during enrichment.

### Ownership after enrichment

| Device | Result |
| --- | --- |
| A | First-written rows matched owners for **62,066 tool-call IDs**. After later rows overrode earlier ones, **517 of 58,235 resolved records carried wrong labels**. |
| B | An any-row check found **25 of 57,783 IDs** with an incorrect row alongside a correct one. |

### Capture coverage

The table counts transcript call IDs without a matching ID-bearing telemetry row.

| Device | Result |
| --- | --- |
| A | **2,094 of 64,160: 3.3%**, mostly concentrated in seven gaps; 460 matched ID-less flush rows within a 15-second window. |
| B | **9.4% of conductor calls; 10.8% of worker calls**, spread across 439 of 458 sessions. |

The time matches suggest that some calls left ID-less flush records.

## Evidence scope

These findings come from one owner-operated system. The later checks covered two of its four devices under different rules, so their results are not device rankings, and some capture gaps remain unexplained.

## What I require from a measurement

Before using telemetry to justify a decision, I need its quantity, unit, identity key, population, and rule for reading corrections. I distinguish missing records, missing fields, and misfiled data. Correctness and capture coverage require separate checks.

Explicit [units](https://prometheus.io/docs/practices/naming/) and [trace/span identities](https://opentelemetry.io/docs/specs/otel/trace/api/) provide foundations. The additional obligation is to validate what the consumer actually reads—including later enrichment—and hold every correction to the same evidence standard as the original claim.

## References

- [Prometheus: Metric and label naming](https://prometheus.io/docs/practices/naming/).
- [OpenTelemetry: Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/).
