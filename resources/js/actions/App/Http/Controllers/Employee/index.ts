import SelfServiceController from './SelfServiceController'
import PayslipPdfController from './PayslipPdfController'
import TaxDocumentsController from './TaxDocumentsController'
import LeaveBalanceController from './LeaveBalanceController'
import NotificationController from './NotificationController'
const Employee = {
    SelfServiceController: Object.assign(SelfServiceController, SelfServiceController),
PayslipPdfController: Object.assign(PayslipPdfController, PayslipPdfController),
TaxDocumentsController: Object.assign(TaxDocumentsController, TaxDocumentsController),
LeaveBalanceController: Object.assign(LeaveBalanceController, LeaveBalanceController),
NotificationController: Object.assign(NotificationController, NotificationController),
}

export default Employee