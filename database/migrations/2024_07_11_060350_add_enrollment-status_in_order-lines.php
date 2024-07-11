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
        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->integer('enrollment_status_id')->after('serial_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->dropColumn('enrollment_status_id');
        });
    }
};
