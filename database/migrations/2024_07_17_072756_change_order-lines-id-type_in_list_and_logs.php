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
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->string('order_lines_id')->nullable()->change();
        });

        Schema::table('json_requests', function (Blueprint $table) {
            $table->string('order_lines_id')->nullable()->change();
        });

        Schema::table('json_responses', function (Blueprint $table) {
            $table->string('order_lines_id')->nullable()->change();
        });

        Schema::table('transaction_logs', function (Blueprint $table) {
            $table->string('order_lines_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->change();
        });

        Schema::table('json_requests', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->change();
        });

        Schema::table('json_responses', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->change();
        });

        Schema::table('transaction_logs', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->change();
        });
    }
};
