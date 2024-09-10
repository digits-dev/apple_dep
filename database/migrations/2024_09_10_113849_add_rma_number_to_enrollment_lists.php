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
            $table->string('rma_number')->after('sales_order_no')->nullable();
        });

        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->string('rma_number')->after('quantity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->dropColumn('rma_number');
        });

        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->dropColumn('rma_number');
        });
    }
};
