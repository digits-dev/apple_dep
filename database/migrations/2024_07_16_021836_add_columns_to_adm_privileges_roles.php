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
        Schema::table('adm_privileges_roles', function (Blueprint $table) {
            $table->tinyInteger('is_void')->nullable()->after('is_delete');
            $table->tinyInteger('is_override')->nullable()->after('is_void');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('adm_privileges_roles', function (Blueprint $table) {
            $table->dropColumn('is_void');
            $table->dropColumn('is_override');
        });
    }
};
