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
        Schema::table('actions', function (Blueprint $table) {
           $table->boolean('status')->default(1)->after('action_name');
        });
        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('customer_name');
        });
        Schema::table('dep_statuses', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('dep_status');
        });
        Schema::table('enrollment_statuses', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('enrollment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actions', function (Blueprint $table) {
            $table->dropColumn('status');
         });
         Schema::table('customers', function (Blueprint $table) {
             $table->dropColumn('status');
         });
         Schema::table('dep_statuses', function (Blueprint $table) {
             $table->dropColumn('status');
         });
         Schema::table('enrollment_statuses', function (Blueprint $table) {
             $table->dropColumn('status');
         });
    }
};
