# Payroll SaaS Architecture and Strategy (Nigeria)

## 1. Executive Summary

This document defines the latest architecture and operating model for the Payroll SaaS platform.

Product direction:
- Payroll-first, compliance-focused software for Nigerian SMEs.
- Multi-tenant architecture with centralized billing and isolated tenant payroll data.
- Subscription onboarding uses Trial-First with Immediate Payment (Option 2 in latest decision).
- Full access starts immediately after payment, with a 7-day money-back guarantee.
- Trial users are restricted to view-only reports with trial watermarking.

Business direction:
- Launch with core payroll and statutory compliance only.
- Keep HR modules out of launch scope to reduce complexity and improve adoption.
- Expand in phases (leave, self-service, analytics, API, mobile integrations).

---

## 2. Product Positioning and Market Context

### 2.1 Market Reality

Most Nigerian payroll tools are bundled with broad HR suites. This creates pricing and UX friction for SMEs that only need payroll and compliance.

### 2.2 Our Differentiation

- Payroll-first simplicity: run payroll quickly, with low setup overhead.
- Compliance-first execution: built around NTA 2025 and statutory deductions.
- Nigerian-first operations: local regulations, local support expectations, local payment rails.
- Modular future: HR capabilities become optional paid modules after payroll product-market fit.

### 2.3 ICP (Ideal Customer Profile)

- Nigerian businesses with 1-150 employees.
- Teams using spreadsheets or fragmented manual payroll workflows.
- Organizations worried about tax compliance risk and filing errors.

---

## 3. Subscription and Onboarding Model

## 3.1 Chosen Model: Trial-First with Immediate Payment

We are using a payment-first flow with a 7-day refund guarantee.

### 3.1.1 Billing Assumptions

- This is implemented as a charge-first subscription with manual refund on cancellation within the 7-day window.
- Paystack delayed-trial behavior is treated as an implementation constraint, so guarantee logic is enforced in our billing domain (trial_end_date + refund_eligible_until).

Why:
- Better initial revenue quality than pure freemium.
- Users still feel protected because they can cancel and request refund within 7 days.
- Full functionality from day one improves perceived product value.

### 3.2 Detailed Flow (Source of Truth)

1. User registers (email, password).
2. User selects plan (Essential or Professional).
3. User enters payment details through Paystack.
4. Payment confirmation received.
5. System creates subscription in central DB with:
   - status = active
   - trial_end_date = now + 7 days
   - refund_eligible_until = now + 7 days
6. System creates organization and initializes tenant database.
7. User lands in dashboard with full feature access.
8. User can run full payroll workflow, including payroll finalization.
9. If canceled within 7 days:
   - refund workflow is executed (minus disclosed fees if applicable)
   - subscription status becomes canceled
   - tenant remains accessible as read-only
10. After day 7:
   - refund_eligible_until is cleared
   - normal recurring billing continues
11. On future billing failure:
   - payroll finalization is blocked
   - notifications and grace period are triggered
   - billing_status becomes suspended after grace period

### 3.3 Access Gate Enforcement

- Verified users are routed through onboarding continuation before dashboard access.
- Dashboard access is allowed only after successful payment and active subscription state.
- Users without successful payment are redirected to plan selection and checkout.

---

## 4. Pricing Model

## 4.1 Launch Plans

Use one naming set consistently across product, sales, and code:

- Essential: NGN 800 per employee per month, billed annually, staff range 1-50.
- Professional: NGN 850 per employee per month, billed annually, staff range 51+.

Plan band rules:
- Essential checkout blocks employee_count above 50.
- Professional checkout blocks employee_count below 51.
- Validation messages must clearly instruct users to choose the correct plan.

Included in both:
- Employee records
- Payroll processing
- PAYE/Pension/NHF/NSITF deductions
- NTA 2025 support
- Auto-updating tax tables
- Payslip generation
- Standard payroll reports

Professional-only additions:
- Advanced analytics and custom reports
- API access
- Priority phone support
- Dedicated account support
- Bulk employee upload

## 4.2 Pricing Governance Notes

The current Professional per-employee rate is higher than Essential. Keep this only if Professional clearly includes premium operational value (support, analytics, API, account support).

If growth pricing resistance appears, switch to volume discount pricing in a later revision.

---

## 5. High-Level Architecture

## 5.1 Multi-Tenant Model

