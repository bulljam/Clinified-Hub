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
        Schema::create('deleted_users', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->string('name');
            $table->string('email');
            $table->enum('role', ['admin', 'provider', 'client']);
            $table->text('deletion_reason');
            $table->bigInteger('deleted_by');
            $table->json('user_data');
            $table->timestamps();

            $table->index('user_id');
            $table->index('role');
            $table->index('deleted_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deleted_users');
    }
};
