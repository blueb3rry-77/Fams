<?php
/**
 * FAMS – Foundever Asset Management System
 * PHP Backend — Single Entry Point
 *
 * Routes:
 *   GET  ?request=auth         → check session
 *   POST ?request=auth         → login  |  { action: 'logout' } → logout
 *   GET  ?request=casques      → list all headsets
 *   POST ?request=casques      → add headset
 *   PUT  ?request=casques      → update headset
 *   DELETE ?request=casques&id=X → delete headset
 *   GET  ?request=demandes     → list all requests
 *   POST ?request=demandes     → create request
 *   PUT  ?request=demandes     → update request status
 *   GET  ?request=historique   → get activity log
 *   POST ?request=affectations → assign headset to agent
 *   GET  ?request=stats        → dashboard statistics
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Database.php';

// ─── Session ─────────────────────────────────────────────────────────────────
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');   // set to '1' in production with HTTPS
ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
session_start();

// ─── CORS Headers ────────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [ALLOWED_ORIGIN, 'http://localhost:5174', 'http://127.0.0.1:5173'];

if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function json_out(mixed $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function get_body(): array {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function require_auth(): void {
    if (empty($_SESSION['user'])) {
        json_out(['error' => 'Non authentifié', 'loggedIn' => false], 401);
    }
}

function log_action(PDO $db, string $action, string $target, string $details = ''): void {
    $userId = $_SESSION['user']['id_utilisateur'] ?? null;
    $userName = $_SESSION['user']['nom'] ?? 'System';
    $stmt = $db->prepare("
        INSERT INTO historique (action, target, user_nom, details, created_at)
        VALUES (:action, :target, :user_nom, :details, NOW())
    ");
    $stmt->execute([
        ':action'   => $action,
        ':target'   => $target,
        ':user_nom' => $userName,
        ':details'  => $details,
    ]);
}

// ─── Router ──────────────────────────────────────────────────────────────────
$request = $_GET['request'] ?? '';
$method  = $_SERVER['REQUEST_METHOD'];
$db      = Database::getInstance();

switch ($request) {

    // ═════════════════════════════════════════════════════════════════════════
    // AUTH
    // ═════════════════════════════════════════════════════════════════════════
    case 'auth':
        if ($method === 'GET') {
            // Check session
            if (!empty($_SESSION['user'])) {
                json_out([
                    'loggedIn' => true,
                    'user'     => $_SESSION['user'],
                ]);
            } else {
                json_out(['loggedIn' => false, 'user' => null]);
            }
        }

        if ($method === 'POST') {
            $body = get_body();

            // Logout
            if (($body['action'] ?? '') === 'logout') {
                $_SESSION = [];
                session_destroy();
                json_out(['success' => true, 'message' => 'Déconnecté']);
            }

            // Login
            $email    = trim($body['email']    ?? '');
            $password = $body['password'] ?? '';

            if (!$email || !$password) {
                json_out(['success' => false, 'message' => 'Email et mot de passe requis'], 400);
            }

            $stmt = $db->prepare("
                SELECT id_utilisateur, nom, email, role, mot_de_passe
                FROM utilisateurs
                WHERE email = :email
                LIMIT 1
            ");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['mot_de_passe'])) {
                json_out(['success' => false, 'message' => 'Email ou mot de passe incorrect'], 401);
            }

            // Remove password hash from session data
            unset($user['mot_de_passe']);
            $_SESSION['user'] = $user;

            // Update last_login
            $db->prepare("UPDATE utilisateurs SET last_login = NOW() WHERE id_utilisateur = :id")
               ->execute([':id' => $user['id_utilisateur']]);

            json_out(['success' => true, 'user' => $user]);
        }
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // CASQUES (Headsets)
    // ═════════════════════════════════════════════════════════════════════════
    case 'casques':
        require_auth();

        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM casques ORDER BY created_at DESC");
            json_out($stmt->fetchAll());
        }

        if ($method === 'POST') {
            $body = get_body();
            $sn    = trim($body['numero_serie'] ?? '');
            $marque = trim($body['marque'] ?? '');
            $etat  = $body['etat'] ?? 'Disponible';

            if (!$sn || !$marque) {
                json_out(['success' => false, 'message' => 'Numéro de série et marque requis'], 400);
            }

            $allowed_etat = ['Disponible', 'Affecté', 'Maintenance'];
            if (!in_array($etat, $allowed_etat)) {
                json_out(['success' => false, 'message' => 'État invalide'], 400);
            }

            // Check duplicate SN
            $check = $db->prepare("SELECT id_casque FROM casques WHERE numero_serie = :sn");
            $check->execute([':sn' => $sn]);
            if ($check->fetch()) {
                json_out(['success' => false, 'message' => 'Ce numéro de série existe déjà'], 409);
            }

            $stmt = $db->prepare("
                INSERT INTO casques (numero_serie, marque, etat, created_at)
                VALUES (:sn, :marque, :etat, NOW())
            ");
            $stmt->execute([':sn' => $sn, ':marque' => $marque, ':etat' => $etat]);
            $id = $db->lastInsertId();

            log_action($db, 'Ajout', $sn, "Nouveau casque {$marque} ajouté à l'inventaire.");

            json_out(['success' => true, 'id_casque' => $id], 201);
        }

        if ($method === 'PUT') {
            $body   = get_body();
            $id     = (int)($body['id_casque'] ?? 0);
            $sn     = trim($body['numero_serie'] ?? '');
            $marque = trim($body['marque'] ?? '');
            $etat   = $body['etat'] ?? '';

            if (!$id || !$sn || !$marque || !$etat) {
                json_out(['success' => false, 'message' => 'Données incomplètes'], 400);
            }

            $stmt = $db->prepare("
                UPDATE casques
                SET numero_serie = :sn, marque = :marque, etat = :etat, updated_at = NOW()
                WHERE id_casque = :id
            ");
            $stmt->execute([':sn' => $sn, ':marque' => $marque, ':etat' => $etat, ':id' => $id]);

            log_action($db, 'Modification', $sn, "Casque #{$id} modifié : marque={$marque}, état={$etat}.");

            json_out(['success' => true]);
        }

        if ($method === 'DELETE') {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                json_out(['success' => false, 'message' => 'ID requis'], 400);
            }

            // Get SN before deleting
            $row = $db->prepare("SELECT numero_serie FROM casques WHERE id_casque = :id");
            $row->execute([':id' => $id]);
            $casque = $row->fetch();

            if (!$casque) {
                json_out(['success' => false, 'message' => 'Casque introuvable'], 404);
            }

            $db->prepare("DELETE FROM casques WHERE id_casque = :id")->execute([':id' => $id]);

            log_action($db, 'Suppression', $casque['numero_serie'], 'Matériel retiré de l\'inventaire.');

            json_out(['success' => true]);
        }
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // DEMANDES (Agent Requests)
    // ═════════════════════════════════════════════════════════════════════════
    case 'demandes':
        require_auth();

        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM demandes ORDER BY created_at DESC");
            json_out($stmt->fetchAll());
        }

        if ($method === 'POST') {
            $body     = get_body();
            $agent    = trim($body['agent']    ?? '');
            $type     = trim($body['type']     ?? '');
            $priority = trim($body['priority'] ?? 'Moyenne');

            if (!$agent || !$type) {
                json_out(['success' => false, 'message' => 'Agent et type de demande requis'], 400);
            }

            $stmt = $db->prepare("
                INSERT INTO demandes (agent, type_demande, priorite, statut, created_at)
                VALUES (:agent, :type, :priority, 'En attente', NOW())
            ");
            $stmt->execute([':agent' => $agent, ':type' => $type, ':priority' => $priority]);
            $id = $db->lastInsertId();

            log_action($db, 'Demande', "REQ-{$id}", "Nouvelle demande de {$agent} : {$type}.");

            json_out(['success' => true, 'id' => $id], 201);
        }

        if ($method === 'PUT') {
            $body   = get_body();
            $id     = (int)($body['id']     ?? 0);
            $statut = trim($body['statut']  ?? '');

            $allowed_statuts = ['En attente', 'Approuvé', 'Refusé'];
            if (!$id || !in_array($statut, $allowed_statuts)) {
                json_out(['success' => false, 'message' => 'Données invalides'], 400);
            }

            $stmt = $db->prepare("UPDATE demandes SET statut = :statut WHERE id = :id");
            $stmt->execute([':statut' => $statut, ':id' => $id]);

            $action = $statut === 'Approuvé' ? 'Approbation' : 'Refus';
            log_action($db, $action, "REQ-{$id}", "Demande #{$id} mise à jour : {$statut}.");

            json_out(['success' => true]);
        }
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // HISTORIQUE (Activity Log)
    // ═════════════════════════════════════════════════════════════════════════
    case 'historique':
        require_auth();

        if ($method === 'GET') {
            $limit  = min((int)($_GET['limit']  ?? 50), 200);
            $offset = max((int)($_GET['offset'] ?? 0),  0);

            $stmt = $db->prepare("
                SELECT id, action, target, user_nom, details,
                       DATE(created_at) AS date,
                       TIME_FORMAT(created_at, '%H:%i') AS time
                FROM historique
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            ");
            $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $total = $db->query("SELECT COUNT(*) FROM historique")->fetchColumn();

            json_out([
                'logs'   => $stmt->fetchAll(),
                'total'  => (int)$total,
                'limit'  => $limit,
                'offset' => $offset,
            ]);
        }
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // AFFECTATIONS (Assign headset to agent)
    // ═════════════════════════════════════════════════════════════════════════
    case 'affectations':
        require_auth();

        if ($method === 'GET') {
            $stmt = $db->query("
                SELECT a.*, c.numero_serie, c.marque, c.etat
                FROM affectations a
                JOIN casques c ON a.id_casque = c.id_casque
                ORDER BY a.created_at DESC
            ");
            json_out($stmt->fetchAll());
        }

        if ($method === 'POST') {
            $body       = get_body();
            $sn         = trim($body['numero_serie'] ?? '');
            $matricule  = trim($body['matricule']    ?? '');

            if (!$sn || !$matricule) {
                json_out(['success' => false, 'message' => 'S/N et matricule requis'], 400);
            }

            // Find the casque by SN
            $row = $db->prepare("SELECT id_casque FROM casques WHERE numero_serie = :sn AND etat = 'Disponible'");
            $row->execute([':sn' => $sn]);
            $casque = $row->fetch();

            if (!$casque) {
                json_out(['success' => false, 'message' => 'Casque introuvable ou non disponible'], 404);
            }

            // Create affectation
            $stmt = $db->prepare("
                INSERT INTO affectations (id_casque, matricule_agent, created_at)
                VALUES (:id_casque, :matricule, NOW())
            ");
            $stmt->execute([':id_casque' => $casque['id_casque'], ':matricule' => $matricule]);

            // Update casque state
            $db->prepare("UPDATE casques SET etat = 'Affecté', updated_at = NOW() WHERE id_casque = :id")
               ->execute([':id' => $casque['id_casque']]);

            log_action($db, 'Affectation', $sn, "Casque {$sn} affecté à l'agent {$matricule}.");

            json_out(['success' => true], 201);
        }
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // STATS (Dashboard Statistics)
    // ═════════════════════════════════════════════════════════════════════════
    case 'stats':
        require_auth();

        $total      = $db->query("SELECT COUNT(*) FROM casques")->fetchColumn();
        $disponible = $db->query("SELECT COUNT(*) FROM casques WHERE etat = 'Disponible'")->fetchColumn();
        $affecte    = $db->query("SELECT COUNT(*) FROM casques WHERE etat = 'Affecté'")->fetchColumn();
        $maintenance= $db->query("SELECT COUNT(*) FROM casques WHERE etat = 'Maintenance'")->fetchColumn();
        $enAttente  = $db->query("SELECT COUNT(*) FROM demandes WHERE statut = 'En attente'")->fetchColumn();

        json_out([
            'total_casques'      => (int)$total,
            'casques_disponibles'=> (int)$disponible,
            'casques_affectes'   => (int)$affecte,
            'casques_maintenance'=> (int)$maintenance,
            'demandes_en_attente'=> (int)$enAttente,
            'disponibilite_pct'  => $total > 0 ? round(($disponible / $total) * 100) : 0,
        ]);
        break;

    // ═════════════════════════════════════════════════════════════════════════
    // 404
    // ═════════════════════════════════════════════════════════════════════════
    default:
        json_out(['error' => "Route '?request={$request}' introuvable"], 404);
}
