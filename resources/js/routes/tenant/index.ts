import employees from './employees'
import payroll from './payroll'
import reports from './reports'
const tenant = {
    employees: Object.assign(employees, employees),
payroll: Object.assign(payroll, payroll),
reports: Object.assign(reports, reports),
}

export default tenant