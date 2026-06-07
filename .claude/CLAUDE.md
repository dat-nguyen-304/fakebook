# Fakebook — Development Workflow

## Jira + GitHub conventions

- **Jira project:** FAK (`nguyenphatdat3004.atlassian.net`)
- **GitHub repo:** `dat-nguyen-304/fakebook`
- **Assignee:** always Đạt Nguyễn (`accountId: 61f02d93aeaacb0072f99da8`)

---

## Starting a ticket

When told "I'm starting FAK-N":

1. Create and push branch:
   - Bug → `fix/FAK-N`
   - Everything else → `feature/FAK-N`
2. Transition the Jira ticket to **In Progress**.

---

## Opening a Pull Request

When asked to open a PR:

1. Push the current branch if not already pushed.
2. Create the GitHub PR with:

**Title:** `[FAK-N] <same summary as the Jira ticket>`

**Body:**
```
## Summary
- <bullet points describing what changed and why>

## Jira
[FAK-N](https://nguyenphatdat3004.atlassian.net/browse/FAK-N)
```

3. Transition the Jira ticket to **In Review**.
