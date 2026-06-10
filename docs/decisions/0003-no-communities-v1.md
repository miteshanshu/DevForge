# ADR 0003: No Dedicated Communities in V1

## Status
Accepted

## Context
DevForge aims to be the unified developer ecosystem, replacing Discord/Reddit. Originally, dedicated "Communities" (sub-forums) were planned for V1.

## Decision
We will **defer the Communities feature to V2**. V1 will rely entirely on a unified Global Feed and a Tag-based taxonomy (e.g., `#react`, `#system-design`) rather than walled gardens.

## Consequences
- **Positive:** Solves the "empty room" problem. New users will see a bustling global feed rather than empty isolated communities.
- **Positive:** Drastically reduces V1 database complexity (no community roles, permissions, or isolation logic).
- **Negative:** We lose the "private group" feel initially, requiring users to rely on search and tags to find their niche.
