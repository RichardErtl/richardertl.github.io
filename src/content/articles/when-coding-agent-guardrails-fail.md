---
title: "When Coding-Agent Guardrails Fail: Evidence, Scope, and Recovery"
description: "Three incidents in an AI coding system show why executable guardrails need relevant evidence, clear coverage boundaries, and usable recovery paths."
type: "case-study"
tags:
  - Agentic Engineering
  - Coding Agents
  - Guardrails
  - Developer Tooling
  - Reliability Engineering
draft: false
publishedAt: 2026-11-06
order: 3
---

> **TL;DR:** In SystemPrinter, I replaced an agent-maintained overview with short workstream records and a generated startup view, tied review records to Git blob hashes, and repaired the question and escape controls around a deployment guard. Three incidents show why a control needs relevant evidence, clear operational boundaries, and usable recovery.

## When Verification and Recovery Conflict

I develop **SystemPrinter**, an **Agentic Software Engineering Production System**. After a September deployment, one of its guards required visual verification on a headless Linux machine whose configured screenshot path was unavailable. Non-interactive permissions rejected the approved recovery command. The guard also blocked **question cards**, the system's interactive questions to the operator.

Executable controls interacted in a way that obstructed resolution. Two other incidents exposed a misleading reminder metric and review evidence insufficiently tied to the code being integrated.

## Misleading Reminder Statistics

Agents maintained shared state files that periodically needed trimming. A **hard size gate existed first**; a **Stop-hook reminder** was added later to prompt agents to reduce oversized files.

The original unmatched-reminder metric looked for a relevant commit before the *next reminder from any session*. That window could close before a response appeared. Commits were also a proxy for maintenance, not direct evidence of compliance.

Reanalysis of **89 calls across 40 sessions on one device** yielded **25%–62% unmatched**, depending on the observation window. Matching by time could not show which session authored a commit, so these percentages are not noncompliance rates.

A state-tracking bug also caused repeated reminders, and much of the checked content was shared and not fully under a single session's control.

In the week the reminder left the fleet, the state files were cut **25 times**, while the hard gate remained active.

I later replaced the agent-maintained overview with short workstream records and a generated startup view, removing the recurring trimming duty.

## Approval Must Refer to the Code Being Integrated

Another gate, added in October, checked review evidence before **landing** changes—integrating them into the main development branch. It accepted either a reviewer-run record or a recent text file declaring an acceptable verdict. Its refusal message explicitly offered the file route.

Four inspected cases used that route after rejection. In **three of them**, test-file edits made after review implemented reviewer feedback and landed without another reviewer run. Their verdict files disclosed the changes, not the absence of a subsequent review. That was no bypass: the gate itself offered this route.

In about 30 hours on one machine, **28 of 99 sessions lasting at least two minutes** invoked the verdict-file option. All 28 also ran a reviewer, but the file could not show that the review covered the final code.

The replacement tied approval to **file paths and Git blob hashes at the branch head**, recorded during a reviewer run. If the content of a checked file changes after review, its Git blob no longer matches the record. This content-bound record is a **seal**, not a cryptographic signature.

| Evidence | What the check establishes |
|---|---|
| Recent verdict file | A recent approval claim exists. |
| Reviewer-run record | A reviewer ran; coverage of the final content is not established. |
| Content-bound record | Absent forgery, checked branch-head paths and blobs match those recorded during an approving reviewer run. |

The integration boundary matters as well. A seal describes branch-head content. If a subsequent three-way merge combines that content with changes already on the main branch, approval of the source-branch blobs does not automatically approve the merged result. Initially, a direct push skipped the check inside the landing command. A pre-push check added later required a passing test run, not a seal.

## Recovery Must Work Under the Same Constraints

After a September deployment, a **marker**—a state flag activating the guard—required visual proof. Until an image passed a content check, a pre-tool guard blocked question cards, sign-off requests, and closing commands across sessions on the machine.

On the headless Linux machine, the configured screenshot route depended on a browser that was not installed. The approved, logged escape script was missing from the non-interactive command allowlist; permission checks refused it **six times**.

A later session deliberately attempted a question while aware of the marker. The question command passed the guard because the session's habitual `timeout` prefix hid it from the parser; the card was stored without being pushed to the operator.

I changed the guard to allow questions, taught its parser to recognize `timeout`, and added the approved escape script to the command allowlist. Human-assisted visual verification then succeeded; the marker had been set for **5 hours and 37 minutes**.

## Four Questions Before Enforcing a Rule

1. **What fact is verified?** Recompute relevant properties where possible. A recent approval claim is not evidence tied to the content being shipped.
2. **What operation is covered?** Check the boundary from the proposed command to the integrated artifact. A branch-head record does not automatically validate merge output.
3. **Does approved recovery work here?** Exercise it under the same permissions and device constraints as the guarded operation. Keep overrides explicit and auditable.
4. **Can a request for help get through?** Blocking an unsupported completion claim and blocking a request for guidance are different policies. Distinguish message storage from delivery; neither proves that a message was read.

Strict denial can be appropriate for destructive actions. The lesson is to design denial and a usable recovery procedure together, not to make every guard fail open.

## The Design Lesson

These retrospective cases come from one owner-operated system; their effect on overall failure rates has not been measured. The engineering change was to treat evidence, operational coverage, and recovery as parts of the same control.
