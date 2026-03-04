# Payroll SaaS Architecture & Implementation Guide

## Executive Summary

This document outlines the architectural approach for building a **multi-tenant SaaS payroll application** with subscription-based billing. The system uses **Laravel 12**, **React/Inertia.js** for the frontend, **Stancl Tenancy** for multi-tenancy, and **Paystack** for payment processing (optimized for Nigeria & African markets).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Subscription Models Comparison](#subscription-models-comparison)
3. [Recommended Approach](#recommended-approach)
4. [User Flow](#user-flow)
5. [Database Structure](#database-structure)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Current Project Status](#current-project-status)
8. [Tech Stack](#tech-stack)

---

## Architecture Overview

### Core Concept: Multi-Tenant with Centralized Billing

```
┌─────────────────────────────────────────────────────┐
│         CENTRAL DATABASE (Shared)                   │
├─────────────────────────────────────────────────────┤
│ • users (all registered users)                      │
│ • organizations (company records)                   │
│ • subscriptions (Paystack subscriptions)            │
│ • organization_users (user-org relationships)       │
│ • subscription_plans (available plans)              │
└─────────────────────────────────────────────────────┘
              ↓                    ↓                    ↓
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
    │ TENANT DB 1      │ │ TENANT DB 2      │ │ TENANT DB N      │
    │ (Acme Corp)      │ │ (TechStart Inc)  │ │ (Other Co)       │
    ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
    │ • employees      │ │ • employees      │ │ • employees      │
    │ • payroll_runs   │ │ • payroll_runs   │ │ • payroll_runs   │
    │ • payroll_items  │ │ • payroll_items  │ │ • payroll_items  │
    │ • leaves         │ │ • leaves         │ │ • leaves         │
    │ • deductions     │ │ • deductions     │ │ • deductions     │
    │ • departments    │ │ • departments    │ │ • departments    │
    └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Key Principle:** Each organization (tenant) has its own isolated database. This ensures:
- Data security & compliance (critical for payroll)
- Performance isolation between organizations
- Easy data backup per client
- GDPR compliance (data segregation)

---

## Subscription Models Comparison

### Option 1: Subscription First (Traditional SaaS)

**Flow:**
1. User registers (FREE account)
2. User **must** subscribe before creating organization
3. Organization created → Tenant database initialized
4. User lands in dashboard

**Pros:**
- Revenue captured immediately
- Clear funding model
- Committed users only

**Cons:**
- High friction (payment required upfront)
- Users haven't seen value yet
- Lower conversion rates
- Higher bounce rate

---

### Option 2: Free Tier → Upgrade Later (Recommended ✅)

**Flow:**
1. User registers (FREE account in central DB)
2. User creates organization → Auto-assigned to **Free Plan**
3. Tenant database initialized automatically
4. User starts adding employees (within free tier limits)
5. When limit hit → Prompted to upgrade
6. User selects plan → Redirected to Paystack checkout
7. Payment confirmed → Limits increased

**Pros:**
- ✅ Lower friction (start immediately)
- ✅ User sees value before paying
- ✅ Better conversion (proven value)
- ✅ Can try payroll before committing (critical feature)
- ✅ Natural upsell moment (hit limit)
- ✅ Freemium model proven at scale

**Cons:**
- Need to enforce tier limits in code
- More usage of resources for free users
- Potential abuse of free tier

**Verdict:** **This is the industry standard for SaaS. Recommended.**

---

## Recommended Approach

### Architecture Decision

**We are implementing Option 2: Free Tier with Upgrades**

### Subscription Tier Structure

```
┌──────────────────────────────────────────────────────────┐
│ TIER: Free                                               │
├──────────────────────────────────────────────────────────┤
│ Price: $0/month                                          │
│ Employees: 5                                             │
│ Managers: 1                                              │
│ Payroll Runs: Unlimited                                  │
│ Support: Email                                           │
│ Features: Basic payroll calculation                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ TIER: Professional                                       │
├──────────────────────────────────────────────────────────┤
│ Price: $99/month                                         │
│ Employees: 50                                            │
│ Managers: 5                                              │
│ Payroll Runs: Unlimited                                  │
│ Support: Email + Chat                                    │
│ Features: Advanced payroll, reports, compliance          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ TIER: Enterprise                                         │
├──────────────────────────────────────────────────────────┤
│ Price: Custom                                            │
│ Employees: Unlimited                                     │
│ Managers: Unlimited                                      │
│ Payroll Runs: Unlimited                                  │
│ Support: Dedicated support + Training                    │
│ Features: Everything + Custom integrations               │
└──────────────────────────────────────────────────────────┘
```

---

## Tenant-Specific Calculation Strategy

Yes — each tenant (organization) can have its own payroll calculations while still using one shared application codebase.

### How It Works

- The calculation engine is shared in code (single logic pipeline).
- Inputs are tenant-specific (loaded from each tenant database).
- Each organization can configure its own payroll rules without affecting others.

### Per-Tenant Configurable Rules

- Overtime policy (rates, thresholds, weekends/holidays)
- Deductions (PAYE, pension, NHF, NHIS, custom company deductions)
- Allowances and benefits (fixed amount or percentage)
- Proration rules (join date, exits, unpaid leave handling)
- Rounding policy and net-pay floor checks
- Payroll calendar (monthly/biweekly, cut-off dates, pay date)

### Recommended Tenant Tables

In each tenant database, create and use:

- `payroll_settings` (global policy per organization)
- `salary_components` (allowance/deduction component definitions)
- `deduction_rules` (statutory + custom deduction logic)
- `tax_brackets` (country or company-specific tax definitions)
- `payroll_run_snapshots` (serialized rules used for each run)

### Versioning and Auditability (Critical)

To keep payroll history accurate and compliant:

- Rule records should have `effective_from` and optional `effective_to`
- Every payroll run should store a snapshot of all resolved rules/inputs
- Payslips should reference the snapshot used at calculation time
- Later rule changes must not alter historical payroll results

### Outcome

This design gives you both:

- Flexibility (each tenant can model unique company policies)
- Safety (historical payroll remains immutable and auditable)

### Example Calculation Flow (Per Employee)

Use this sequence during each payroll run:

1. Resolve tenant rule set
    - Load active `payroll_settings`, `salary_components`, `deduction_rules`, and `tax_brackets`
    - Select by `effective_from` / `effective_to` for the payroll period

2. Build gross pay
    - `gross = base_salary + allowances + overtime + bonuses`

3. Apply pre-tax deductions
    - `taxable_income = gross - pre_tax_deductions`

4. Compute statutory taxes and mandatory deductions
    - PAYE from tenant tax brackets
    - Pension/NHF/NHIS based on tenant policy and employee eligibility

5. Apply post-tax deductions
    - Loans, cooperatives, penalties, voluntary deductions

6. Compute net pay
    - `net = gross - (pre_tax + tax + mandatory + post_tax deductions)`
    - Apply rounding policy and net-pay floor checks

7. Persist immutable payroll artifacts
    - Save `payroll_items` per employee
    - Save `payroll_run` totals
    - Save `payroll_run_snapshots` with exact rules and resolved values used

### Formula Reference

For communication with product and finance teams:

$$
	ext{Gross Pay} = \text{Base Salary} + \text{Allowances} + \text{Overtime} + \text{Bonuses}
$$

$$
	ext{Net Pay} = \text{Gross Pay} - (\text{Pre-Tax Deductions} + \text{Tax} + \text{Mandatory Deductions} + \text{Post-Tax Deductions})
$$

### Worked Mini Example

- Base salary: ₦400,000
- Allowances: ₦50,000
- Overtime: ₦20,000
- Gross pay: ₦470,000
- Pre-tax deductions: ₦10,000
- Taxable income: ₦460,000
- PAYE + mandatory deductions: ₦95,000
- Post-tax deductions: ₦15,000
- Net pay: ₦350,000

This example should be generated by the same shared engine, but using each tenant's own rule configuration.

---

## User Flow

### Step 1: Registration (Central DB)

```
User → Sign Up Form
       ↓
       Email validation
       ↓
       Create User (central_users table)
       ↓
       Email verification sent
       ↓
       Redirect to Create Organization page
```

**Database:** `central.users`

---

### Step 2: Create Organization (Central DB + Tenant Init)

```
User → "Create Organization" Form
       ├─ Company Name (required)
       ├─ Company Slug (auto-generated or custom)
       ├─ Industry (dropdown, optional)
       └─ Address, Phone, etc.
       ↓
       Validate slug uniqueness
       ↓
       Create Organization record (central_organizations)
       ↓
       Create domain entry (central_domains)
       │  Example: acme-corp.payroll-saas.com
       ↓
       Initialize Tenant Database
       │  1. Create database: tenant_[org_id]
       │  2. Run migrations (employees, payroll, leaves, etc.)
       │  3. Seed initial data (deduction types, payroll rules)
       ↓
       Create OrganizationUser record (owner role)
       ├─ user_id → Organization owner
       ├─ organization_id
       ├─ role → 'owner'
       └─ status → 'active'
       ↓
    Create Subscription record
    ├─ organization_id
    ├─ plan_id → 'free' (default)
    ├─ status → 'active'
    └─ paystack_reference → null (no payment yet)
       ↓
       Redirect to Dashboard
```

**Databases:** `central.organizations`, `central.organization_users`, `central.subscriptions`, `tenant_[org_id].*`

---

### Step 3: Use Dashboard (Tenant DB)

```
User → Dashboard (tenant-aware)
       ├─ See organization info
       ├─ See current plan details
       ├─ See employee count vs. limit
       ├─ See warning if near limit
       └─ Add employees (within limit)
       ↓
       When employees = Free limit:
       │  Display "Upgrade Now" badge
       │  Over limit? Block next employee until upgrade
       ↓
       User clicks "Upgrade"
       └─ Redirect to Plan Selection page
```

**Database:** `tenant_[org_id].*`

---

### Step 4: Subscription Upgrade (Paystack)

```
User → Choose Plan (appears as modal/page)
    ├─ Professional: ₦49,500/month (~$99 USD)
    ├─ Enterprise: Custom quote
    └─ Show feature comparison
    ↓
    Click "Subscribe"
    ↓
    Create Paystack Reference
    │  reference = uniqid() or hash
    │  amount = 4950000 kobo (₦49,500)
    ↓
    Redirect to Paystack Checkout
    ├─ org_id in session/query param
    ├─ metadata with plan_id attached
    ├─ email = organization owner email
    └─ success_url → /subscription/callback
    ↓
    User confirms payment (accepts Paystack form)
    │  - Card
    │  - Mobile Money
    │  - Bank Transfer
    │  - USSD (via Flutterwave)
    ↓
    Payment processed via Paystack
    ↓
    Webhook notification sent to app:
    │  event: 'charge.success'
    │  reference: generated reference
    ↓
    App verifies payment with Paystack API
    │  GET /transaction/verify/{reference}
    ↓
    Update Subscription record:
    ├─ paystack_reference → reference ID
    ├─ paystack_customer_code (if recurring)
    ├─ plan_id → selected plan
    ├─ amount_paid → ₦49,500
    ├─ status → 'active'
    ├─ next_billing_date → +1 month
    └─ created_at
    ↓
    Webhook received + verified → Mark subscription active
    ↓
    Redirect to Dashboard (limits now increased)
```

**Databases:** `central.subscriptions`, Paystack API

---

## Database Structure

### Central Database Schema

```sql
-- Users (All users across all organizations)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    email_verified_at TIMESTAMP,
    two_factor_secret TEXT,
    two_factor_recovery_codes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Organizations (Companies/Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    industry VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    website VARCHAR(255),
    country VARCHAR(2), -- 'NG', 'GH', 'KE', etc.
    paystack_customer_code VARCHAR(255),
    data JSONB, -- Store additional metadata
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Domains (URL mapping to organizations)
CREATE TABLE domains (
    id UUID PRIMARY KEY,
    domain VARCHAR(255) UNIQUE,
    tenant_id UUID REFERENCES organizations(id),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Subscription Plans (Available plans)
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(255), -- 'Free', 'Professional', 'Enterprise'
    slug VARCHAR(255) UNIQUE,
    monthly_price DECIMAL(8,2),
    employee_limit INT,
    manager_limit INT,
    features JSONB, -- Feature flags
    monthly_price_ngn DECIMAL(10,2), -- Price in NGN
    monthly_price_usd DECIMAL(10,2), -- Price in USD (for reference)
    employee_limit INT,
    manager_limit INT,
    features JSONB, -- Feature flags
    paystack_plan_id INT, -- Plan ID from Paystack (if using Paystack plans)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
};

-- Subscriptions (Organization subscriptions)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    plan_id UUID REFERENCES subscription_plans(id),
    paystack_reference VARCHAR(255), -- Paystack transaction reference
    paystack_customer_code VARCHAR(255), -- For recurring charges
    amount_paid DECIMAL(10,2), -- In NGN
    status VARCHAR(50), -- 'pending', 'active', 'canceled', 'failed'
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'mobile_money'
    next_billing_date DATE,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Organization Users (Who can access which org)
CREATE TABLE organization_users (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(50), -- 'owner', 'admin', 'manager', 'accountant', 'employee'
    status VARCHAR(50), -- 'pending', 'active', 'inactive'
    invited_at TIMESTAMP,
    joined_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(user_id, organization_id)
);
```

### Tenant Database Schema (Per Organization)

```sql
-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    position VARCHAR(255),
    employment_type VARCHAR(50), -- 'full_time', 'part_time', 'contract'
    hire_date DATE,
    base_salary DECIMAL(10,2),
    currency VARCHAR(3), -- 'USD', 'EUR', 'GBP'
    status VARCHAR(50), -- 'active', 'inactive', 'terminated'
    bank_account JSONB, -- Bank details for payment
    tax_info JSONB, -- Tax ID, withholding info
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    manager_id UUID REFERENCES employees(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Payroll Runs
CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY,
    period_start DATE,
    period_end DATE,
    status VARCHAR(50), -- 'draft', 'pending_review', 'approved', 'paid', 'failed'
    total_gross DECIMAL(12,2),
    total_net DECIMAL(12,2),
    total_deductions DECIMAL(12,2),
    total_taxes DECIMAL(12,2),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Payroll Items (Individual salary line items)
CREATE TABLE payroll_items (
    id UUID PRIMARY KEY,
    payroll_run_id UUID REFERENCES payroll_runs(id),
    employee_id UUID REFERENCES employees(id),
    gross_amount DECIMAL(10,2),
    net_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    deductions_total DECIMAL(10,2),
    status VARCHAR(50), -- 'pending', 'verified', 'paid', 'failed'
    payment_reference VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Deductions (Tax, insurance, etc.)
CREATE TABLE deductions (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    deduction_type_id UUID REFERENCES deduction_types(id),
    amount DECIMAL(10,2),
    percentage DECIMAL(5,2),
    effective_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
};

-- Deduction Types (Static list: income tax, health insurance, etc.)
CREATE TABLE deduction_types (
    id UUID PRIMARY KEY,
    name VARCHAR(255), -- 'Income Tax', 'Health Insurance', etc.
    code VARCHAR(50),
    category VARCHAR(50), -- 'tax', 'benefits', 'voluntary'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Leaves
CREATE TABLE leaves (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    leave_type_id UUID REFERENCES leave_types(id),
    start_date DATE,
    end_date DATE,
    days_taken INT,
    status VARCHAR(50), -- 'pending', 'approved', 'rejected'
    reason TEXT,
    approved_by UUID REFERENCES employees(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Leave Types
CREATE TABLE leave_types (
    id UUID PRIMARY KEY,
    name VARCHAR(255), -- 'Annual Leave', 'Sick Leave', etc.
    code VARCHAR(50),
    annual_entitlement INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [x] Setup Laravel 12 + Tenancy
- [x] Setup React/Inertia.js frontend
- [x] Create User registration with Fortify
- [ ] Create Organization model & migration
- [ ] Create user-organization relationship (OrganizationUser)
- [ ] Create SubscriptionPlan model
- [ ] Create Subscription model & migration
- [ ] Create "Create Organization" form
- [ ] Auto-create Free plan subscription on org creation

### Phase 2: Tenant Initialization (Weeks 3-4)
- [ ] Setup tenant database auto-creation
- [ ] Create tenant migrations (employees, payroll, leaves, etc.)
- [ ] Create tenant database seeders
- [ ] Setup domain routing (acme.payroll-saas.com)
- [ ] Create tenant-aware middleware
- [ ] Create "Switch Organization" feature

### Phase 3: Payroll Core Models (Weeks 5-6)
- [ ] Create Employee model
- [ ] Create Department model
- [ ] Create PayrollRun model
- [ ] Create PayrollItem model
- [ ] Create Deduction/DeductionType models
- [ ] Create Leave/LeaveType models
- [ ] Setup relationships between models

### Phase 4: Payroll Logic (Weeks 7-8)
- [ ] Payroll calculation engine
- [ ] Tax calculation rules
- [ ] Deduction processing
- [ ] Leave balance calculation
- [ ] Payroll run workflow (draft → approved → paid)
- [ ] Payment processing (mock for now)

### Phase 5: Billing & Subscriptions (Weeks 9-10)
- [ ] Install & configure Paystack Laravel package (`unicodeveloper/laravel-paystack`)
- [ ] Create Plan Selection page
- [ ] Setup Paystack integration (API keys, webhooks)
- [ ] Create subscription checkout flow
- [ ] Setup webhook handlers for Paystack events
- [ ] Implement subscription enforcement (tier limits)
- [ ] Create subscription management portal
- [ ] Support Paystack recurring charges for auto-renewal

### Phase 6: Dashboard & UI (Weeks 11-12)
- [ ] Create main dashboard
- [ ] Employee management UI
- [ ] Payroll run management UI
- [ ] Reports & analytics
- [ ] Settings & preferences
- [ ] Team member management (invite/roles)

### Phase 7: Advanced Features (Weeks 13+)
- [ ] Batch payment processing
- [ ] Compliance reports (tax, labor)
- [ ] API for integrations
- [ ] Audit logs
- [ ] Data exports (PDF, CSV)
- [ ] Mobile app (React Native)

---

## Current Project Status

### ✅ Completed
- [x] Laravel 12 framework
- [x] Tenancy configured (stancl/tenancy)
- [x] User authentication (Laravel Fortify)
- [x] React 19 + Inertia.js frontend
- [x] TypeScript + Vite build
- [x] Tailwind CSS v4
- [x] Docker containerization
- [x] Deployed to Render (production-ready)
- [x] TrustProxies middleware (HTTPS handling)
- [x] Organization model created
- [x] SubscriptionPlan model created
- [x] OrganizationUser relationship created

### 🔄 In Progress
- [ ] Subscription model & migration
- [ ] "Create Organization" form & flow
- [ ] Auto-subscription to Free plan

### ⏳ Planned
- [ ] Tenant database initialization
- [ ] Payroll core models
- [ ] Dashboard UI
- [ ] Billing integration
- [ ] Everything else (see roadmap)

---

## Tech Stack

### Backend
- **Framework:** Laravel 12
- **PHP Version:** 8.4
- **Database:** PostgreSQL 17 (Supabase)
- **Multi-tenancy:** Stancl/Tenancy
- **Authentication:** Laravel Fortify
- **Payments:** Paystack (via unicodeveloper/laravel-paystack) - Optimized for Nigeria/Africa
- **Queue:** Laravel Queue (Redis)
- **Caching:** Redis
- **Logging:** Laravel Pail

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Framework:** Tailwind CSS v4
- **Server-side Rendering:** Inertia.js
- **State Management:** React Context/Zustand
- **HTTP Client:** Axios

### DevOps
- **Containerization:** Docker
- **Registry:** Docker Hub (optional)
- **Hosting:** Render (production)
- **Local Dev:** Laragon/Composer
- **Node:** v20 LTS
- **Package Manager:** npm

### Tools
- **Testing:** Pest PHP
- **Linting:** Pint (PHP), ESLint (JS)
- **Code Generation:** Laravel Boost
- **Route Generation:** Wayfinder

---

## Key Files Structure

```
payroll-saas/
├── app/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Organization.php (Tenant)
│   │   ├── OrganizationUser.php
│   │   ├── SubscriptionPlan.php
│   │   ├── Subscription.php (TODO)
│   │   └── ... (Employee, Payroll, etc.)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── OrganizationController.php (TODO)
│   │   │   └── ...
│   │   └── Requests/
│   ├── Middleware/
│   │   ├── TrustProxies.php ✅
│   │   ├── ForceHttps.php ✅
│   │   └── ...
│   └── Providers/
├── routes/
│   ├── web.php (central)
│   ├── tenant.php (per-tenant)
│   └── settings.php
├── resources/
│   ├── js/
│   │   ├── pages/
│   │   │   ├── welcome.tsx
│   │   │   ├── dashboard.tsx (TODO)
│   │   │   └── ...
│   │   └── components/
│   └── views/
│       └── app.blade.php
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php ✅
│   │   ├── 0001_01_01_000000_create_tenants_table.php ✅
│   │   └── ...
│   └── migrations/tenant/
│       └── (empty - to be populated)
├── docker/
│   ├── Dockerfile ✅
│   ├── entrypoint.sh ✅
│   ├── nginx.conf ✅
│   └── supervisord.conf ✅
├── Dockerfile ✅
└── docker-compose.yml (optional)
```

---

## Next Steps for Implementation

1. **Review this document with team** → Ensure alignment on approach
2. **Create Subscription & OrganizationUser migrations** → Database foundation
3. **Build "Create Organization" form** → User-facing feature
4. **Setup tenant database initialization** → Isolated data per org
5. **Create dashboard pages** → Start using the system
6. **Implement payroll models** → Core business logic
7. **Add Stripe integration** → Monetization

---

## Questions & Discussion Points

1. **Free tier limits:** Should we offer a 7-day trial for Pro plan to free users?
2. **Multi-organization:** Can one user manage multiple organizations?
3. **Role-based access:** What roles do we need? (Owner, Admin, Manager, Accountant, Employee)
4. **Data export:** Should users be able to export payroll data? (compliance requirement)
5. **Integrations:** Do we need integrations with accounting software (QuickBooks, Xero)?
6. **Compliance:** Which countries/regions are we targeting for tax/labor laws?
7. **Mobile:** Do we need a mobile app? (React Native)
8. **API:** Should we provide a REST/GraphQL API for integrations?

---

## Resources & References

- [Laravel Tenancy Docs](https://tenancyforlaravel.com/)
- [Laravel Cashier Docs](https://laravel.com/docs/11.x/billing)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Inertia.js Docs](https://inertiajs.com/)
- [React Docs](https://react.dev/)

---

**Last Updated:** March 4, 2026  
**Version:** 1.0  
**Status:** Draft - Ready for Team Review
