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
        Schema::create('enrollment_lists', function (Blueprint $table) {
            $table->id();
            $table->string('sales_order_no');
            $table->string('item_code');
            $table->string('serial_number');
            $table->string('transaction_id');
            $table->boolean('dep_status');
            $table->string('status_message');
            $table->string('enrollment_status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_lists');
    }
};
