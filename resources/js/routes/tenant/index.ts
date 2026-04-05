import employees from './employees'
import payroll from './payroll'
const tenant = {
    employees: Object.assign(employees, employees),
payroll: Object.assign(payroll, payroll),
}

export default tenant