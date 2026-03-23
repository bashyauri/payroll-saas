<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('slug')->nullable()->unique()->after('name');
            $table->string('type')->default('organization')->after('slug');
            $table->string('billing_status')->default('active')->index()->after('type');
            $table->timestamp('billing_status_updated_at')->nullable()->after('billing_status');
            $table->boolean('read_only_mode')->default(false)->after('billing_status_updated_at');
            $table->timestamp('suspended_at')->nullable()->after('read_only_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'slug',
                'type',
                'billing_status',
                'billing_status_updated_at',
                'read_only_mode',
                'suspended_at',
            ]);
        });
    }
};
