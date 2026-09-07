const dashboard = () => route('employee.dashboard');
const profile = () => route('employee.profile');
const taxDocuments = () => route('employee.tax-documents');
const leaveBalance = () => route('employee.leave-balance');
const notifications = () => route('employee.notifications');
const payslipPdf = (payrollRunId: string) => route('employee.payslip.pdf', { payrollRun: payrollRunId });

export { dashboard, profile, taxDocuments, leaveBalance, notifications, payslipPdf };