# Workflows n8n — publication automatique du blog

Sauvegarde versionnée des workflows n8n qui doivent alimenter ce blog.
Le flow n'est **pas** exécuté par Vercel : il vit dans une instance n8n hébergée à part.

## Où ça tourne

- **App Fly :** `n8n-anto` → https://n8n-anto.fly.dev (n8n v2.18.5, région CDG)
- **Données :** SQLite sur le volume Fly `n8n_data` (`/home/node/.n8n/database.sqlite`)
- **Login UI :** `jacques.bartoli@gmail.com` (⚠️ pas `jack@heyanto.fr`)

> Ces fichiers sont des **exports** (lecture seule). La source de vérité reste l'instance n8n.
> Ré-import : n8n → *Workflows* → *Import from File*.

## Workflow de référence

**`uIIOpgUkNlaznuRb` — « Blog Antò — Publication automatique v2 »** (15 nodes) :

```
Cron 7h
  → Google Sheets "articles" (lit une recette brute)
  → Gemini 2.5 Flash (génère l'article)
  → Parse
  → Grok (grok-imagine-image, génère l'image hero)
  → Gemini Vision (valide les proportions de l'image)
  → GitHub PUT  src/content/articles/{slug}.md
  → GitHub PUT  public/images/articles/{slug}-hero.jpg   (repo jacquesbartoli-ai/anto-blog)
  → Wait 90s (déploiement Vercel)
  → Facebook + Instagram + LinkedIn (via Buffer)
  → Google Sheets : marque la ligne "publié"
```

Les autres fichiers sont des itérations antérieures (`wwSJ…` v1 à 12 nodes, `1Iqz…` variante, `d6tj…` brouillon vide).

## État au 2026-06-15 — aucun article n'a jamais été posté

- Les 4 workflows sont **inactifs** (`active = 0`).
- La table `execution_entity` est **vide** (0 exécution, jamais — ni cron ni test).
- Construits/itérés le 2 mai 2026, puis jamais activés ni lancés.
- Côté Fly la VM tourne H24 (`min_machines_running=1`, `auto_stop=off`) → « actif sur Fly »,
  mais le moteur n8n tourne **à vide** faute de workflow activé.

## ⚠️ Blocage technique à lever avant de réactiver

Tous les nodes utilisent des expressions `{{ $env.* }}` (`GEMINI_API_KEY`, `XAI_API_KEY`,
`META_ACCESS_TOKEN`, `FB_PAGE_ID`, `IG_USER_ID`, `BUFFER_API_TOKEN`,
`BUFFER_LINKEDIN_CHANNEL_ID`, `GOOGLE_SHEET_ID`).

Or le secret **`N8N_BLOCK_ENV_ACCESS_IN_NODE=true`** est déployé sur l'app → l'accès à
`$env` depuis les nodes est **bloqué**. Activer le workflow en l'état le ferait échouer
dès le 1ᵉʳ node qui lit `$env`.

Deux options pour réactiver :
1. Lever le blocage : `fly secrets unset N8N_BLOCK_ENV_ACCESS_IN_NODE -a n8n-anto` (redéploie).
2. Migrer les `$env` vers des *Variables* n8n ou des credentials dédiées (plus propre).

Ensuite : bon login → vérifier que les credentials (GitHub Token, Meta Business Token,
Google Sheets/Drive OAuth2) sont valides → 1 run de test manuel → activer le Cron.

> ⚠️ Activer le flow a des effets externes : commits réels sur ce repo + posts
> Facebook / Instagram / LinkedIn. Ne pas activer sans intention claire.
