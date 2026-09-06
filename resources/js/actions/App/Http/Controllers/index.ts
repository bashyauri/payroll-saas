import Onboarding from './Onboarding'
import Billing from './Billing'
import Settings from './Settings'
import Tenant from './Tenant'
import Employee from './Employee'
const Controllers = {
    Onboarding: Object.assign(Onboarding, Onboarding),
Billing: Object.assign(Billing, Billing),
Settings: Object.assign(Settings, Settings),
Tenant: Object.assign(Tenant, Tenant),
Employee: Object.assign(Employee, Employee),
}

export default Controllers