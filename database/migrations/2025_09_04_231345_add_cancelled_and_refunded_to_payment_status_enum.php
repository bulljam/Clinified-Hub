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
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'on_hold', 'paid', 'approved', 'cancelled', 'refunded'])->default('pending');
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
            $table->enum('payment_status', ['pending', 'on_hold', 'paid'])->default('pending');
        });
    }
};
