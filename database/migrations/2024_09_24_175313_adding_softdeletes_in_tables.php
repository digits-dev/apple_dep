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
            $table->softDeletes();
        });
        Schema::table('enrollment_histories', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('list_of_order_lines', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_lists', function (Blueprint $table) {
             $table->dropColumn('deleted_at');
        });
        Schema::table('enrollment_histories', function (Blueprint $table) {
             $table->dropColumn('deleted_at');
        });
        Schema::table('list_of_order_lines', function (Blueprint $table) {
             $table->dropColumn('deleted_at');
        });
    }
};
