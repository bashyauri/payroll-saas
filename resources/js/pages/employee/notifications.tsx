import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    BellRing,
    CheckCircle,
    Clock,
    FileText,
    Info,
    Users,
    X,
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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard as employeeDashboard } from '@/routes/employee';
import type { BreadcrumbItem } from '@/types';

type NotificationProps = {
    employee: {
        id: string;
        firstName: string;
        lastName: string;
        workEmail: string | null;
    };
    notifications: Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        periodMonth?: string;
        read: boolean;
        createdAt: string;
    }>;
    unreadCount: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
    {
        title: 'Notifications',
        href: '/employee/notifications',
    },
];

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric',
    });
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'payslip_available':
            return <FileText className="h-5 w-5 text-green-600" />;
        case 'system':
            return <Info className="h-5 w-5 text-blue-600" />;
        case 'reminder':
            return <Bell className="h-5 w-5 text-amber-600" />;
        case 'leave':
            return <Users className="h-5 w-5 text-purple-600" />;
        default:
            return <BellRing className="h-5 w-5 text-gray-600" />;
    }
}

export default function Notifications({
    employee,
    notifications,
    unreadCount,
}: NotificationProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={employeeDashboard()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">Notifications</h1>
                            {unreadCount > 0 && (
                                <Badge variant="default" className="bg-red-600">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    You're all caught up! You'll see notifications here when payslips are available or when there are important updates.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-all hover:shadow-md ${
                                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.read && (
                                                            <Badge variant="default" className="bg-blue-600 text-xs">
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification.message}
                                                    </p>
                                                    {notification.periodMonth && (
                                                        <div className="mt-2">
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="h-auto p-0 text-blue-600"
                                                            >
                                                                View Payslip →
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(notification.createdAt)}
                                                    </div>
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8"
                                                        >
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BellRing className="h-5 w-5" />
                            Notification Preferences
                        </CardTitle>
                        <CardDescription>
                            Manage how you receive notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="font-medium">Payslip Notifications</p>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when your payslip is available
                                </p>
                            </div>
                            <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications via email
                                </p>
                            </div>
                            <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium">Leave Reminders</p>
                                <p className="text-sm text-muted-foreground">
                                    Get reminders about leave balance and requests
                                </p>
                            </div>
                            <Badge variant="secondary">Coming Soon</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Tips */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-900 mb-1">
                                    Notification Tips
                                </p>
                                <p className="text-sm text-blue-800">
                                    • Payslips are typically available within 24-48 hours after payroll finalization.
                                    • Important tax document notifications will appear here.
                                    • Ensure your email address is current to receive email notifications.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}