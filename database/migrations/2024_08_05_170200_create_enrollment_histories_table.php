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
        Schema::create('enrollment_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('dep_company_id')->nullable();
            $table->string('order_lines_id')->nullable();
            $table->string('sales_order_no');
            $table->string('item_code');
            $table->string('serial_number');
            $table->string('transaction_id')->nullable();
            $table->integer('dep_status')->nullable();
            $table->string('status_message')->nullable();
            $table->integer('enrollment_status');
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('returned_by')->nullable();
            $table->nullableTimestamps();
            $table->timestamp('returned_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_histories');
    }
};
