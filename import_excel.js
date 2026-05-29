/**
 * FAMS Excel → MySQL Importer
 * Reads "Etat Login Windows_Casacity.xlsx" and generates
 * a SQL file to seed the gestion_casques database.
 *
 * Run: node import_excel.js
 */

import xlsx from 'xlsx';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Escape a value for SQL single-quoted strings */
function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').trim() + "'";
}

/** Convert Excel serial date → 'YYYY-MM-DD' or NULL */
function excelDateToSQL(serial) {
  if (!serial || typeof serial !== 'number') return 'NULL';
  const d = xlsx.SSF.parse_date_code(serial);
  if (!d) return 'NULL';
  const mm = String(d.m).padStart(2, '0');
  const dd = String(d.d).padStart(2, '0');
  return `'${d.y}-${mm}-${dd}'`;
}

/** Map "Is Active" numeric flag to meaningful label */
function mapControle(raw) {
  if (raw === null || raw === undefined) return 'Inconnu';
  return String(raw).trim() || 'Inconnu';
}

// ── Load workbook ─────────────────────────────────────────────────────────────
const filePath = path.join(__dirname, 'Etat Login Windows_Casacity.xlsx');
const wb = xlsx.readFile(filePath);

console.log('Sheets found:', wb.SheetNames);

// ── Sheet 1: "Etat Login" – raw agent account data ───────────────────────────
const sheetMain = wb.Sheets[wb.SheetNames[0]]; // "Etat Login" or first sheet
const rawMain   = xlsx.utils.sheet_to_json(sheetMain, { header: 1 });

// Row 0 = headers
const headersMain = rawMain[0];
console.log('\n[Sheet 1] Headers:', headersMain);
console.log('[Sheet 1] Data rows:', rawMain.length - 1);

// ── Sheet 2: "Nbr Login Actif" ────────────────────────────────────────────────
const sheetActif = wb.Sheets[wb.SheetNames[1]];
const rawActif   = xlsx.utils.sheet_to_json(sheetActif, { header: 1 });
// Headers are on row index 2
const headersActif = rawActif[2];
console.log('\n[Sheet 2] Headers:', headersActif);
console.log('[Sheet 2] Data rows:', rawActif.length - 3);

// ── Sheet 3: "SF" – Salesforce / HR data ─────────────────────────────────────
const sheetSF = wb.Sheets[wb.SheetNames[2]];
const rawSF   = xlsx.utils.sheet_to_json(sheetSF, { header: 1 });
const headersSF = rawSF[1];
console.log('\n[Sheet 3] Headers:', headersSF);
console.log('[Sheet 3] Data rows:', rawSF.length - 2);

// ── Build SQL ─────────────────────────────────────────────────────────────────
let sql = `-- ═══════════════════════════════════════════════════════════════════
-- FAMS – Excel Import: Etat Login Windows_Casacity.xlsx
-- Generated: ${new Date().toISOString()}
-- ═══════════════════════════════════════════════════════════════════

USE gestion_casques;

-- ─── Drop & recreate agent_accounts table ────────────────────────────────────
DROP TABLE IF EXISTS agent_accounts;
CREATE TABLE agent_accounts (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  employee_id      VARCHAR(20)   DEFAULT NULL,
  prenom           VARCHAR(100)  DEFAULT NULL,
  nom              VARCHAR(100)  DEFAULT NULL,
  facility         VARCHAR(150)  DEFAULT NULL,
  goscode          VARCHAR(50)   DEFAULT NULL,   -- Role: Agent / Coach / etc.
  project_name     VARCHAR(200)  DEFAULT NULL,
  title            VARCHAR(200)  DEFAULT NULL,
  samaccountname   VARCHAR(100)  DEFAULT NULL,   -- Windows login
  etat_login       VARCHAR(100)  DEFAULT NULL,   -- Actif / Verrouillé / Supprimé...
  date_in          DATE          DEFAULT NULL,
  date_out         DATE          DEFAULT NULL,
  last_login       DATE          DEFAULT NULL,
  ad_created       DATE          DEFAULT NULL,
  distinguished_dn TEXT          DEFAULT NULL,
  info             TEXT          DEFAULT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

`;

