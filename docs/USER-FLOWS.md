# User Flows & Journeys
Last updated: March 23, 2026  
Version: 1.0  
Reference: architecture.md (sections 3.1, 3.2, 6.2)

This file documents the end-to-end user journeys for the Payroll SaaS platform.  
All flows follow the **Trial-First with Immediate Payment** model (Option 2): payment is required upfront, but full access is granted immediately with a 7-day money-back guarantee.

## 1. First-Time Registration & Onboarding Flow

**Goal**: New user signs up, pays, creates organization, and reaches the dashboard with full access.

1. User lands on homepage[](https://theniyiconsult.com.ng)
   - Sees "Get Started" / "Sign Up" CTA
2. Clicks Sign Up → enters email + password (or Google SSO if implemented later)
   - Email verification email sent (required before proceeding)
3. User verifies email → redirected to Plan Selection page
4. User chooses plan (Essential or Professional)
   - Sees clear comparison table + "7-day full refund guarantee if not satisfied"
5. Clicks "Start Trial" or "Subscribe"
   - Redirected to Paystack checkout (card, bank transfer, USSD, mobile money)
   - Payment is processed **immediately** (charge or authorization hold)
6. Payment success
   - Paystack redirects to success URL (/subscription/callback)
   - Backend:
     - Creates/updates subscription record (status = active)
     - Sets trial_end_date = now + 7 days
     - Sets refund_eligible_until = now + 7 days
     - Creates organization record (type = 'organization' or 'personal')
     - Initializes tenant database
     - Attaches user as owner (organization_users table)
     - Sets current_tenant_id in session/user meta
7. Redirects to **/dashboard** (tenant-scoped)
   - Full feature access unlocked immediately
   - Dashboard shows:
     - Organization name & type
     - Trial countdown ("7 days remaining – full refund if you cancel")
     - Plan details
     - Quick stats (0 employees so far)
     - CTAs: "Add Employee", "Run Payroll", "View Settings"

**Key rule**: No dashboard access is granted before successful payment.

---

## 2. Dashboard & Core Usage Flow (Post-Payment)

**Goal**: Authenticated user uses the product with full (trial) or restricted (post-trial) access.

1. User visits https://theniyiconsult.com.ng/dashboard (or auto-redirect after payment)
   - Middleware checks:
     - User authenticated?
     - Current tenant set?
     - Subscription active or within trial window?
2. If checks pass → full dashboard loads
   - Shows:
     - Current organization switcher (if user has multiple orgs)
     - Subscription status + trial countdown (if applicable)
     - Employee count vs plan limit
     - Quick actions: Add Employee, Run Payroll, View Payslips
     - Banner if near/at limit: "Upgrade to add more employees"
3. User adds employees (within plan limit)
   - Form: name, bank, salary, deductions, etc.
   - Saved to tenant DB
4. User runs payroll
   - Select period → review draft → finalize
   - Billing guard checks subscription → allows finalization if active/trial
   - Generates payslips, updates payroll_run status
5. User views payslips / reports
   - Download PDF, email to employees, export CSV
6. If free/trial limit hit
   - Block write actions (e.g., add employee > limit, finalize payroll after expiry)
   - Show upgrade CTA

**Personal tenant restrictions** (type = 'personal'):
- Hide team management, bulk actions, manager approvals
- Show only self-employee record, own payslips, self-tax calculator

---

## 3. Cancel & Refund Flow (Within 7 Days)

1. User goes to Settings → Subscription → Cancel Subscription
2. Confirms cancellation
   - Backend:
     - Sets subscription status = canceled
     - If within refund_eligible_until → trigger refund via Paystack API
     - Sets organization billing_status = canceled
     - Keeps tenant DB accessible (read-only mode)
3. Refund processed (minus Paystack fees if disclosed)
   - User receives confirmation email
   - Read-only access remains (view historical payrolls/payslips)

---

## 4. Post-Trial / Failed Payment Flow

1. Trial ends (day 7) and no further payment
   - billing_status → expired_trial
   - Block payroll finalization & new employee creation
   - Allow read-only access (view old data)
   - Show prominent "Upgrade to continue" banner
2. Future billing fails
   - billing_status → grace (short grace period)
   - After grace → suspended
   - Notifications sent
   - Read-only mode enforced

---

## 5. Multi-Organization Switcher Flow

1. User belongs to multiple organizations
2. Navbar shows organization dropdown
3. Select different org → update current_tenant_id in session/user
4. Page reloads with new tenant context
   - All data, limits, features scoped to selected tenant

---

## Summary Rules

- Dashboard access = **after** successful payment confirmation
- Full features = active subscription or within 7-day trial
- No pre-payment dashboard preview or limited mode
- Read-only mode = post-cancellation / post-expiry / suspended
- All flows are tenant-aware (middleware sets context)

Last updated: March 23, 2026