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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('enrollment_status')->change();
        });
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->string('dep_status')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('enrollment_status')->change();
        });
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->boolean('dep_status')->change();
        });
    }
};