// ── INSERT rows from Sheet 1 (Etat Login) ─────────────────────────────────────
sql += `-- ─── Agent Accounts (from "Etat Login" sheet) ────────────────────────\n`;
sql += `INSERT INTO agent_accounts\n`;
sql += `  (employee_id, prenom, nom, facility, goscode, project_name, title,\n`;
sql += `   samaccountname, etat_login, date_in, date_out, last_login, ad_created, distinguished_dn, info)\nVALUES\n`;

const mainRows = rawMain.slice(1).filter(r => r && r.length > 2 && r[2]); // skip empty
const mainInserts = mainRows.map(r => {
  const employeeId    = esc(r[2]);   // Employee ID
  const prenom        = esc(r[3]);   // First Name
  const nom           = esc(r[4]);   // Last Name
  const facility      = esc(r[5]);   // Facility
  const goscode       = esc(r[6]);   // Role
  const projectName   = esc(r[7]);   // Project Name
  const title         = esc(r[8]);   // Title
  const samaccount    = esc(r[11]);  // Samaccountname (Windows login)
  const etatLogin     = esc(r[1]);   // Controle / Etat
  const dateIn        = excelDateToSQL(r[13]);
  const dateOut       = excelDateToSQL(r[14]);
  const lastLogin     = excelDateToSQL(r[12]);
  const adCreated     = excelDateToSQL(r[17]);
  const dn            = esc(r[15]);  // Distinguished Name
  const info          = esc(String(r[18] || '').substring(0, 500)); // truncate

  return `  (${employeeId}, ${prenom}, ${nom}, ${facility}, ${goscode}, ${projectName}, ${title}, ${samaccount}, ${etatLogin}, ${dateIn}, ${dateOut}, ${lastLogin}, ${adCreated}, ${dn}, ${info})`;
});

sql += mainInserts.join(',\n') + ';\n\n';

// ── DROP & recreate agent_actif table (Sheet 2) ───────────────────────────────
sql += `-- ─── Active Agents with Login (from "Nbr Login Actif" sheet) ─────────\n`;
sql += `DROP TABLE IF EXISTS agent_actif;\n`;
sql += `CREATE TABLE agent_actif (\n`;
sql += `  id           INT AUTO_INCREMENT PRIMARY KEY,\n`;
sql += `  facility     VARCHAR(150) DEFAULT NULL,\n`;
sql += `  employee_id  VARCHAR(20)  DEFAULT NULL,\n`;
sql += `  full_name    VARCHAR(200) DEFAULT NULL,\n`;
sql += `  goscode      VARCHAR(50)  DEFAULT NULL,\n`;
sql += `  project_name VARCHAR(200) DEFAULT NULL,\n`;
sql += `  date_in      DATE         DEFAULT NULL,\n`;
sql += `  date_out     DATE         DEFAULT NULL,\n`;
sql += `  login_count  INT          DEFAULT 1\n`;
sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

sql += `INSERT INTO agent_actif (facility, employee_id, full_name, goscode, project_name, date_in, date_out, login_count)\nVALUES\n`;
// Data starts at row index 3 in Sheet 2
const actifRows = rawActif.slice(3).filter(r => r && r.length > 2 && r[1]);
const actifInserts = actifRows.map(r => {
  const facility    = esc(r[0]);
  const empId       = esc(r[1]);
  const fullName    = esc(r[2]);
  const goscode     = esc(r[3]);
  const project     = esc(r[4]);
  const dateIn      = excelDateToSQL(r[5]);
  const dateOut     = excelDateToSQL(r[6]);
  const loginCount  = r[7] || 1;
  return `  (${facility}, ${empId}, ${fullName}, ${goscode}, ${project}, ${dateIn}, ${dateOut}, ${loginCount})`;
});
sql += actifInserts.join(',\n') + ';\n\n';

