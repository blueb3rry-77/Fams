<?php
// ─── Database Configuration ─────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Change this if needed
define('DB_PASS', '');            // Change this if needed
define('DB_NAME', 'gestion_casques');

// ─── Session Config ──────────────────────────────────────────────────────────
define('SESSION_LIFETIME', 3600); // 1 hour

// ─── CORS Origins ────────────────────────────────────────────────────────────
define('ALLOWED_ORIGIN', 'http://localhost:5174'); // Vite dev server (also accepts 5173)
