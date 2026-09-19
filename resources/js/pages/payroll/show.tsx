import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Edit2, FileText, LoaderCircle, RefreshCw, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type EmployeeCalculation = {
    employee_id: string;
    employee_number: string;
    employee_name: string;
    gross_salary: number;
    basic_salary: number;
    housing_allowance: number;
    transport_allowance: number;
    other_allowance_1: number;
    other_allowance_2: number;
    total_earnings: number;
    paye_deduction: number;
    pension_deduction: number;
    pension_employer: number;
    nhf_deduction: number;
    nhis_deduction: number;
    nhis_employer: number;
    nsitf_deduction: number;
    other_deductions: number;
    total_deductions: number;
    net_pay: number;
};

type PayrollShowProps = {
    payrollRun: {
        id: string;
        periodMonth: string;
        periodStart: string;
        periodEnd: string;
        status: string;
        employeeCount: number;
        totalGrossSalary: number;
        totalDeductions: number;
        totalNetPay: number;
        createdAt: string | null;
        finalizedAt: string | null;
    };
    employeeCalculations: EmployeeCalculation[];
    computedTotals: {
        nhisEmployerRate: number;
        nhisEmployerBase: string;
        nhisEmployerContribution: number;
        totalPensionEmployer: number;
        totalNhisEmployer: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payroll',
        href: '/payroll',
    },
    {
        title: 'Review',
        href: '',
    },
];

