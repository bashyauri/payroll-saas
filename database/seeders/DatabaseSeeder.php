<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Staff Test User',
            'email' => 'staff.test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Manager Test User',
            'email' => 'manager.test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin Test User',
            'email' => 'admin.test@example.com',
        ]);
    }
}
