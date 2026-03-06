# Payroll SaaS RBAC Matrix (MVP)

## Roles
- **Owner**: Founder/primary account holder. Full access + billing/legal controls.
- **Admin**: Day-to-day HR manager. Full access except billing/organization settings.
- **Manager**: Department/team lead. View + manage own team's employees/payroll.
- **Staff**: General employee. View own data only (payslip, leave balance).

---

## Permission Matrix

| Permission | Owner | Admin | Manager | Staff |
|-----------|-------|-------|---------|-------|
| **Organization Settings** | | | | |
| `org.settings.view` | ✅ | ✅ | ❌ | ❌ |
| `org.settings.update` | ✅ | ❌ | ❌ | ❌ |
| `org.billing.manage` | ✅ | ❌ | ❌ | ❌ |
| `org.members.invite` | ✅ | ✅ | ❌ | ❌ |
| `org.members.remove` | ✅ | ✅ | ❌ | ❌ |
| `org.members.assign_role` | ✅ | ❌ | ❌ | ❌ |
| **Users/Members** | | | | |
| `user.view_all` | ✅ | ✅ | ❌ | ❌ |
| `user.view_own` | ✅ | ✅ | ✅ | ✅ |
| `user.update_own` | ✅ | ✅ | ✅ | ✅ |
| `user.update_others` | ✅ | ✅ | ❌ | ❌ |
| **Employees** | | | | |
| `employee.view_all` | ✅ | ✅ | ✅ | ❌ |
| `employee.view_own` | ✅ | ✅ | ✅ | ✅ |
| `employee.create` | ✅ | ✅ | ❌ | ❌ |
| `employee.update_all` | ✅ | ✅ | ❌ | ❌ |
| `employee.update_team` | ✅ | ✅ | ✅ | ❌ |
| `employee.delete` | ✅ | ✅ | ❌ | ❌ |
| `employee.export` | ✅ | ✅ | ✅ | ❌ |
| **Payroll** | | | | |
| `payroll.view_all` | ✅ | ✅ | ✅ | ❌ |
| `payroll.view_own` | ✅ | ✅ | ✅ | ✅ |
| `payroll.create` | ✅ | ✅ | ❌ | ❌ |
| `payroll.run` | ✅ | ✅ | ❌ | ❌ |
| `payroll.approve` | ✅ | ✅ | ❌ | ❌ |
| `payroll.finalize` | ✅ | ✅ | ❌ | ❌ |
| `payroll.delete` | ✅ | ❌ | ❌ | ❌ |
| **Leave Management** | | | | |
| `leave.view_all` | ✅ | ✅ | ✅ | ❌ |
| `leave.view_own` | ✅ | ✅ | ✅ | ✅ |
| `leave.request` | ✅ | ✅ | ✅ | ✅ |
| `leave.approve` | ✅ | ✅ | ✅ | ❌ |
| `leave.cancel_own` | ✅ | ✅ | ✅ | ✅ |
| `leave.cancel_others` | ✅ | ✅ | ❌ | ❌ |
| **Reports & Analytics** | | | | |
| `report.view_all` | ✅ | ✅ | ✅ | ❌ |
| `report.view_team` | ✅ | ✅ | ✅ | ❌ |
| `report.export` | ✅ | ✅ | ✅ | ❌ |

---

## Key Rules & Edge Cases

### Ownership & Billing
1. **Owner cannot be downgraded** to Admin/Manager/Staff while logged in (prevent lockout).
2. **Owner can always reassign ownership** to another Admin, keeping at least one owner per org.
3. **Billing changes** (upgrade/downgrade/cancel) restricted to Owner only; admins cannot reduce their own permissions.

### Tenant Safety
1. **All permission checks must include org context** (current organization from session).
2. **A user in multiple organizations** has independent role/permissions per org.
3. **Cross-org data leakage prevented** by always filtering queries on `organization_id`.

### Payroll Safety
1. **Payroll approval = irreversible action** → requires Owner or Admin only.
2. **Payroll finalization** (locks month from edits) → Owner only on production data.
3. **Audit trail** on every payroll run/approve/finalize (who, when, org, changes).

### Leave & Team Management
1. **Manager can only approve leaves** from their own team members (scoped by department or direct reports, TBD).
2. **Staff can request/view own leave**, but cannot approve or view others' requests.
3. **Leave balance calculations** must be team-scoped and org-scoped.

---

## Permission Grouping (For Seeder)

```
Role: Owner
├── org.*
├── user.*
├── employee.*
├── payroll.*
├── leave.*
└── report.*

Role: Admin
├── user.(view_all, view_own, update_own, update_others)
├── employee.(view_all, view_own, create, update_all, export)
├── payroll.(view_all, view_own, create, run, approve, finalize)
├── leave.(view_all, view_own, request, approve, cancel_own, cancel_others)
├── report.(view_all, view_team, export)
└── org.(settings.view, members.invite, members.remove) [NOT billing or role assignment]

Role: Manager
├── user.(view_own, update_own)
├── employee.(view_all, view_own, update_team, export)
├── payroll.(view_all, view_own, view_team)
├── leave.(view_all, view_own, request, approve, cancel_own)
└── report.(view_team, export)

Role: Staff
├── user.(view_own, update_own)
├── employee.(view_own)
├── payroll.(view_own)
├── leave.(view_own, request, cancel_own)
└── (no reports)
```

---

## Implementation Checklist (Later)

- [ ] Install `spatie/laravel-permission`
- [ ] Create Role & Permission models (DB migration)
- [ ] Seed 4 roles + 30 permissions
- [ ] Create Spatie traits on `User` model
- [ ] Add `@can()` & `@cannot()` gates to Blade templates
- [ ] Create Resource Policies for Employee, Payroll, Leave
- [ ] Add route middleware + controller checks
- [ ] Add auditable trait for permission/role changes
- [ ] Test each role on critical flows (login, create employee, run payroll)
- [ ] Deploy to staging, validate, then production

---

## Notes for Review

1. **Manager scope is TBD**: Currently "manager can view all employees" but should this be "team-scoped" (own dept only)? Depends on your org structure.
2. **Approval workflow**: Is "payroll.approve" distinct from "payroll.run", or combined? Currently separate for safety.
3. **Export permissions**: Should be audited (log who/when exported payroll data).
4. **Future expansion**: Add `viewer`/`auditor` role if clients need read-only power users.
