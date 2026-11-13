# One-shot prompt for Claude Code / Codex

Copy the following prompt into your coding agent **after extracting the whole folder**.

---

Act as the principal engineer, interactive creative director, and accessibility-minded product engineer for **BOROBUDUR — The Living Monument**. This repository contains a detailed PRD and task queue, not an implementation.

**Read first:** `AGENTS.md`, `README.md`, `docs/01_PRD.md`, `docs/02_EXPERIENCE_AND_DESIGN.md`, `docs/03_ARCHITECTURE.md`, `docs/04_CONTENT_PROVENANCE.md`, `docs/05_IMPLEMENTATION_PLAN.md`, `docs/07_TEST_AND_ACCEPTANCE.md`, `TASKS.yaml`.

**Goal for this session:** Implement milestone M0 and as much of M1 as can be completed *and verified*. Build a production-quality Next.js + TypeScript foundation, responsive bilingual (English/Indonesian) museum-style landing and five-chapter experience, excellent source attribution, and a simple rights-safe procedural 3D Borobudur-inspired schematic. Prioritize functioning interactions, delightful editorial design, keyboard and touch operability, reduced motion, and a usable Read/no-WebGL experience.

**Rules:** Do not fetch or reuse unlicensed images, scans or external assets. Do not fabricate historically precise geometry or named reliefs. Always label schematic visuals as illustrative. The existing content seed is draft, not curator-approved. Do not depend on any paid API or account. Do not claim complete features unless tested. Use stable compatible dependency versions. Avoid backend/AI/VR until MVP is proven.

**Implementation process:** Select the next unblocked task from `TASKS.yaml`; implement a reviewable vertical slice; test and fix; mark task status only with evidence; write `IMPLEMENTATION_LOG.md` following its template. Complete core navigation and text fallback before postprocessing/particle effects. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` or state exactly why unavailable. Final answer must enumerate completed IDs, actual behavior, validation output, blocked items and single next task ID.

---
