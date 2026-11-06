---
name: SystemPrinter
tagline: An Agentic Software Engineering Production System
summary: A private platform for orchestrating, evaluating, and optimizing AI coding agents on complex software.
status: private
order: 1
technologies:
  - Git worktrees
  - OpenTelemetry
  - Prometheus
  - Loki
  - Jaeger
  - Grafana
capabilities:
  - Multi-agent orchestration
  - Context and session management
  - Review and quality control
  - Observability and telemetry
  - Human supervision
siteFigures: true
relatedArticles:
  - why-i-stopped-maintaining-shared-state
---

SystemPrinter is a private system. It is not a downloadable product.

I design and operate it myself and use it daily on real coding work. It explores a shift from direct interaction with individual coding agents toward a higher layer of orchestration, control, observability, and decisions. This page covers the concepts and the lessons. The implementation stays private.

## Concepts

### Orchestration with human approval

Work is delegated across coordinated coding agents. High-impact scope and production decisions stop at human approval gates.

### Structured contracts

Tasks and reports follow structured contracts.

### Isolated worktrees

Agents work in isolated Git worktrees.

### Guardrails in code

Reviews, context limits, Git policies, and completion criteria are enforced at runtime in code, rather than relying on prompt discipline alone.

### Telemetry and measurement

Telemetry tracks token consumption, context use, execution time, failures, and aborts. Changes follow one cycle: establish a baseline, change the architecture or workflow, then measure again.

### History, continuation, and startup context

These three have different lifecycles, so they are kept apart. History stays available, the current position is replaced, and startup context is selected.

## Lessons

**Keeping something and loading it are different decisions.** History can stay available without becoming input to every new session.

**Models write bounded accounts; code enforces mechanical rules.** Structure, metadata, and ownership need not depend on an agent maintaining prose.

**A claim belongs to its metric.** Smaller files, fewer commits, and better task outcomes are separate results, and each keeps its counting scope.

**Retries and interruption need their own tests.** Ordinary runs that succeed say little about partial writes or sessions that end early.

**Deterministic code is still software.** Moving work out of the model creates code that also needs maintenance.