Central DB (shared):
- users
- organizations
- organization_users
- subscription_plans
- subscriptions
- billing_events
- payment_attempts

Tenant DB (per organization):
- employees
- departments
- payroll_runs
- payroll_items
- payroll_settings
- salary_components
- deduction_rules
- tax_tables
- payroll_run_snapshots

Design goals:
- Strong tenant isolation for payroll/security.
- Centralized billing and entitlement decisions.
- Auditability for compliance and dispute handling.

### 5.2 Personal Account Tenant Constraints

If personal accounts are enabled, treat them as lightweight tenants with strict limits:
- No team member invitation or multi-user roles
- No custom domain support
- Single-workspace scope with capped usage limits
- Same billing guard rules for finalization/disbursement actions

### 5.3 Organization Access Model (MVP)

- Each organization uses distinct login credentials at launch.
- No cross-organization switcher is included in MVP.
- Organization-level isolation is enforced by tenant_id and scoped authorization checks.
- Multi-organization user switching is deferred to a later enterprise phase.

---

## 6. Billing and Access Control Architecture

## 6.1 Central Billing Status Model

Track both subscription status and operational billing status.

Recommended status fields:
- subscriptions.status: pending | active | canceled | past_due | failed
- organizations.billing_status: active | grace | suspended | canceled

Recommended subscription columns:
- trial_end_date
- refund_eligible_until
- next_billing_date
- canceled_at
- grace_period_ends_at
- paystack_reference
- paystack_customer_code
- paystack_subscription_code

## 6.2 Entitlement Guard (Critical)

Payroll finalization must call a Billing Access Guard before execution.

Guard rules:
- allow if billing_status = active
- allow with warning if billing_status = grace
- block if billing_status = suspended or canceled
- block if subscription status is failed/past_due and grace expired

Behavior when blocked:
- allow read-only access to historical payroll
- prevent finalization/disbursement actions
- show clear remediation CTA in UI

### 6.4 Trial Entitlement Controls

- Trial users can process payroll core workflows.
- Trial users cannot export reports.
- Trial report screens are view-only and display visible trial watermarking.
- Export and distribution reporting controls are unlocked on paid active subscriptions.

### 6.5 Post-Failure Retention and Notifications

- Renewal failure triggers a 7-day grace period.
- At grace expiry, account moves to suspended read-only mode.
- A deletion-risk notification is issued after suspension, with a 30-day warning milestone.
- Non-renewed subscribers may retain read-only access up to 90 days, after which data lifecycle policy applies.
- Data export or migration support after grace can be offered as a paid operational service.

### 6.3 Billing State Transition Matrix

| Current State | Trigger | Next State | Finalization | Notes |
| --- | --- | --- | --- | --- |
| `pending` | `charge.success` | `active` | allow | Initial successful payment on signup |
| `active` | recurring charge fails | `grace` | allow with warning | Start grace window and notify org owner |
| `grace` | charge recovered before grace end | `active` | allow | Clear grace markers and continue billing |
| `grace` | grace period expires without payment | `suspended` | block | Tenant becomes read-only for write/finalize actions |
| `active` | user cancels within guarantee window and refund approved | `canceled` | block | Refund issued and tenant remains read-only |
| `active` | user cancels after guarantee window | `canceled` | block | No refund; access remains read-only |
| `suspended` | payment recovered (manual or automatic) | `active` | allow | Restore write/finalize actions |
| `canceled` | new paid subscription started | `active` | allow | New subscription record linked to same tenant |

Transition rules:
- All transitions must be idempotent and event-driven.
- Out-of-order webhooks must not regress a newer billing state.
- `canceled` is terminal for a subscription record but not for the tenant.

---

## 7. Event-Driven Payment Lifecycle

## 7.1 Paystack Events to Handle

- charge.success
- invoice.payment_failed (or equivalent recurring failure signal)
- subscription.create
- subscription.disable (if canceled from gateway)

## 7.2 Required Idempotency and Audit

- Store every webhook event in billing_events.
- Use unique event keys/reference checks to avoid double processing.
- Log payment attempts with status, amount, reference, and failure reason.

## 7.3 Refund Workflow

- Validate refund_eligible_until before approval.
- Record refund request and refund transaction IDs.
- Apply pre-disclosed non-recoverable deductions before final refund payout.
- Deductions may include Paystack fees, bank charges, stamp duties, COT, and related transaction costs.
- Move organization to read-only if canceled.

