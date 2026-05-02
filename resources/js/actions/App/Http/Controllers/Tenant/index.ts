import DashboardController from './DashboardController'
import EmployeeController from './EmployeeController'
import PayrollController from './PayrollController'
import ReportsController from './ReportsController'
import PayrollFinalizationController from './PayrollFinalizationController'
const Tenant = {
    DashboardController: Object.assign(DashboardController, DashboardController),
EmployeeController: Object.assign(EmployeeController, EmployeeController),
PayrollController: Object.assign(PayrollController, PayrollController),
ReportsController: Object.assign(ReportsController, ReportsController),
PayrollFinalizationController: Object.assign(PayrollFinalizationController, PayrollFinalizationController),
}

export default Tenant