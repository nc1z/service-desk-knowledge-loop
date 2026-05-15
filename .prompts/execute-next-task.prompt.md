Execute the next unfinished task from the project plan.

Use this workflow:

1. Find the active plan file.
   - Prefer `PLAN.md` if present.
   - If there are multiple plausible plan files, choose the most project-specific or recently modified one.
   - If no plan file exists, stop and explain that a plan is required before execution.

2. Find the next unfinished unit of work.
   - Scan the plan from top to bottom.
   - If the plan has phases, milestones, steps, or numbered sections, start with the earliest one that contains unchecked work.
   - If there is a Phase 0, Step 0, Foundation, Setup, Baseline, or similar first section and it is not complete, execute that first.
   - Skip sections and tasks that are already checked off.
   - Treat the next unchecked checkbox task as the primary task.
   - Execute only that one next unchecked task. Do not continue into later tasks, later phases, or unrelated cleanup.
   - If the selected task is too broad to finish as one reviewable change, stop and propose the smallest concrete slice for user approval.

3. Read the product requirements before implementation.
   - Prefer `PRD.md`, product specs, requirements docs, issue descriptions, or acceptance criteria in the repo.
   - Extract the relevant goals, non-goals, acceptance criteria, safety boundaries, and demo expectations.
   - If requirements are missing, proceed only when the selected plan task is clear and low risk; otherwise stop and ask for the missing requirement.

4. Spin up subagents before implementation.
   - Start one developer subagent to work on the selected task. Give the developer agent a clear implementation responsibility and expected deliverables.
   - Start one reviewer subagent to review the implementation for bugs, regressions, tests, maintainability, and missed edge cases.
   - Start one product/PM/BA subagent to continuously compare the work against the product requirements, acceptance criteria, user value, scope, and non-goals.
   - Tell every subagent the selected plan task, relevant requirement excerpts, expected deliverables, and any files or areas they own.
   - Make clear that subagents must not revert unrelated user changes.

5. Coordinate the implementation.
   - Do the critical-path work locally while subagents work in parallel.
   - Integrate useful subagent output into one coherent implementation.
   - Keep the change scoped to the selected plan task unless a small supporting edit is necessary to make it work.
   - Preserve existing project conventions, architecture, naming, formatting, and package-manager choices.

6. Verify the work.
   - Run the most relevant tests, builds, linters, type checks, smoke checks, or manual validation for the changed area.
   - If tests cannot be run, explain exactly why.
   - Use the reviewer subagent's findings to fix real issues before finishing.
   - Use the product/PM/BA subagent's findings to correct scope drift or requirement gaps before finishing.

7. Update the plan.
   - Check off only the tasks that are genuinely complete.
   - Do not mark a whole phase complete unless every required task in that phase is complete.
   - Add a short note under the completed task only if it clarifies important implementation details, test evidence, or a known follow-up.
   - Leave unfinished or blocked tasks unchecked and add a concise blocker note when useful.

8. Final response.
   - State which plan task was executed.
   - Summarize the implementation in a few bullets.
   - List verification performed and any failures or skipped checks.
   - Mention plan updates made.
   - Call out remaining blockers, if any.
   - Stop and wait for user review before starting another task.

Execute exactly one selected task, then stop for user review. Do not continue through the rest of the plan without an explicit follow-up instruction.
