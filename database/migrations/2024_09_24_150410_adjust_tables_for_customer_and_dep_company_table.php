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
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('party_number');
            $table->dropColumn('customer_code');
            $table->longText('note')->nullable()->after('customer_name');
        });

        Schema::table('dep_companies', function (Blueprint $table) {
            $table->string('dep_organization_id')->nullable()->after('customer_id');
            $table->longText('note')->nullable()->after('dep_company_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('party_number')->nullable()->after('id');
            $table->string('customer_code')->nullable()->after('party_number');
            $table->dropColumn('note');
        });

        Schema::table('dep_companies', function (Blueprint $table) {
            $table->dropColumn('dep_organization_id');
            $table->dropColumn('note');
        });

    }
};
