<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollRun;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display notifications for the employee.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        // Get recent payroll runs for payslip notifications
        $recentPayrollRuns = PayrollRun::query()
            ->where('status', PayrollRun::STATUS_FINALIZED)
            ->orderByDesc('finalized_at')
            ->limit(5)
            ->get()
            ->map(function (PayrollRun $run) {
                return [
                    'id' => $run->id,
                    'type' => 'payslip_available',
                    'title' => 'Payslip Available',
                    'message' => "Your payslip for {$run->period_month} is now available.",
                    'periodMonth' => $run->period_month,
                    'finalizedAt' => $run->finalized_at?->toIso8601String(),
                    'read' => false, // In a real system, this would track read status
                    'createdAt' => $run->finalized_at?->toIso8601String(),
                ];
            });

        // System notifications (placeholder for now)
        $systemNotifications = [
            [
                'id' => 'sys-1',
                'type' => 'system',
                'title' => 'Welcome to Employee Self-Service',
                'message' => 'Your employee self-service portal is now active. You can view your payslips, update your profile, and access tax documents.',
                'read' => false,
                'createdAt' => now()->toIso8601String(),
            ],
            [
                'id' => 'sys-2',
                'type' => 'reminder',
                'title' => 'Profile Update Reminder',
                'message' => 'Please ensure your contact information and bank details are up to date for smooth payroll processing.',
                'read' => false,
                'createdAt' => now()->subDays(7)->toIso8601String(),
            ],
        ];

        // Combine and sort notifications
        $allNotifications = collect([...$systemNotifications, ...$recentPayrollRuns])
            ->sortByDesc('createdAt')
            ->values()
            ->all();

        // Count unread notifications
        $unreadCount = collect($allNotifications)->where('read', false)->count();

        return Inertia::render('employee/notifications', [
            'employee' => [
                'id' => $employee->id,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'workEmail' => $employee->work_email,
            ],
            'notifications' => $allNotifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request): \Illuminate\Http\JsonResponse
    {
        $notificationId = $request->input('notification_id');
        
        // In a real implementation, this would update the notification read status in the database
        // For now, we'll return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): \Illuminate\Http\JsonResponse
    {
        // In a real implementation, this would update all notification read statuses for the user
        // For now, we'll return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }
}