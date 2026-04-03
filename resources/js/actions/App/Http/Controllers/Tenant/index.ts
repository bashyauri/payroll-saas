import DashboardController from './DashboardController'
import PayrollFinalizationController from './PayrollFinalizationController'
const Tenant = {
    DashboardController: Object.assign(DashboardController, DashboardController),
PayrollFinalizationController: Object.assign(PayrollFinalizationController, PayrollFinalizationController),
}

export default Tenant