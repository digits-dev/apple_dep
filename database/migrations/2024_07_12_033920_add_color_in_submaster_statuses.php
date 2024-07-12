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
        Schema::table('dep_statuses', function (Blueprint $table) {
            $table->string('color')->after('status');
        });
        Schema::table('enrollment_statuses', function (Blueprint $table) {
            $table->string('color')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dep_statuses', function (Blueprint $table) {
            $table->dropColumn('color');
        });
        Schema::table('enrollment_statuses', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
