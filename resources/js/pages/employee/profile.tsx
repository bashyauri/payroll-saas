import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Mail,
    Phone,
    Save,
    User,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard as employeeDashboard } from '@/routes/employee';
import type { BreadcrumbItem } from '@/types';

type EmployeeProfileProps = {
    employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        workEmail: string | null;
        phone: string | null;
        nin: string | null;
        bvn: string | null;
        taxIdentificationNumber: string | null;
        pensionPin: string | null;
        pfaName: string | null;
        nhisNumber: string | null;
        nhfNumber: string | null;
        bankName: string;
        bankAccountName: string;
        bankAccountNumber: string;
        department: string | null;
        jobTitle: string | null;
        location: string | null;
        dateOfBirth: string | null;
        employmentType: string;
        hireDate: string | null;
        status: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
    {
        title: 'Profile',
        href: '/employee/profile',
    },
];

export default function EmployeeProfile({ employee }: EmployeeProfileProps) {
    const { data, setData, put, processing, errors } = useForm({
        phone: employee.phone || '',
        location: employee.location || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('employee.profile.update'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Profile" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={employeeDashboard()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Update Your Profile</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Read-only Information */}
                    <Card>
                        <CardHeader>
                            <CardDescription>Employee Information</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4" />
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">
                                        Employee Number
                                    </Label>
                                    <p className="font-medium">{employee.employeeNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Full Name
                                    </Label>
                                    <p className="font-medium">
                                        {employee.firstName} {employee.middleName} {employee.lastName}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Email
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">{employee.workEmail || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Date of Birth
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {employee.dateOfBirth 
                                                ? new Date(employee.dateOfBirth).toLocaleDateString('en-NG')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Information */}
                    <Card>
                        <CardHeader>
                            <CardDescription>Employment Details</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Work Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">
                                        Department
                                    </Label>
                                    <p className="font-medium">{employee.department || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Job Title
                                    </Label>
                                    <p className="font-medium">{employee.jobTitle || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Employment Type
                                    </Label>
                                    <p className="font-medium capitalize">
                                        {employee.employmentType.replace('_', ' ')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Hire Date
                                    </Label>
                                    <p className="font-medium">
                                        {employee.hireDate 
                                            ? new Date(employee.hireDate).toLocaleDateString('en-NG')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                    {employee.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editable Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardDescription>Contact Information</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Phone className="h-4 w-4" />
                                Update Contact Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                    error={errors.phone}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Enter your work location"
                                    error={errors.location}
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">{errors.location}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Information (Read-only for security) */}
                    <Card>
                        <CardHeader>
                            <CardDescription>Bank Information</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">
                                        Bank Name
                                    </Label>
                                    <p className="font-medium">{employee.bankName}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Account Name
                                    </Label>
                                    <p className="font-medium">{employee.bankAccountName}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <Label className="text-muted-foreground">
                                        Account Number
                                    </Label>
                                    <p className="font-medium">{employee.bankAccountNumber}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Bank details can only be updated by your HR administrator for security purposes.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tax and Statutory Information (Read-only) */}
                    <Card>
                        <CardHeader>
                            <CardDescription>Statutory Information</CardDescription>
                            <CardTitle>Tax and Compliance Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">
                                        NIN
                                    </Label>
                                    <p className="font-medium">{employee.nin || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        BVN
                                    </Label>
                                    <p className="font-medium">{employee.bvn || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Tax ID
                                    </Label>
                                    <p className="font-medium">{employee.taxIdentificationNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Pension PIN
                                    </Label>
                                    <p className="font-medium">{employee.pensionPin || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        PFA Name
                                    </Label>
                                    <p className="font-medium">{employee.pfaName || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        NHIS Number
                                    </Label>
                                    <p className="font-medium">{employee.nhisNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        NHF Number
                                    </Label>
                                    <p className="font-medium">{employee.nhfNumber || 'N/A'}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Statutory details can only be updated by your HR administrator.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button asChild variant="outline">
                            <Link href={employeeDashboard()}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}