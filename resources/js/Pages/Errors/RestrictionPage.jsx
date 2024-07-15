import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";

const RestrictionPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link href="dashboard">Go to Home</Link>
    </div>
  );
};

export default RestrictionPage;