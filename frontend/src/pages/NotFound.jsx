import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page Not Found</p>
      <Link
        to="/"
        className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
