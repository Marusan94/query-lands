# LAB.CORE — Campus Central

Plataforma estilo Duolingo para **pruebas técnicas reales de entrevistas**: SQL y JavaScript, 100% interactiva, con viaje por islas, salas de niveles, racha, XP, repaso espaciado y tutor IA.

> Diseño propio inspirado en patrones públicos de apps de aprendizaje (ruta guiada, microlecciones, feedback inmediato, gamificación). Ver `DESIGN.md`.

## Qué incluye

```text
[16 retos SQL] SELECT → window functions, con ingeniería inversa de
  DataLemur, HackerRank, StrataScratch y LeetCode DB. Validación por
  result-sets + tests ocultos que atrapan memorización.
[3 retos JS] FizzBuzz, palíndromo, agrupa-y-promedia, con tests visibles + ocultos.
[Viaje por islas] 4 islas animadas (día, faro nocturno, volcán, cristales),
  mapa en mitad opuesta al tema (yin-yang), ruta dorada que se llena, tesoro final.
[Salas de nivel] Cada isla es una torre de pisos N1..Nn con XP y dominio.
[Simulacro] 4 retos en 45 min + corrección IA con rúbrica.
[✦ IA con Gemini] Tutor socrático, explicador, generador de retos
  auto-validados en SQLite real.
[Gamificación] XP, niveles/100, racha con heatmap, monedas, logros,
  misiones diarias, meta diaria, certificado imprimible.
[Lectura amable] Sin negros/blancos puros, modo calma, foco visible,
  skip-link, tamaño de texto, sonido desactivable, reduced-motion.
[Modo claro/oscuro] Equilibrados como yin-yang + toggle ☯ en la barra.
```

## Rutas

```text
/                  Aprender (curso, meta diaria, continuar, viaje)
/sql               Camino + lista libre del track SQL
/sql/[slug]        Reto SQL (intro, editor, COMPROBAR, tutor IA)
/sql/isla/[unidad] Sala de la isla (pisos N1..Nn)
/sql/simulacro     Examen 45 min + corrección IA
/js · /js/[slug]   Track JavaScript
/lab/generar       Generador de retos con IA
/repasar           Débiles + programados + repaso rápido (repetición espaciada)
/desafios          Misiones diarias + simulacro + logros
/logros            Badges + mapa 8 semanas + certificado
/perfil            Nivel, stats, semana, tiempo
/ajustes           Nombre, meta, texto, tema, calma, sonido, exportar, borrar
/cursos · /empezar Cursos + onboarding en 4 pasos
```

## Correr local

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

## Variables de entorno

```bash
# .env.local (solo servidor, nunca NEXT_PUBLIC)
GEMINI_API_KEY=tu-key   # tutor, generador y corrección IA
```

Sin key, la app funciona completa salvo los botones [✦] (muestran error amable).

## Verificación

```bash
pnpm lint
pnpm test    # comparador, curriculum, camino, gamificación, prompts, soluciones en SQLite real
pnpm build
```

## Stack

```text
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4
sql.js (SQLite WASM en browser) · @google/generative-ai (Gemini Flash)
Vitest · localStorage (progreso, drafts, mastery, perfil)
```

## Estructura

```text
src/app/            rutas + 3 API (/api/tutor, /api/generar, /api/correccion)
src/components/     runners, camino, islas, sala, toggles, celebración…
src/lib/            curriculum(s), engine, path, progress, estado, logros, ai/, sonido
public/sql-wasm.*   motor SQLite para browser
DESIGN.md           especificación de diseño (fuente de verdad)
```

## Roadmap

```text
[ ] Track Python (Pyodide)
[ ] Liga entre amigos (ranking local → compartido)
[ ] Tienda: gastar monedas en temas y protección de racha
[ ] PWA offline
```

## Licencia

Uso personal/educativo. Contenido de práctica original del proyecto.
