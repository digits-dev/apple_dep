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
        Schema::create('pull_erp_erros', function (Blueprint $table) {
            $table->id();
            $table->integer('order_number')->nullable();
            $table->string('customer_name')->nullable();
            $table->integer('line_number')->nullable();
            $table->string('order_ref_no')->nullable();
            $table->string('dr_number')->nullable();
            $table->string('digits_code')->nullable();
            $table->string('item_description')->nullable();
            $table->string('brand')->nullable();
            $table->string('wh_category')->nullable();
            $table->string('shipped_quantity')->nullable();
            $table->dateTime('confirm_date')->nullable();
            $table->string('serial1')->nullable();
            $table->string('serial2')->nullable();
            $table->string('serial3')->nullable();
            $table->string('serial4')->nullable();
            $table->string('serial5')->nullable();
            $table->string('serial6')->nullable();
            $table->string('serial7')->nullable();
            $table->string('serial8')->nullable();
            $table->string('serial9')->nullable();
            $table->string('serial10')->nullable();
            $table->string('errors_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pull_erp_erros');
    }
};
