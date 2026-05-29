# FAMS – PHP Backend

> **Foundever Asset Management System** — REST API backend for the React/Vite frontend.

---

## 📁 File Structure

```
backend/
├── index.php      ← Main router / single entry point
├── Database.php   ← PDO singleton connection class
├── config.php     ← DB credentials & constants
├── schema.sql     ← Database schema + seed data
├── .htaccess      ← Apache routing rules
└── README.md      ← This file
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **XAMPP** (or WAMP/Laragon) with Apache + MySQL + PHP ≥ 8.0

### 2. Copy files to XAMPP
Copy the entire `backend/` folder to your Apache web root:
```
C:\xampp\htdocs\gestion_casques\
```
So that the URL `http://localhost/gestion_casques/index.php` works.

### 3. Create the database
1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Click **Import** → choose `backend/schema.sql` → click **Go**

OR run via terminal:
```bash
mysql -u root -p < schema.sql
```

### 4. Update credentials (if needed)
Edit `config.php` and adjust `DB_USER` / `DB_PASS` / `ALLOWED_ORIGIN` to match your setup.

### 5. Start the frontend
```bash
cd Fams
npm install
npm run dev
```

---

## 🔐 Default Credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@foundever.com`  |
| Password | `Admin@1234`           |

---

## 📡 API Endpoints

All endpoints are at `http://localhost/gestion_casques/index.php`

| Method | `?request=`    | Description                           |
|--------|----------------|---------------------------------------|
| GET    | `auth`         | Check current session                 |
| POST   | `auth`         | Login `{ email, password }`           |
| POST   | `auth`         | Logout `{ action: 'logout' }`         |
| GET    | `casques`      | List all headsets                     |
| POST   | `casques`      | Add headset `{ numero_serie, marque, etat }` |
| PUT    | `casques`      | Update headset `{ id_casque, ... }`   |
| DELETE | `casques&id=X` | Delete headset by ID                  |
| GET    | `demandes`     | List all agent requests               |
| POST   | `demandes`     | Create request `{ agent, type, priority }` |
| PUT    | `demandes`     | Update status `{ id, statut }`        |
| GET    | `historique`   | Activity log (paginated)              |
| GET    | `affectations` | List all assignments                  |
| POST   | `affectations` | Assign headset `{ numero_serie, matricule }` |
| GET    | `stats`        | Dashboard statistics                  |

---

## 🔒 Security Notes

- All routes (except `auth`) require an active session — unauthorized requests get HTTP 401.
- Passwords are stored as **bcrypt** hashes (`password_hash()`).
- SQL injection is prevented via **PDO prepared statements**.
- CORS is restricted to the configured frontend origin (`ALLOWED_ORIGIN` in `config.php`).
