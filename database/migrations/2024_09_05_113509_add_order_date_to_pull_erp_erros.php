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
        Schema::table('pull_erp_erros', function (Blueprint $table) {
            $table->date('order_date')->after('confirm_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pull_erp_erros', function (Blueprint $table) {
            $table->dropColumn('order_date');
        });
    }
};