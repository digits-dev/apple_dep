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
        Schema::create('item_master', function (Blueprint $table) {
            $table->id();
            $table->string('digits_code');
            $table->string('upc_code_up_1')->nullable();
            $table->string('upc_code_up_2')->nullable();
            $table->string('upc_code_up_3')->nullable();
            $table->string('upc_code_up_4')->nullable();
            $table->string('upc_code_up_5')->nullable();
            $table->string('wh_category');
            $table->string('supplier_item_code');
            $table->string('item_description');
            $table->string('brand_description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_master');
    }
};
