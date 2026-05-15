Execute the next unfinished phase from the project plan.

Use this workflow:

1. Find the active plan file.
   - Prefer `PLAN.md` if present.
   - If there are multiple plausible plan files, choose the most project-specific or recently modified one.
   - If no plan file exists, stop and explain that a plan is required before execution.

2. Find the next unfinished phase.
   - Scan the plan from top to bottom.
   - Treat headings such as phases, milestones, steps, numbered sections, or major checklist groups as phases.
   - Start with the earliest phase that contains unchecked work.
   - If there is a Phase 0, Step 0, Foundation, Setup, Baseline, or similar first section and it is not complete, execute that first.
   - Skip phases that are already fully checked off.
   - The selected unit of work is the entire next unfinished phase, including all unchecked checkbox tasks inside that phase.
   - Do not continue into later phases or unrelated cleanup.
   - If the selected phase is too broad to finish as one reviewable change, stop and propose a smaller phase split for user approval.

3. Read the product requirements before implementation.
   - Prefer `PRD.md`, product specs, requirements docs, issue descriptions, or acceptance criteria in the repo.
   - Extract the relevant goals, non-goals, acceptance criteria, safety boundaries, and demo expectations for the selected phase.
   - If requirements are missing, proceed only when the selected phase is clear and low risk; otherwise stop and ask for the missing requirement.

4. Spin up subagents before implementation.
   - Start one developer subagent to work on the selected phase. Give the developer agent clear implementation ownership, expected deliverables, and scope boundaries.
   - Start one reviewer subagent to review the phase implementation for bugs, regressions, tests, maintainability, and missed edge cases.
   - Start one product/PM/BA subagent to compare the phase work against the product requirements, acceptance criteria, user value, scope, and non-goals.
   - Tell every subagent the selected phase, relevant requirement excerpts, expected deliverables, and any files or areas they own.
   - Make clear that subagents must not revert unrelated user changes.

5. Coordinate the implementation.
   - Do the critical-path work locally while subagents work in parallel.
   - Integrate useful subagent output into one coherent phase implementation.
   - Keep the change scoped to the selected phase unless a small supporting edit is necessary to make it work.
   - Preserve existing project conventions, architecture, naming, formatting, and package-manager choices.
   - Prefer incremental internal checkpoints within the phase so each completed checklist item is easy to review.

6. Verify the work.
   - Run the most relevant tests, builds, linters, type checks, smoke checks, or manual validation for the changed areas.
   - If tests cannot be run, explain exactly why.
   - Use the reviewer subagent's findings to fix real issues before finishing.
   - Use the product/PM/BA subagent's findings to correct scope drift or requirement gaps before finishing.

7. Update the plan.
   - Check off every task in the selected phase that is genuinely complete.
   - Do not check off tasks in later phases.
   - Do not mark a task complete if it was skipped, partially implemented, or blocked.
   - Add a short note under completed or blocked tasks only if it clarifies important implementation details, test evidence, or a known follow-up.
   - Leave unfinished or blocked tasks unchecked and add a concise blocker note when useful.

8. Final response.
   - State which plan phase was executed.
   - Summarize the implementation in a few bullets.
   - List verification performed and any failures or skipped checks.
   - Mention plan updates made.
   - Call out remaining blockers, if any.
   - Stop and wait for user review before starting another phase.

Execute exactly one selected phase, then stop for user review. Do not continue into later phases without an explicit follow-up instruction.
