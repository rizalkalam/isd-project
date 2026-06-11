---
status: testing
phase: 02-borrowing-discovery
source: [02-01-PLAN.md, 02-02-PLAN.md, 02-03-PLAN.md]
started: "2026-06-11T17:10:00.000Z"
updated: "2026-06-11T17:10:00.000Z"
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running containers. Run `docker compose up --build`. Backend starts,
  seed runs without error, and GET /health returns {"status": "ok"}.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running containers. Run `docker compose up --build`. Backend starts, seed runs without error, and GET /health returns {"status":"ok"}.
result: [pending]

### 2. Search by Title
expected: On the Discovery page (/student/discovery), type a book title (e.g. "1984") in the search bar. Results appear showing matching books with cover, title, author, and an Available/Out of Stock badge.
result: [pending]

### 3. Real-Time Availability Badge
expected: Books with copies show a green "Available" badge. A book with no copies (or all copies borrowed) shows a red "Out of Stock" badge. The badge reflects the live database count.
result: [pending]

### 4. Borrow Button — Available Book
expected: An available book shows a "Borrow" button at the bottom of its card. Clicking it submits a request and shows a green "Request submitted!" banner at the top of the page.
result: [pending]

### 5. Borrow Button — Unavailable Book
expected: A book with 0 available copies shows a greyed-out "Unavailable" button that cannot be clicked. No borrow request is sent.
result: [pending]

### 6. Librarian Views Loan Requests
expected: On /admin/loans, the librarian sees a table of all loan requests with columns: Book, Student email, Status badge, Requested date, and action buttons.
result: [pending]

### 7. Librarian Approves a Loan
expected: A PENDING loan shows an "Approve" button. Clicking it immediately updates the row's status badge to APPROVED. The next action button changes to "Mark Active".
result: [pending]

### 8. Librarian Rejects a Loan
expected: A PENDING loan shows a red "Reject" button. Clicking it updates the row's status to REJECTED. The book's available_copies count increases by 1 (visible on the Discovery page).
result: [pending]

### 9. Full Loan Lifecycle — Return
expected: Approve a loan → Mark Active → Mark Returned. Each step updates the status badge in the table. After RETURNED, the book's availability is restored on the Discovery page.
result: [pending]

### 10. Search by Author
expected: Typing an author name in the Discovery search bar returns matching books.
result: [pending]

### 11. Search by ISBN
expected: Typing a full or partial ISBN in the Discovery search bar returns the matching book.
result: [pending]

### 12. Double-Borrow Prevention
expected: With only 1 copy of a book available, submit two borrow requests (as two different students). Only one succeeds; the second gets an error message (could not request — no copies available). The availability shows 0 after the first borrow.
result: [pending]

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0

## Gaps

[none yet]
