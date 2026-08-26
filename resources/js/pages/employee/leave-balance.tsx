import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Info,
    Plus,
    XCircle,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard as employeeDashboard } from '@/routes/employee';
import type { BreadcrumbItem } from '@/types';

type LeaveBalanceProps = {
    employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        department: string | null;
        jobTitle: string | null;
        hireDate: string | null;
        employmentType: string;
    };
    leaveBalances: Array<{
        type: string;
        totalDays: number;
        usedDays: number;
        remainingDays: number;
        accrualPeriod: string;
        carriedOver: number;
    }>;
    recentRequests: Array<{
        id: string;
        type: string;
        startDate: string;
        endDate: string;
        days: number;
        status: string;
        requestedAt: string;
    }>;
    currentYear: number;
    leaveManagementEnabled: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
    {
        title: 'Leave Balance',
        href: '/employee/leave-balance',
    },
];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
        case 'approved':
            return <Badge variant="default" className="bg-green-600">Approved</Badge>;
        case 'pending':
            return <Badge variant="secondary">Pending</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
        case 'cancelled':
            return <Badge variant="outline">Cancelled</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

export default function LeaveBalance({
    employee,
    leaveBalances,
    recentRequests,
    currentYear,
    leaveManagementEnabled,
}: LeaveBalanceProps) {
    const employmentYears = employee.hireDate 
        ? Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Balance" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={employeeDashboard()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Leave Balance</h1>
                    </div>
                    {leaveManagementEnabled && (
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Request Leave
                        </Button>
                    )}
                </div>

                {/* Employee Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5" />
                            {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <CardDescription>
                            {employee.department || 'N/A'} • {employee.jobTitle || 'N/A'} • {employee.employmentType.replace('_', ' ')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Employee Number
                                </p>
                                <p className="font-medium">{employee.employeeNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Hire Date
                                </p>
                                <p className="font-medium">
                                    {employee.hireDate ? formatDate(employee.hireDate) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Years of Service
                                </p>
                                <p className="font-medium">{employmentYears} year(s)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {!leaveManagementEnabled && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-900">
                                        Leave Management Coming Soon
                                    </p>
                                    <p className="text-sm text-amber-800">
                                        The full leave management system will be available in Phase 2. 
                                        Currently showing placeholder leave balances for demonstration purposes.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Leave Balances */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {leaveBalances.map((balance) => {
                        const percentageUsed = (balance.usedDays / balance.totalDays) * 100;
                        const percentageRemaining = (balance.remainingDays / balance.totalDays) * 100;
                        
                        return (
                            <Card key={balance.type}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{balance.type}</CardTitle>
                                    <CardDescription>
                                        {balance.accrualPeriod} accrual
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Total
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {balance.totalDays}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                days
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Used
                                            </p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {balance.usedDays}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                days
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Remaining
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {balance.remainingDays}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                days
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Used</span>
                                            <span className="font-medium">{percentageUsed.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={percentageUsed} className="h-2" />
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Available</span>
                                            <span className="font-medium">{percentageRemaining.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={percentageRemaining} className="h-2" />
                                    </div>

                                    {balance.carriedOver > 0 && (
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="text-muted-foreground">
                                                Carried Over
                                            </span>
                                            <span className="font-medium">
                                                {balance.carriedOver} days
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Leave Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5" />
                            Recent Leave Requests
                        </CardTitle>
                        <CardDescription>
                            Your leave request history for {currentYear}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentRequests.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                                No leave requests found for this year.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between p-4 rounded-lg border"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{request.type}</p>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} days)
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Requested on {formatDate(request.requestedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Leave Policy Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Info className="h-5 w-5" />
                            Leave Policy Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="font-medium mb-2">Annual Leave Accrual</p>
                            <p className="text-muted-foreground">
                                Annual leave accrues at the rate of 1.75 days per month, totaling 21 days per year. 
                                Leave can be carried over to the next year subject to company policy.
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-medium mb-2">Sick Leave</p>
                            <p className="text-muted-foreground">
                                Sick leave is provided for medical reasons and requires medical documentation for absences exceeding 3 consecutive days.
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-medium mb-2">Maternity/Paternity Leave</p>
                            <p className="text-muted-foreground">
                                Maternity leave (90 days) and paternity leave (14 days) are available per pregnancy/birth as per Nigerian labor laws.
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-medium mb-2">Leave Request Process</p>
                            <p className="text-muted-foreground">
                                Leave requests should be submitted at least 2 weeks in advance for planned leave. 
                                Emergency leave requests will be considered on a case-by-case basis.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}