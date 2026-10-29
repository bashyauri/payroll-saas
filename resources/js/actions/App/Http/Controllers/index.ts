import Onboarding from './Onboarding'
import Billing from './Billing'
import OrganizationInvitationController from './OrganizationInvitationController'
import Settings from './Settings'
import Tenant from './Tenant'
import Employee from './Employee'
const Controllers = {
    Onboarding: Object.assign(Onboarding, Onboarding),
Billing: Object.assign(Billing, Billing),
OrganizationInvitationController: Object.assign(OrganizationInvitationController, OrganizationInvitationController),
Settings: Object.assign(Settings, Settings),
Tenant: Object.assign(Tenant, Tenant),
Employee: Object.assign(Employee, Employee),
}

export default Controllers