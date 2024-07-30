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
            $table->integer('dep_company_id')->after('id')->nullable();
        });

        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->integer('dep_company_id')->after('order_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->dropColumn('dep_company_id');
        });

        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->dropColumn('dep_company_id');
        });
    }
};
