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
        DB::table('appointments')
            ->where('payment_status', 'approved')
            ->update(['payment_status' => 'paid']);

        DB::table('appointments')
            ->where('payment_status', 'refunded')
            ->update(['payment_status' => 'cancelled']);

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'on_hold', 'paid', 'cancelled'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'on_hold', 'paid', 'approved', 'cancelled', 'refunded'])->default('pending');
        });
    }
};
