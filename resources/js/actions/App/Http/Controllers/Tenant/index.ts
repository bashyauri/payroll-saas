import DashboardController from './DashboardController'
import EmployeeController from './EmployeeController'
import PayrollFinalizationController from './PayrollFinalizationController'
const Tenant = {
    DashboardController: Object.assign(DashboardController, DashboardController),
EmployeeController: Object.assign(EmployeeController, EmployeeController),
PayrollFinalizationController: Object.assign(PayrollFinalizationController, PayrollFinalizationController),
}

export default Tenant