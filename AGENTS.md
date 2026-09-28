# Project guidance

## Current priority: user-visible frontend work

This website is still in progress. Prioritize implementing and improving what users can see and interact with in the frontend, including lesson content, graphs, layout, navigation, and accessibility. Supporting code is in scope when it directly enables those visible improvements.

Defer unit tests for now: do not spend time adding, expanding, maintaining, or routinely running unit tests unless the user explicitly requests them. Do not add test infrastructure or coverage targets during this phase. Preserve existing tests; this guidance does not authorize deleting them.

Use focused browser checks to confirm the changed frontend works and looks correct. Run build or type checks when needed to catch broken implementation, without expanding the task into test-suite work. Revisit unit testing when the user asks or the project moves out of this in-progress phase.
