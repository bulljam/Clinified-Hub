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
        // Update any existing 'approved' payment statuses to 'paid'
        DB::table('appointments')
            ->where('payment_status', 'approved')
            ->update(['payment_status' => 'paid']);

        // Update any existing 'refunded' payment statuses to 'cancelled'
        DB::table('appointments')
            ->where('payment_status', 'refunded')
            ->update(['payment_status' => 'cancelled']);

        // Drop and recreate payment_status column for appointments
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'on_hold', 'paid', 'cancelled'])->default('pending');
        });

        // Ensure transactions only have valid statuses (they should already be correct)
        // transactions table already has: 'pending', 'on_hold', 'paid', 'failed', 'cancelled'
        // This is correct as per requirements
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop and recreate payment_status column for appointments with old enum values
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'on_hold', 'paid', 'approved', 'cancelled', 'refunded'])->default('pending');
        });
    }
};