export default function PayrollShow({
    payrollRun,
    employeeCalculations,
    computedTotals,
}: PayrollShowProps) {
    const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<Record<string, Partial<EmployeeCalculation>>>({});
    const [isRecalculating, setIsRecalculating] = useState(false);

    const formatMoney = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const handleEditEmployee = (employeeId: string) => {
        const employee = employeeCalculations.find(e => e.employee_id === employeeId);
        if (employee) {
            setEditingEmployee(employeeId);
            setEmployeeData({
                [employeeId]: {
                    gross_salary: employee.gross_salary,
                    basic_salary: employee.basic_salary,
                    housing_allowance: employee.housing_allowance,
                    transport_allowance: employee.transport_allowance,
                    other_allowance_1: employee.other_allowance_1,
                    other_allowance_2: employee.other_allowance_2,
                    other_deductions: employee.other_deductions,
                },
            });
        }
    };

    const handleSaveEmployee = (employeeId: string) => {
        // In a real implementation, this would update the employee data
        // and recalculate the payroll
        setEditingEmployee(null);
        router.post(`/employees/${employeeId}`, employeeData[employeeId], {
            method: 'patch',
            preserveScroll: true,
        });
    };

    const handleRecalculate = () => {
        setIsRecalculating(true);
        router.post(`/payroll/runs/${payrollRun.id}/recalculate`, {}, {
            preserveScroll: true,
            onFinish: () => setIsRecalculating(false),
        });
    };

    const handleFinalize = () => {
        if (confirm('Are you sure you want to finalize this payroll run? This action cannot be undone.')) {
            router.post(`/payroll/runs/${payrollRun.id}/finalize`, {}, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payroll Review - ${payrollRun.periodMonth}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/payroll">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Payroll
                            </Link>
                        </Button>
                        <h1 className="mt-2 text-2xl font-bold">
                            Payroll Review - {payrollRun.periodMonth}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {payrollRun.periodStart} to {payrollRun.periodEnd}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {payrollRun.status === 'draft' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleRecalculate}
                                    disabled={isRecalculating}
                                >
                                    {isRecalculating ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Recalculate
                                </Button>
                                <Button onClick={handleFinalize}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Finalize Payroll
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Alert */}
                {payrollRun.status === 'draft' && (
                    <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertTitle>Draft Status</AlertTitle>
                        <AlertDescription>
                            This payroll run is in draft status. Review the calculations, make adjustments if needed, then finalize to process payments.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Employees
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{payrollRun.employeeCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Gross Salary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatMoney(payrollRun.totalGrossSalary)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Deductions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatMoney(payrollRun.totalDeductions)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Net Pay
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatMoney(payrollRun.totalNetPay)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Employer Contributions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employer Contributions</CardTitle>
                        <CardDescription>
                            Statutory employer contributions for this payroll period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pension Employer</p>
                                <p className="text-lg font-bold">{formatMoney(computedTotals.totalPensionEmployer)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">NHIS Employer</p>
                                <p className="text-lg font-bold">{formatMoney(computedTotals.totalNhisEmployer)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">NHIS Rate</p>
                                <p className="text-lg font-bold">{computedTotals.nhisEmployerRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Breakdown</CardTitle>
                        <CardDescription>
                            Detailed calculation for each employee. Click edit to adjust salary components.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Employee</th>
                                        <th className="text-right p-2">Gross</th>
                                        <th className="text-right p-2">Basic</th>
                                        <th className="text-right p-2">Housing</th>
                                        <th className="text-right p-2">Transport</th>
                                        <th className="text-right p-2">PAYE</th>
                                        <th className="text-right p-2">Pension</th>
                                        <th className="text-right p-2">NHF</th>
                                        <th className="text-right p-2">NHIS</th>
                                        <th className="text-right p-2">NSITF</th>
                                        <th className="text-right p-2">Total Deductions</th>
                                        <th className="text-right p-2">Net Pay</th>
                                        <th className="text-center p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeCalculations.map((employee) => (
                                        <tr key={employee.employee_id} className="border-b hover:bg-muted/50">
                                            {editingEmployee === employee.employee_id ? (
                                                <>
                                                    <td className="p-2">
                                                        <div>
                                                            <p className="font-medium">{employee.employee_name}</p>
                                                            <p className="text-xs text-muted-foreground">{employee.employee_number}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            value={employeeData[employee.employee_id]?.gross_salary || employee.gross_salary}
                                                            onChange={(e) => setEmployeeData({
                                                                ...employeeData,
                                                                [employee.employee_id]: {
                                                                    ...employeeData[employee.employee_id],
                                                                    gross_salary: parseFloat(e.target.value) || 0,
                                                                },
                                                            })}
                                                            className="h-8 text-right"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            value={employeeData[employee.employee_id]?.basic_salary || employee.basic_salary}
                                                            onChange={(e) => setEmployeeData({
                                                                ...employeeData,
                                                                [employee.employee_id]: {
                                                                    ...employeeData[employee.employee_id],
                                                                    basic_salary: parseFloat(e.target.value) || 0,
                                                                },
                                                            })}
                                                            className="h-8 text-right"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            value={employeeData[employee.employee_id]?.housing_allowance || employee.housing_allowance}
                                                            onChange={(e) => setEmployeeData({
                                                                ...employeeData,
                                                                [employee.employee_id]: {
                                                                    ...employeeData[employee.employee_id],
                                                                    housing_allowance: parseFloat(e.target.value) || 0,
                                                                },
                                                            })}
                                                            className="h-8 text-right"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            value={employeeData[employee.employee_id]?.transport_allowance || employee.transport_allowance}
                                                            onChange={(e) => setEmployeeData({
                                                                ...employeeData,
                                                                [employee.employee_id]: {
                                                                    ...employeeData[employee.employee_id],
                                                                    transport_allowance: parseFloat(e.target.value) || 0,
                                                                },
                                                            })}
                                                            className="h-8 text-right"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.paye_deduction)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.pension_deduction)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.nhf_deduction)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.nhis_deduction)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.nsitf_deduction)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.total_deductions)}</td>
                                                    <td className="p-2 text-right text-muted-foreground">{formatMoney(employee.net_pay)}</td>
                                                    <td className="p-2 text-center">
                                                        <div className="flex justify-center gap-1">
                                                            <Button size="sm" onClick={() => handleSaveEmployee(employee.employee_id)}>
                                                                <Save className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => setEditingEmployee(null)}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="p-2">
                                                        <div>
                                                            <p className="font-medium">{employee.employee_name}</p>
                                                            <p className="text-xs text-muted-foreground">{employee.employee_number}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-right">{formatMoney(employee.gross_salary)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.basic_salary)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.housing_allowance)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.transport_allowance)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.paye_deduction)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.pension_deduction)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.nhf_deduction)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.nhis_deduction)}</td>
                                                    <td className="p-2 text-right">{formatMoney(employee.nsitf_deduction)}</td>
                                                    <td className="p-2 text-right font-medium">{formatMoney(employee.total_deductions)}</td>
                                                    <td className="p-2 text-right font-bold">{formatMoney(employee.net_pay)}</td>
                                                    <td className="p-2 text-center">
                                                        {payrollRun.status === 'draft' && (
                                                            <Button size="sm" variant="ghost" onClick={() => handleEditEmployee(employee.employee_id)}>
                                                                <Edit2 className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Payroll Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payroll Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground">Created At</p>
                                <p className="font-medium">{formatDate(payrollRun.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Finalized At</p>
                                <p className="font-medium">{formatDate(payrollRun.finalizedAt)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">{payrollRun.status}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Period</p>
                                <p className="font-medium">{payrollRun.periodMonth}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}