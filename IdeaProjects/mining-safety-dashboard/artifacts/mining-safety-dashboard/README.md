# Mining Hazard Reporting and Corrective-Action Monitoring System

An interactive mining Health & Safety prototype for recording hazards and near-misses, ranking risk, assigning corrective actions and making overdue or repeated safety issues visible.

This project was created as an application-ready prototype for the **Newmont PNG Industrial Trainee Program – Health & Safety** pathway. It demonstrates a practical safety reporting workflow: capture the observation, assess the risk, assign an action, monitor completion and escalate when controls are not closed on time.

## What the dashboard includes

- Hazard and near-miss reporting
- Hazard type and work-area classification
- Likelihood and consequence scoring
- Automatic risk rating
- Existing controls and corrective action capture
- Responsible person, due date and completion status
- Risk matrix with severity filtering
- Open corrective-action queue
- Overdue-action visibility
- Repeated hazard detection
- Incident trends by work area
- High-risk category summary
- Simple alert and escalation actions
- Interview-ready project readout

## Risk method

The prototype uses a simple five-by-five risk matrix:

```text
risk score = likelihood × consequence
```

Risk bands are:

- 1–4: Low
- 5–9: Moderate
- 10–16: High
- 17–25: Critical

The score is a screening tool for prioritisation. A real site implementation should align the matrix with the operation's approved risk standard, critical controls and escalation protocol.

## Run it in IntelliJ IDEA

### Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- IntelliJ IDEA with the Node.js plugin enabled

### Install and start

From the extracted project root:

```bash
corepack enable
pnpm install
pnpm --filter @workspace/mining-safety-dashboard run dev
```

Open [http://localhost:5174](http://localhost:5174).

The Vite configuration defaults to port `5174` and base path `/` outside Replit, so no Replit-specific environment variables are required for local development.

### Compile the production build

```bash
pnpm --filter @workspace/mining-safety-dashboard run typecheck
pnpm --filter @workspace/mining-safety-dashboard run build
```

The compiled static files are written to:

```text
artifacts/mining-safety-dashboard/dist/public
```

To preview the compiled build locally:

```bash
pnpm --filter @workspace/mining-safety-dashboard run serve
```

## Publish to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Build mining safety hazard reporting dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mining-safety-dashboard.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repository name with your GitHub details.

Do not commit `.env` files, passwords, API keys or other credentials.

## Suggested interview explanation

> “I designed this prototype around the full safety reporting loop. It does not stop at logging a hazard: it calculates a risk rating, makes the responsible person and due date visible, highlights overdue and repeated hazards, and gives supervisors a simple escalation path. The model is intentionally transparent so the matrix and thresholds can be aligned with the operation’s approved HSE standard.”

## Scope and limitations

This is a local-state prototype with realistic sample records. Data resets when the page is refreshed. It does not yet include authentication, multi-user permissions, a database, attachments, audit history or a production notification service. A production version should add those controls and connect escalation to the site's approved incident-management process.
