<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class TenantRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $hr = Role::firstOrCreate(['name' => 'hr', 'guard_name' => 'web']);
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $managePayroll = Permission::firstOrCreate(['name' => 'manage payroll', 'guard_name' => 'web']);
        $addEmployee = Permission::firstOrCreate(['name' => 'add employee', 'guard_name' => 'web']);
        $viewPayroll = Permission::firstOrCreate(['name' => 'view payroll', 'guard_name' => 'web']);
        $manageSettings = Permission::firstOrCreate(['name' => 'manage settings', 'guard_name' => 'web']);

        $admin->syncPermissions([$managePayroll, $addEmployee, $viewPayroll, $manageSettings]);
        $hr->syncPermissions([$addEmployee, $viewPayroll]);
        $staff->syncPermissions([$viewPayroll]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