// ── DROP & recreate agent_sf table (Sheet 3 - SF/HR data) ────────────────────
sql += `-- ─── HR/SF Agent Data (from "SF" sheet) ──────────────────────────────\n`;
sql += `DROP TABLE IF EXISTS agent_sf;\n`;
sql += `CREATE TABLE agent_sf (\n`;
sql += `  id               INT AUTO_INCREMENT PRIMARY KEY,\n`;
sql += `  employee_id      VARCHAR(20)  DEFAULT NULL,\n`;
sql += `  full_name        VARCHAR(200) DEFAULT NULL,\n`;
sql += `  prenom           VARCHAR(100) DEFAULT NULL,\n`;
sql += `  nom              VARCHAR(100) DEFAULT NULL,\n`;
sql += `  goscode          VARCHAR(50)  DEFAULT NULL,\n`;
sql += `  supervisor_prenom VARCHAR(100) DEFAULT NULL,\n`;
sql += `  supervisor_nom   VARCHAR(100) DEFAULT NULL,\n`;
sql += `  project_name     VARCHAR(200) DEFAULT NULL,\n`;
sql += `  facility         VARCHAR(150) DEFAULT NULL,\n`;
sql += `  hire_date        DATE         DEFAULT NULL,\n`;
sql += `  termination_date DATE         DEFAULT NULL,\n`;
sql += `  nbr_login        INT          DEFAULT NULL\n`;
sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

sql += `INSERT INTO agent_sf (employee_id, full_name, prenom, nom, goscode, supervisor_prenom, supervisor_nom, project_name, facility, hire_date, termination_date, nbr_login)\nVALUES\n`;
// Data starts at row index 2 in Sheet 3
const sfRows = rawSF.slice(2).filter(r => r && r.length > 1 && r[0]);
const sfInserts = sfRows.map(r => {
  const empId     = esc(r[0]);
  const fullName  = esc(r[1]);
  const prenom    = esc(r[2]);
  const nom       = esc(r[3]);
  const goscode   = esc(r[4]);
  const supPre    = esc(r[5]);
  const supNom    = esc(r[6]);
  const project   = esc(r[7]);
  const facility  = esc(r[8]);
  const hireDate  = excelDateToSQL(r[9]);
  const termDate  = excelDateToSQL(r[10]);
  const loginNbr  = r[11] !== undefined ? r[11] : 'NULL';
  return `  (${empId}, ${fullName}, ${prenom}, ${nom}, ${goscode}, ${supPre}, ${supNom}, ${project}, ${facility}, ${hireDate}, ${termDate}, ${loginNbr})`;
});
sql += sfInserts.join(',\n') + ';\n\n';

// ── Create a view linking agents with their account status ────────────────────
sql += `-- ─── View: active_agents_full (joins SF + account status) ───────────\n`;
sql += `CREATE OR REPLACE VIEW active_agents_full AS
SELECT
  sf.employee_id,
  sf.full_name,
  sf.prenom,
  sf.nom,
  sf.goscode,
  CONCAT(sf.supervisor_prenom, ' ', sf.supervisor_nom) AS supervisor,
  sf.project_name,
  sf.facility,
  sf.hire_date,
  sf.termination_date,
  aa.samaccountname  AS windows_login,
  aa.etat_login,
  aa.last_login,
  aa.date_out        AS depart_date
FROM agent_sf sf
LEFT JOIN agent_accounts aa ON aa.employee_id = sf.employee_id
ORDER BY sf.project_name, sf.nom;\n\n`;

// ── Update existing affectations table with real agent names from SF ──────────
sql += `-- ─── Note ────────────────────────────────────────────────────────────\n`;
sql += `-- The existing tables (casques, demandes, affectations, historique)\n`;
sql += `-- are unchanged. The new tables above enrich the database with\n`;
sql += `-- real employee data from the Excel export.\n`;
sql += `-- Use agent_sf or active_agents_full when assigning headsets.\n`;

// ── Write to file ─────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, 'backend', 'excel_import.sql');
fs.writeFileSync(outPath, sql, 'utf8');

console.log(`\n✅ SQL file generated: ${outPath}`);
console.log(`   Main sheet rows inserted : ${mainInserts.length}`);
console.log(`   Active agents inserted   : ${actifInserts.length}`);
console.log(`   SF/HR agents inserted    : ${sfInserts.length}`);
console.log('\nNext step: import into MySQL with phpMyAdmin or:');
console.log('  mysql -u root gestion_casques < backend/excel_import.sql');
