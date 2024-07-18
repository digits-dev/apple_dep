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
            $table->integer('created_by')->nullable()->after('enrollment_status');
            $table->integer('updated_by')->nullable()->after('created_at');
            $table->integer('returned_by')->nullable()->after('updated_at');
            $table->dateTime('returned_date')->nullable()->after('returned_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollment_lists', function (Blueprint $table) {
            $table->dropColumn('created_by');
            $table->dropColumn('updated_by');
            $table->dropColumn('returned_by');
            $table->dropColumn('returned_date');
        });
    }
};