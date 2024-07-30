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
               // Change column type
               $table->integer('customer_name')->change();
               // Rename column
               $table->renameColumn('customer_name', 'customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
             // Revert the column rename
             $table->renameColumn('customer_id', 'customer_name');
             // Revert the column type change
             $table->string('customer_name')->change();
        });
    }
};