---

## 8. Data Model Updates (Central)

## 8.1 organizations

Required/updated fields:
- billing_status
- billing_status_updated_at
- read_only_mode (boolean)
- suspended_at (nullable)

## 8.2 subscriptions

Required/updated fields:
- organization_id
- plan_id
- status
- trial_end_date
- refund_eligible_until
- next_billing_date
- grace_period_ends_at
- canceled_at
- paystack_reference
- paystack_customer_code
- paystack_subscription_code
- amount_paid
- currency

## 8.3 billing_events (new)

Suggested fields:
- id
- organization_id
- subscription_id
- event_type
- provider (paystack)
- provider_event_id
- reference
- payload_json
- processed_at
- created_at

## 8.4 payment_attempts (new)

Suggested fields:
- id
- organization_id
- subscription_id
- reference
- amount
- status
- attempted_at
- error_code
- error_message

---

## 9. Tenant Payroll Engine and Compliance

## 9.1 Shared Engine, Tenant-Specific Rules

Payroll computation engine remains shared in app code.
Each tenant supplies its own configuration data for calculations.

Per-tenant configurable dimensions:
- allowances and deductions
- overtime policy
- proration logic
- tax table version
- rounding and net pay floors

## 9.2 Compliance Controls

- Effective dating for tax/rule tables.
- Immutable payroll snapshots per run.
- Payslips tied to snapshot ID.
- No retroactive mutation of closed payroll runs.

## 9.3 Payroll Distribution Controls

- Platform supports bulk payslip emailing directly to individual employees after payroll finalization.
- Delivery status, retries, and failure logs are recorded for operations visibility.
- Manual download-and-send remains optional fallback, not primary workflow.

---

## 10. Phased Technical Roadmap

## 10.1 Phase 1 (Launch)

Scope:
- core payroll processing
- NTA 2025 and statutory deductions
- trial-first immediate payment onboarding
- billing guard for payroll finalization
- refunds within 7-day guarantee

## 10.2 Phase 2

Scope:
- state-aligned annual returns reporting packs
- filing-readiness checks and reconciliation reports
- state filing calendar reminders and compliance alerts
- leave management
- employee self-service portal
- stronger dunning automation and billing analytics

## 10.3 Phase 3

Scope:
- performance/recruitment modules (optional add-ons)
- richer role and approval workflows

## 10.4 Phase 4

Scope:
- advanced analytics
- partner API and integrations
- data warehouse pipeline

## 10.5 Phase 5

Scope:
- mobile app
- USSD and WhatsApp-assisted operations

---

## 11. GTM and Operational Strategy Alignment

Messaging pillars:
- Payroll done right, Nigerian tax compliant.
- Built for NTA 2025.
- No HR complexity at launch.

Channels:
- digital SME acquisition
- accounting-firm partnerships
- referral loops
- compliance education content

---

## 12. Implementation Checklist (Immediate)

1. Update central schema for trial/refund/billing lifecycle fields.
2. Add Billing Access Guard middleware/service for payroll finalization.
3. Implement webhook idempotency and billing event store.
4. Add read-only mode behavior for canceled/suspended organizations.
5. Build refund workflow and admin controls.
6. Align UI copy and plan names to Essential/Professional only.
7. Remove remaining legacy references to free-tier-first onboarding.
8. Add tests for:
   - trial window behavior
   - refund eligibility edge cases
   - payment failure and grace expiration
   - payroll finalization blocking rules
9. Enforce idempotent refund requests per subscription to prevent double refunds.

---

## 13. Key Risks and Mitigations

Risk: payment-first onboarding may increase signup drop-off.
Mitigation: simplify checkout, communicate 7-day guarantee clearly, optimize mobile checkout flow.

Risk: billing webhooks can be retried/out-of-order.
Mitigation: idempotent event processing + deterministic state transitions.

Risk: support load from refund and billing disputes.
Mitigation: strong audit trail, transparent fee policy, clear user timelines.

Risk: inconsistent plan naming across product and docs.
Mitigation: enforce one canonical plan catalog in DB and shared UI constants.

---

## 14. Decision Log

Current strategic decision:
- Keep launch scope payroll-only and compliance-first.
- Use Trial-First with Immediate Payment, 7-day guarantee.
- Keep tenant data isolated, billing centralized.

Status:
- Architecture approved for implementation.

Last updated: March 23, 2026
Version: 2.1
