-- ─────────────────────────────────────────────────────────────────────────────
-- FAMS – Foundever Asset Management System
-- Database Schema + Seed Data
-- Run this in phpMyAdmin or via: mysql -u root -p < schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS gestion_casques
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestion_casques;

-- ─── UTILISATEURS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS utilisateurs (
  id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
  nom            VARCHAR(100)  NOT NULL,
  email          VARCHAR(150)  NOT NULL UNIQUE,
  mot_de_passe   VARCHAR(255)  NOT NULL,           -- bcrypt hash
  role           ENUM('admin', 'it', 'viewer') NOT NULL DEFAULT 'viewer',
  last_login     DATETIME      DEFAULT NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── CASQUES (Headsets) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casques (
  id_casque    INT AUTO_INCREMENT PRIMARY KEY,
  numero_serie VARCHAR(100) NOT NULL UNIQUE,
  marque       VARCHAR(100) NOT NULL,
  etat         ENUM('Disponible','Affecté','Maintenance') NOT NULL DEFAULT 'Disponible',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── DEMANDES (Agent Requests) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demandes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  agent         VARCHAR(100) NOT NULL,
  type_demande  VARCHAR(200) NOT NULL,
  priorite      ENUM('Basse','Moyenne','Haute','Urgent') NOT NULL DEFAULT 'Moyenne',
  statut        ENUM('En attente','Approuvé','Refusé')   NOT NULL DEFAULT 'En attente',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── AFFECTATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affectations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  id_casque       INT NOT NULL,
  matricule_agent VARCHAR(50) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_casque) REFERENCES casques(id_casque) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── HISTORIQUE (Audit Log) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS historique (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  action     VARCHAR(50)  NOT NULL,
  target     VARCHAR(100) NOT NULL,
  user_nom   VARCHAR(100) NOT NULL DEFAULT 'System',
  details    TEXT         DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────────────────────────────────────

-- Default admin user  (password: Admin@1234)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
  ('Admin Salma',  'admin@foundever.com',  '$2y$12$XxPJ7q5pO2ZHUb7e3bKPOe7BYnAjqNuvJmhk0qqCd2tLFqkNfmqoW', 'admin'),
  ('Jaouad IT',    'it@foundever.com',     '$2y$12$XxPJ7q5pO2ZHUb7e3bKPOe7BYnAjqNuvJmhk0qqCd2tLFqkNfmqoW', 'it');

-- Casques (Headsets)
INSERT INTO casques (numero_serie, marque, etat) VALUES
  ('SN-JAB-001', 'Jabra',    'Disponible'),
  ('SN-JAB-002', 'Jabra',    'Affecté'),
  ('SN-JAB-003', 'Jabra',    'Maintenance'),
  ('SN-JAB-004', 'Jabra',    'Disponible'),
  ('SN-JAB-005', 'Logitech', 'Disponible'),
  ('SN-JAB-006', 'Logitech', 'Affecté'),
  ('SN-JAB-007', 'Jabra',    'Disponible'),
  ('SN-JAB-008', 'Jabra',    'Maintenance'),
  ('SN-JAB-009', 'Logitech', 'Disponible'),
  ('SN-JAB-010', 'Jabra',    'Affecté');

-- Demandes (Agent Requests)
INSERT INTO demandes (agent, type_demande, priorite, statut) VALUES
  ('Sami Alami',     'Nouveau Casque (Jabra 65)',         'Haute',   'En attente'),
  ('Nadia Tazi',     'Mousses de rechange',               'Moyenne', 'Approuvé'),
  ('Karim Bennani',  'Microphone non fonctionnel',        'Urgent',  'Refusé'),
  ('Salma Lahiaoui', 'Câble Jabra 2300 cassé',            'Basse',   'En attente'),
  ('Anass Mabsout',  'Jabra Evolve 20 (Nouveau)',         'Moyenne', 'Approuvé'),
  ('Evlina Lamia',   'Batterie (Bluetooth) HS',           'Urgent',  'En attente'),
  ('Nissrine Mijel', 'Grésillement dans l\'écouteur',     'Basse',   'Approuvé'),
  ('Younes Khallouf','Serre-tête cassé',                  'Haute',   'Refusé'),
  ('Brahim Hafidi',  'Mise à jour Firmware (Jabra Link)', 'Moyenne', 'En attente'),
  ('Amine Radi',     'Perte de connexion USB',            'Urgent',  'En attente'),
  ('Zineb Mansouri', 'Remplacement Jabra Evolve 65',      'Basse',   'Approuvé'),
  ('Omar Sadiki',    'Volume bloqué au max',              'Haute',   'En attente');

-- Historique (Audit Log)
INSERT INTO historique (action, target, user_nom, details, created_at) VALUES
  ('Ajout',       'SN-JAB-001', 'Admin_Salma',  'Nouveau Jabra Evolve 65 ajouté à l\'inventaire.',          '2026-03-31 09:15:00'),
  ('Modification','SN-JAB-004', 'Admin_Jaouad', 'Changement d\'utilisateur : Salma → Anas.',                '2026-03-30 14:20:00'),
  ('Suppression', 'SN-JAB-009', 'System',       'Matériel retiré (HS).',                                     '2026-03-30 10:05:00'),
  ('Approbation', 'REQ-442',    'Admin_Salma',  'Demande de nouveau casque approuvée pour Sami Alami.',     '2026-03-29 16:45:00'),
  ('Modification','SN-JAB-002', 'Admin_Jaouad', 'Statut changé : En service → En réparation.',              '2026-03-29 11:30:00'),
  ('Ajout',       'SN-JAB-015', 'Admin_Salma',  'Stock mis à jour (+10 unités).',                           '2026-03-28 08:50:00');
