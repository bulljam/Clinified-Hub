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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('photo');
            $table->date('date_of_birth')->nullable()->after('gender');
            $table->string('city')->nullable()->after('date_of_birth');
            $table->string('specialty')->nullable()->after('city'); // For providers
            $table->integer('years_of_experience')->nullable()->after('specialty'); // For providers
            $table->text('bio')->nullable()->after('years_of_experience');
            $table->string('phone')->nullable()->after('bio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'date_of_birth',
                'city',
                'specialty',
                'years_of_experience',
                'bio',
                'phone'
            ]);
        });
    }
};
