---
name: EDULINI
tagline: A learning platform for Austrian primary schools
summary: A web platform where teachers assign exercises and children solve them, already used in Austrian classrooms. Co-developed in a two-person team, with Claude Code since early 2026.
status: product
order: 3
technologies:
  - TypeScript
  - Next.js
  - PostgreSQL
  - Prisma
  - WebSockets
  - Prometheus
  - Grafana
capabilities:
  - Teacher app
  - Student app
  - Live lessons
  - Production monitoring
  - Teacher feedback loop
links:
  website: https://edulini.at/
---

EDULINI is a web-based learning platform for Austrian primary schools, grades 1 to 4. I co-develop it in a two-person team. It is used in real classrooms and is still under active development. It is not open source.

## Purpose

Teachers prepare exercises, assign them to their class, and see the results. Children solve them in an interface built for their age. Where an exercise can be graded automatically, it is.

The product site describes EDULINI for teachers and schools: [edulini.at](https://edulini.at/).

## How it is built

### Three applications, one shared core

A teacher app, a student app, and a separate WebSocket service for live lessons. They share domain types, grading, and data access, and no user interface.

### AI-assisted development

Claude Code has been part of the development workflow since early 2026. The most recent exercise format, written arithmetic, was built through [SystemPrinter](/projects/systemprinter/): bounded tasks, isolated worktrees, and a review before each merge. A human accepts every result.

### Feedback from classrooms

Teachers send feedback from inside the app, and it is triaged into the backlog. The current work is a second larger refinement of usability, visual design, and the learning experience, based on that feedback.

### Operated and monitored

EDULINI runs in production. Prometheus and Grafana monitor the application, the host, and the database.

## Status

Active development. Further exercise formats are in progress.
