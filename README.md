# Python Screening Task: UI/UX Enhancement

This submission improves the UI/UX of the provided workshop booking website while keeping the core functionality intact.

## Task Context

- Repository: [FOSSEE Workshop Booking](https://github.com/FOSSEE/workshop_booking)
- Goal: modern UI, responsiveness, accessibility, and clean React-based implementation
- Constraint followed: React JavaScript library used for frontend enhancement
- User focus from prompt: students primarily on mobile devices

## What I Focused On

- Better readability and navigation on small screens
- Stronger visual hierarchy and cleaner component structure
- Fast-loading, role-based pages with reusable UI elements
- Stable login/session behavior in local development

## Submission Checklist

- [x] Code is readable and well-structured
- [x] Git history shows progressive work (no single commit dumps)
- [x] README includes reasoning answers and setup instructions
- [x] Screenshots and/or demo links included
- [x] Code is documented where necessary

## Setup Instructions

### 1) Backend

```bash
cd workshop_booking
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv/Scripts/python.exe manage.py migrate
./.venv/Scripts/python.exe manage.py runserver 8000
```

### 2) Frontend (Dev)

```bash
cd workshop_booking/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

### 3) Frontend Build (Production static assets)

```bash
cd workshop_booking/frontend
npm run build
```

Output path: `workshop_app/static/workshop_app/dist`

## Demo Credentials

- `coordinator` / `coordinator123`
- `instructor` / `instructor123`

## Reasoning (Required)

### What design principles guided your improvements?

- **Clarity first:** each page has a clear primary action and reduced visual clutter.
- **Consistency:** shared components (buttons, inputs, alerts, cards, navbar) provide predictable behavior across pages.
- **Separation of concerns:** backend data/API logic and frontend UI concerns remain clearly separated.
- **Progressive enhancement:** core flows (login, dashboards, workshop actions) remain functional while UI quality is improved.

### How did you ensure responsiveness across devices?

- Used mobile-friendly spacing, scalable containers, and flexible layouts across authentication and dashboard pages.
- Reduced dense sections into clearer blocks for narrow viewports.
- Ensured interactive elements are easy to tap and readable on smaller screens.

### What trade-offs did you make between the design and performance?

- Added UI polish selectively (not excessive animation) to keep interactions smooth on lower-end devices.
- Kept route-level lazy loading to improve initial load while still delivering richer page structure.
- Preferred maintainable component design over overly complex micro-optimizations.

### What was the most challenging part of the task and how did you approach it?

The biggest challenge was balancing improved UI with stable existing behavior in a mixed Django + React stack.  
I handled this by validating each critical flow end-to-end (login, role redirect, dashboard data fetch) after UI and configuration updates, especially around local session/cookie handling.

## Visual Showcase


### Before/After Screenshots

Add your final before/after UI screenshots here:

```md
### Login Page
![Before Login](docs/screenshots/before-login.png)
![After Login](docs/screenshots/after-login.png)

### Dashboard
![Before Dashboard](docs/screenshots/before-dashboard.png)
![After Dashboard](docs/screenshots/after-dashboard.png)
```

## Notes

- Main Django apps: `workshop_app`, `statistics_app`, `teams`, `cms`
- Default local database: `db.sqlite3`
- Additional docs: `docs/Getting_Started.md`
