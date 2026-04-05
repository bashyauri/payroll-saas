<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SubscriptionPlanSeeder::class,
        ]);

        // User::factory(10)->create();

        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => Hash::make('password')]
        );

        User::query()->updateOrCreate(
            ['email' => 'staff.test@example.com'],
            ['name' => 'Staff Test User', 'password' => Hash::make('password')]
        );

        User::query()->updateOrCreate(
            ['email' => 'manager.test@example.com'],
            ['name' => 'Manager Test User', 'password' => Hash::make('password')]
        );

        User::query()->updateOrCreate(
            ['email' => 'admin.test@example.com'],
            ['name' => 'Admin Test User', 'password' => Hash::make('password')]
        );
    }
}
