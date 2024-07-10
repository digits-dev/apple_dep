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
        Schema::create('list_of_order_lines', function (Blueprint $table) {
            $table->id();
            $table->integer('order_id');
            $table->string('digits_code');
            $table->string('item_description');
            $table->string('brand');
            $table->string('wh_category');
            $table->string('quantity');
            $table->string('serial_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_of_order_lines');
    }
};
