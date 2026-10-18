import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    History,
    LoaderCircle,
    Plus,
    RefreshCw,
    Save,
    Send,
    ShieldAlert,
    ShieldCheck,
    Sliders,
    Trash2,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type AdditionalItem = {
    name: string;
    amount: number;
    taxable?: boolean;
};

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
    additional_payments?: AdditionalItem[];
    total_additional_payments?: number;
    additional_deductions?: AdditionalItem[];
    total_additional_deductions?: number;
    total_earnings: number;
    paye_deduction: number;
    pension_deduction: number;
    pension_employer: number;
    nhf_deduction: number;
    nhis_deduction: number;
    nhis_employer: number;
    nsitf_deduction: number;
    other_deductions: number;
    base_other_deductions?: number;
    total_deductions: number;
    net_pay: number;
    is_adjusted?: boolean;
};

type AuditTrailEntry = {
    action: string;
    user_id: string | null;
    user_name: string;
    user_email?: string | null;
    timestamp: string;
    notes: string;
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
        submittedAt?: string | null;
        approvedAt?: string | null;
        approvalNotes?: string | null;
        rejectedAt?: string | null;
        rejectionReason?: string | null;
        finalizedAt: string | null;
        voidRequestedAt?: string | null;
        voidReason?: string | null;
        voidedAt?: string | null;
        voidApprovalNotes?: string | null;
    };
    userRole: string;
    employeeCalculations: EmployeeCalculation[];
    computedTotals: {
        nhisEmployerRate: number;
        nhisEmployerBase: string;
        nhisEmployerContribution: number;
        totalPensionEmployer: number;
        totalNhisEmployer: number;
    };
    auditTrail: AuditTrailEntry[];
    status?: string | null;
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
    userRole,
    employeeCalculations,
    computedTotals,
    auditTrail = [],
    status,
}: PayrollShowProps) {
    const isOwner = userRole === 'owner';
    const isAdminOrOwner = ['owner', 'admin'].includes(userRole);
    const canPrepare = isAdminOrOwner || userRole === 'preparer';
    const canReview = isAdminOrOwner || userRole === 'reviewer' || userRole === 'approver';
    const canAuthorize = isAdminOrOwner || userRole === 'authorizer';

    // State for loading
    const [isProcessing, setIsProcessing] = useState(false);

    // State for employee edit modal
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCalculation | null>(null);
    const [editForm, setEditForm] = useState<{
        basic_salary: number;
        housing_allowance: number;
        transport_allowance: number;
        other_allowance_1: number;
        other_allowance_2: number;
        other_deductions: number;
        additional_payments: AdditionalItem[];
        additional_deductions: AdditionalItem[];
    }>({
        basic_salary: 0,
        housing_allowance: 0,
        transport_allowance: 0,
        other_allowance_1: 0,
        other_allowance_2: 0,
        other_deductions: 0,
        additional_payments: [],
        additional_deductions: [],
    });

    // Dialogs for approval & void workflow
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');

    const [requestVoidDialogOpen, setRequestVoidDialogOpen] = useState(false);
    const [voidReason, setVoidReason] = useState('');

    const [approveVoidDialogOpen, setApproveVoidDialogOpen] = useState(false);
    const [voidNotes, setVoidNotes] = useState('');

    const formatMoney = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Open employee adjustment modal
    const handleOpenEdit = (employee: EmployeeCalculation) => {
        setSelectedEmployee(employee);
        setEditForm({
            basic_salary: employee.basic_salary,
            housing_allowance: employee.housing_allowance,
            transport_allowance: employee.transport_allowance,
            other_allowance_1: employee.other_allowance_1,
            other_allowance_2: employee.other_allowance_2,
            other_deductions: employee.base_other_deductions ?? employee.other_deductions,
            additional_payments: employee.additional_payments ? [...employee.additional_payments] : [],
            additional_deductions: employee.additional_deductions ? [...employee.additional_deductions] : [],
        });
    };

    // Addition payments handler
    const addAdditionPayment = () => {
        setEditForm({
            ...editForm,
            additional_payments: [
                ...editForm.additional_payments,
                { name: 'Overtime', amount: 0, taxable: true },
            ],
        });
    };

    const removeAdditionPayment = (index: number) => {
        const next = [...editForm.additional_payments];
        next.splice(index, 1);
        setEditForm({ ...editForm, additional_payments: next });
    };

    const updateAdditionPayment = (index: number, field: keyof AdditionalItem, value: any) => {
        const next = [...editForm.additional_payments];
        next[index] = { ...next[index], [field]: value };
        setEditForm({ ...editForm, additional_payments: next });
    };

    // Addition deductions handler
    const addAdditionDeduction = () => {
        setEditForm({
            ...editForm,
            additional_deductions: [
                ...editForm.additional_deductions,
                { name: 'Salary Advance', amount: 0 },
            ],
        });
    };

    const removeAdditionDeduction = (index: number) => {
        const next = [...editForm.additional_deductions];
        next.splice(index, 1);
        setEditForm({ ...editForm, additional_deductions: next });
    };

    const updateAdditionDeduction = (index: number, field: keyof AdditionalItem, value: any) => {
        const next = [...editForm.additional_deductions];
        next[index] = { ...next[index], [field]: value };
        setEditForm({ ...editForm, additional_deductions: next });
    };

    // Save employee adjustment
    const handleSaveAdjustment = () => {
        if (!selectedEmployee) return;
        setIsProcessing(true);

        router.patch(
            `/payroll/runs/${payrollRun.id}/employees/${selectedEmployee.employee_id}`,
            editForm,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedEmployee(null);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    // Live preview values
    const currentBaseEarnings =
        editForm.basic_salary +
        editForm.housing_allowance +
        editForm.transport_allowance +
        editForm.other_allowance_1 +
        editForm.other_allowance_2;

    const currentTotalAdditions = editForm.additional_payments.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const currentTotalAdditionalDeductions = editForm.additional_deductions.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const currentTotalEarnings = currentBaseEarnings + currentTotalAdditions;

    // Workflow actions
    const handleRecalculate = () => {
        setIsProcessing(true);
        router.post(
            `/payroll/runs/${payrollRun.id}/recalculate`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handleSubmitApproval = () => {
        if (confirm('Submit this payroll run for formal review and approval?')) {
            setIsProcessing(true);
            router.post(
                `/payroll/runs/${payrollRun.id}/submit-approval`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setIsProcessing(false),
                }
            );
        }
    };

    const handleApprove = () => {
        setIsProcessing(true);
        router.post(
            `/payroll/runs/${payrollRun.id}/approve`,
            { notes: approvalNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setApproveDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejecting this payroll run.');
            return;
        }
        setIsProcessing(true);
        router.post(
            `/payroll/runs/${payrollRun.id}/reject`,
            { reason: rejectionReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleFinalize = () => {
        if (
            confirm(
                'Are you sure you want to finalize this payroll run? This will lock calculations and generate employee payslips.'
            )
        ) {
            setIsProcessing(true);
            router.post(
                `/payroll/runs/${payrollRun.id}/finalize`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setIsProcessing(false),
                }
            );
        }
    };

    const handleRequestVoid = () => {
        if (!voidReason.trim()) {
            alert('Please provide a detailed justification for voiding this payroll run.');
            return;
        }
        setIsProcessing(true);
        router.post(
            `/payroll/runs/${payrollRun.id}/request-void`,
            { reason: voidReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRequestVoidDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleApproveVoid = () => {
        setIsProcessing(true);
        router.post(
            `/payroll/runs/${payrollRun.id}/approve-void`,
            { notes: voidNotes, reason: voidReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setApproveVoidDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleRejectVoid = () => {
        if (confirm('Reject void request and restore payroll to finalized status?')) {
            setIsProcessing(true);
            router.post(
                `/payroll/runs/${payrollRun.id}/reject-void`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setIsProcessing(false),
                }
            );
        }
    };

    const renderStatusBadge = () => {
        switch (payrollRun.status) {
            case 'draft':
                return (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
                        Draft (In Review)
                    </Badge>
                );
            case 'pending_approval':
                return (
                    <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30">
                        Pending Approval
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
                        Approved
                    </Badge>
                );
            case 'finalized':
                return (
                    <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50 dark:bg-green-950/30">
                        Finalized
                    </Badge>
                );
            case 'void_requested':
                return (
                    <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/30">
                        Void Requested
                    </Badge>
                );
            case 'voided':
                return (
                    <Badge variant="destructive" className="bg-red-600 text-white">
                        VOIDED
                    </Badge>
                );
            default:
                return <Badge variant="outline">{payrollRun.status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payroll Review - ${payrollRun.periodMonth}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/payroll">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Payroll Runs
                            </Link>
                        </Button>
                        <div className="mt-2 flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                Payroll Run - {payrollRun.periodMonth}
                            </h1>
                            {renderStatusBadge()}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Period: {payrollRun.periodStart} to {payrollRun.periodEnd}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {/* Draft state actions */}
                        {payrollRun.status === 'draft' && canPrepare && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleRecalculate}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Recalculate
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleSubmitApproval}
                                    disabled={isProcessing}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit for Approval
                                </Button>
                                {isOwner && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleFinalize}
                                        disabled={isProcessing}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Direct Finalize (Owner)
                                    </Button>
                                )}
                            </>
                        )}

                        {/* Pending approval state actions */}
                        {payrollRun.status === 'pending_approval' && canReview && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => setRejectDialogOpen(true)}
                                    disabled={isProcessing}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject to Draft
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => setApproveDialogOpen(true)}
                                    disabled={isProcessing}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve Payroll
                                </Button>
                            </>
                        )}

                        {/* Approved state actions */}
                        {payrollRun.status === 'approved' && canAuthorize && (
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleFinalize}
                                disabled={isProcessing}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Finalize & Lock Payroll
                            </Button>
                        )}

                        {/* Finalized state actions */}
                        {payrollRun.status === 'finalized' && (
                            <>
                                {isOwner ? (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setVoidReason('');
                                            setApproveVoidDialogOpen(true);
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Void Payroll (Owner)
                                    </Button>
                                ) : isAdminOrOwner ? (
                                    <Button
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            setVoidReason('');
                                            setRequestVoidDialogOpen(true);
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Request to Void
                                    </Button>
                                ) : null}
                            </>
                        )}

                        {/* Void requested state actions */}
                        {payrollRun.status === 'void_requested' && (
                            <>
                                {isOwner ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleRejectVoid}
                                            disabled={isProcessing}
                                        >
                                            Reject Void Request
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setApproveVoidDialogOpen(true)}
                                            disabled={isProcessing}
                                        >
                                            <ShieldAlert className="mr-2 h-4 w-4" />
                                            Approve Void
                                        </Button>
                                    </>
                                ) : (
                                    <Badge variant="outline" className="py-1 px-3 text-sm">
                                        Void Request Pending Owner Decision
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Status Notice Alerts */}
                {payrollRun.status === 'draft' && (
                    <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                        <FileText className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
                            Draft Status - Editable Review
                        </AlertTitle>
                        <AlertDescription className="text-amber-700 dark:text-amber-300">
                            Review all calculations below. You can click <strong>"Adjust / Inclusions"</strong> on any employee to add one-off bonuses, overtime, commissions, or additional deductions for this month. Once review is complete, submit for formal approval.
                        </AlertDescription>
                    </Alert>
                )}

                {payrollRun.status === 'pending_approval' && (
                    <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800 dark:text-blue-400 font-semibold">
                            Pending Approval
                        </AlertTitle>
                        <AlertDescription className="text-blue-700 dark:text-blue-300">
                            Submitted on {formatDate(payrollRun.submittedAt)}. Review the breakdown and click <strong>Approve Payroll</strong> to proceed to finalization, or <strong>Reject to Draft</strong> if revisions are needed.
                        </AlertDescription>
                    </Alert>
                )}

                {payrollRun.status === 'approved' && (
                    <Alert className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <AlertTitle className="text-emerald-800 dark:text-emerald-400 font-semibold">
                            Approved - Ready to Finalize
                        </AlertTitle>
                        <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                            Approved on {formatDate(payrollRun.approvedAt)}. Click <strong>Finalize & Lock Payroll</strong> to record final disbursement and enable employee payslips.
                        </AlertDescription>
                    </Alert>
                )}

                {payrollRun.status === 'void_requested' && (
                    <Alert className="border-orange-300 bg-orange-50/50 dark:bg-orange-950/20">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertTitle className="text-orange-800 dark:text-orange-400 font-semibold">
                            Strict Void Approval Pending
                        </AlertTitle>
                        <AlertDescription className="text-orange-700 dark:text-orange-300">
                            An administrative request to void this finalized payroll was submitted on {formatDate(payrollRun.voidRequestedAt)}.
                            <div className="mt-2 rounded bg-orange-100 dark:bg-orange-900/40 p-2 font-mono text-xs">
                                Reason: {payrollRun.voidReason || 'No reason specified'}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {payrollRun.status === 'voided' && (
                    <Alert className="border-red-300 bg-red-50/80 dark:bg-red-950/40">
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800 dark:text-red-400 font-bold">
                            VOIDED PAYROLL RUN
                        </AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-300">
                            This payroll run was officially voided on {formatDate(payrollRun.voidedAt)}. It is excluded from all reports, tax filings, and payslips. The full audit trail and calculations are preserved below for compliance.
                            <div className="mt-2 rounded bg-red-100 dark:bg-red-900/40 p-2 text-xs">
                                Void Justification: {payrollRun.voidReason || 'Voided by organization owner'}
                                {payrollRun.voidApprovalNotes && (
                                    <span> | Notes: {payrollRun.voidApprovalNotes}</span>
                                )}
                            </div>
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
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatMoney(payrollRun.totalNetPay)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Employer Contributions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Employer Contributions</CardTitle>
                        <CardDescription>
                            Statutory employer liabilities for this period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Pension Employer</p>
                                <p className="text-lg font-bold">{formatMoney(computedTotals.totalPensionEmployer)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">NHIS Employer</p>
                                <p className="text-lg font-bold">{formatMoney(computedTotals.totalNhisEmployer)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">NHIS Employer Rate</p>
                                <p className="text-lg font-bold">{computedTotals.nhisEmployerRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Breakdown Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle>Employee Breakdown & Inclusions</CardTitle>
                                <CardDescription>
                                    Review individual compensation, additional earnings, and deductions for this payroll period.
                                </CardDescription>
                            </div>
                            {payrollRun.status === 'draft' && (
                                <Badge variant="outline" className="border-blue-400 text-blue-600">
                                    Click "Adjust / Inclusions" to add bonuses, overtime, or deductions
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="text-left p-2 font-semibold">Employee</th>
                                        <th className="text-right p-2 font-semibold">Basic</th>
                                        <th className="text-right p-2 font-semibold">Housing</th>
                                        <th className="text-right p-2 font-semibold">Transport</th>
                                        <th className="text-right p-2 font-semibold text-emerald-600">Additions</th>
                                        <th className="text-right p-2 font-semibold text-orange-600">Add. Deductions</th>
                                        <th className="text-right p-2 font-semibold">PAYE</th>
                                        <th className="text-right p-2 font-semibold">Pension</th>
                                        <th className="text-right p-2 font-semibold">NHF</th>
                                        <th className="text-right p-2 font-semibold">NHIS</th>
                                        <th className="text-right p-2 font-semibold">Total Deductions</th>
                                        <th className="text-right p-2 font-semibold">Net Pay</th>
                                        {payrollRun.status === 'draft' && (
                                            <th className="text-center p-2 font-semibold">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeCalculations.map((employee) => {
                                        const totalAdditions = employee.total_additional_payments ?? (
                                            employee.additional_payments?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) ?? 0
                                        );
                                        const totalAddDeductions = employee.total_additional_deductions ?? (
                                            employee.additional_deductions?.reduce((acc, d) => acc + (Number(d.amount) || 0), 0) ?? 0
                                        );

                                        return (
                                            <tr
                                                key={employee.employee_id}
                                                className={`border-b hover:bg-muted/30 transition-colors ${
                                                    employee.is_adjusted ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                                                }`}
                                            >
                                                <td className="p-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-foreground">
                                                                {employee.employee_name}
                                                            </p>
                                                            {employee.is_adjusted && (
                                                                <Badge variant="outline" className="text-[10px] py-0 px-1 border-amber-500 text-amber-600">
                                                                    Adjusted
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {employee.employee_number}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-2 text-right">{formatMoney(employee.basic_salary)}</td>
                                                <td className="p-2 text-right">{formatMoney(employee.housing_allowance)}</td>
                                                <td className="p-2 text-right">{formatMoney(employee.transport_allowance)}</td>
                                                <td className="p-2 text-right">
                                                    {totalAdditions > 0 ? (
                                                        <span className="font-medium text-emerald-600">
                                                            +{formatMoney(totalAdditions)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="p-2 text-right">
                                                    {totalAddDeductions > 0 ? (
                                                        <span className="font-medium text-orange-600">
                                                            -{formatMoney(totalAddDeductions)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground font-mono">
                                                    {formatMoney(employee.paye_deduction)}
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground font-mono">
                                                    {formatMoney(employee.pension_deduction)}
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground font-mono">
                                                    {formatMoney(employee.nhf_deduction)}
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground font-mono">
                                                    {formatMoney(employee.nhis_deduction)}
                                                </td>
                                                <td className="p-2 text-right font-medium text-foreground">
                                                    {formatMoney(employee.total_deductions)}
                                                </td>
                                                <td className="p-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatMoney(employee.net_pay)}
                                                </td>
                                                {payrollRun.status === 'draft' && (
                                                    <td className="p-2 text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 gap-1"
                                                            onClick={() => handleOpenEdit(employee)}
                                                        >
                                                            <Sliders className="h-3.5 w-3.5" />
                                                            <span>Adjust / Inclusions</span>
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Trail & Compliance Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-muted-foreground" />
                            Audit Trail & Governance History
                        </CardTitle>
                        <CardDescription>
                            Complete chronological record of changes, review submissions, approvals, and void operations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {auditTrail.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No audit entries recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {auditTrail.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-2 border-primary/50 pl-3 py-1 text-sm gap-1"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs uppercase">
                                                    {entry.action.replace('_', ' ')}
                                                </Badge>
                                                <span className="font-medium text-foreground">
                                                    {entry.user_name}
                                                </span>
                                                {entry.user_email && (
                                                    <span className="text-xs text-muted-foreground">
                                                        ({entry.user_email})
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {entry.notes}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono sm:text-right shrink-0">
                                            {formatDate(entry.timestamp)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Employee Adjustment Dialog */}
            <Dialog open={selectedEmployee !== null} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sliders className="h-5 w-5" />
                            Adjust Compensation & Inclusions - {selectedEmployee?.employee_name}
                        </DialogTitle>
                        <DialogDescription>
                            Edit base salary components or include one-off additions (bonuses, overtime) and deductions for this payroll period.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-3">
                        {/* Base Salary Components */}
                        <div className="rounded-lg border p-4 space-y-3">
                            <h4 className="text-sm font-semibold">Salary Components (Monthly)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-xs">Basic Salary (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.basic_salary}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, basic_salary: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Housing Allowance (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.housing_allowance}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, housing_allowance: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Transport Allowance (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.transport_allowance}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, transport_allowance: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <div>
                                    <Label className="text-xs">Other Allowance 1 (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.other_allowance_1}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, other_allowance_1: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Other Allowance 2 (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.other_allowance_2}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, other_allowance_2: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Standard Other Deductions (NGN)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={editForm.other_deductions}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, other_deductions: parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Addition Payments / Inclusions (Bonuses, Overtime, Commission, Arrears) */}
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        Additional Payments & Allowances (One-off Inclusions)
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Add bonuses, overtime pay, commissions, or arrears for this month.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 border-emerald-300 text-emerald-700"
                                    onClick={addAdditionPayment}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add Payment</span>
                                </Button>
                            </div>

                            {editForm.additional_payments.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic py-1">
                                    No additional payments included for this employee.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {editForm.additional_payments.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Label (e.g. Overtime, Bonus)"
                                                value={item.name}
                                                onChange={(e) => updateAdditionPayment(idx, 'name', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Amount"
                                                value={item.amount}
                                                onChange={(e) =>
                                                    updateAdditionPayment(idx, 'amount', parseFloat(e.target.value) || 0)
                                                }
                                                className="w-32 text-right"
                                            />
                                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={item.taxable ?? true}
                                                    onChange={(e) => updateAdditionPayment(idx, 'taxable', e.target.checked)}
                                                    className="rounded border-input text-primary focus:ring-primary"
                                                />
                                                Taxable
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeAdditionPayment(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Additional Deductions (Salary Advance, Loan Recovery, Discipline) */}
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                                        Additional Deductions (One-off)
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Add salary advances, loan deductions, or surcharges for this month.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 border-orange-300 text-orange-700"
                                    onClick={addAdditionDeduction}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add Deduction</span>
                                </Button>
                            </div>

                            {editForm.additional_deductions.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic py-1">
                                    No additional deductions included for this employee.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {editForm.additional_deductions.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Label (e.g. Salary Advance, Loan)"
                                                value={item.name}
                                                onChange={(e) => updateAdditionDeduction(idx, 'name', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Amount"
                                                value={item.amount}
                                                onChange={(e) =>
                                                    updateAdditionDeduction(idx, 'amount', parseFloat(e.target.value) || 0)
                                                }
                                                className="w-32 text-right"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeAdditionDeduction(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Live Calculation Preview */}
                        <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-xs">
                            <div className="flex justify-between font-medium">
                                <span>Base Salary Components:</span>
                                <span>{formatMoney(currentBaseEarnings)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600 font-medium">
                                <span>Additional Payments Total:</span>
                                <span>+{formatMoney(currentTotalAdditions)}</span>
                            </div>
                            <div className="flex justify-between text-orange-600 font-medium">
                                <span>Additional Deductions Total:</span>
                                <span>-{formatMoney(currentTotalAdditionalDeductions)}</span>
                            </div>
                            <div className="border-t pt-1 flex justify-between font-bold text-sm">
                                <span>Estimated Total Earnings:</span>
                                <span>{formatMoney(currentTotalEarnings)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAdjustment} disabled={isProcessing}>
                            {isProcessing ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Adjustments & Recalculate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approval Notes Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Payroll Run</DialogTitle>
                        <DialogDescription>
                            Confirm that you have reviewed the calculations and approve this payroll for period {payrollRun.periodMonth}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label>Approval Notes (Optional)</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Add any remarks or comments for the audit log..."
                            value={approvalNotes}
                            onChange={(e) => setApprovalNotes(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleApprove}
                            disabled={isProcessing}
                        >
                            Confirm Approval
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rejection Reason Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payroll Run</DialogTitle>
                        <DialogDescription>
                            Rejecting this payroll will return it to Draft status and allow the preparer to make required corrections.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label>Reason for Rejection (Required)</Label>
                        <textarea
                            required
                            className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Explain what needs to be corrected before approval..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Request Void Dialog (Admin/HR) */}
            <Dialog open={requestVoidDialogOpen} onOpenChange={setRequestVoidDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request to Void Finalized Payroll</DialogTitle>
                        <DialogDescription>
                            Voiding a finalized payroll run is a controlled action that requires strict approval from the Organization Owner.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label>Justification / Reason for Voiding (Required)</Label>
                        <textarea
                            required
                            className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Detail why this finalized payroll needs to be voided (e.g. major calculation error, wrong period)..."
                            value={voidReason}
                            onChange={(e) => setVoidReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRequestVoidDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRequestVoid} disabled={isProcessing}>
                            Submit Void Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve Void Dialog (Owner) */}
            <Dialog open={approveVoidDialogOpen} onOpenChange={setApproveVoidDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" />
                            Confirm Void of Payroll Run {payrollRun.periodMonth}
                        </DialogTitle>
                        <DialogDescription>
                            This strict action will VOID the finalized payroll run. It will maintain the complete audit trail, but will NOT be recognized in reports, payslips, or tax calculations.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        {payrollRun.status === 'finalized' && (
                            <div>
                                <Label>Reason for Voiding (Required)</Label>
                                <textarea
                                    required
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Provide mandatory reason for voiding this run..."
                                    value={voidReason}
                                    onChange={(e) => setVoidReason(e.target.value)}
                                />
                            </div>
                        )}
                        <div>
                            <Label>Owner Decision Notes (Optional)</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Add any owner authorization remarks..."
                                value={voidNotes}
                                onChange={(e) => setVoidNotes(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveVoidDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleApproveVoid} disabled={isProcessing}>
                            Execute Strict Void
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
