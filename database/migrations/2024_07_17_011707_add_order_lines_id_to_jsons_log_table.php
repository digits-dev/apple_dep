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
        Schema::table('json_requests', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->after('order_id');
        });
        Schema::table('json_responses', function (Blueprint $table) {
            $table->integer('order_lines_id')->nullable()->after('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('json_requests', function (Blueprint $table) {
            $table->dropColumn('order_lines_id');
        });
        Schema::table('json_responses', function (Blueprint $table) {
            $table->dropColumn('order_lines_id');
        });
    }
};