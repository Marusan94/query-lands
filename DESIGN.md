# DESIGN.md — Learning Path Gamificado
## Especificación de diseño para una plataforma de aprendizaje inspirada en patrones de Duolingo

> **Objetivo:** construir una plataforma de aprendizaje de cualquier conocimiento usando una ruta guiada, microlecciones, práctica espaciada, feedback inmediato, progresión y gamificación.
>
> **Regla principal:** tomar los patrones funcionales de una app de aprendizaje moderna, pero NO copiar identidad visual, personajes, ilustraciones, textos, iconografía propietaria ni branding de Duolingo.

---

# 0. Principio rector

La aplicación debe sentirse como:

**"Abro la app → sé exactamente qué hacer → hago una actividad corta → recibo feedback → gano progreso → sé qué hacer después."**

No debe sentirse como:

- un LMS tradicional;
- una biblioteca de PDFs;
- una plataforma llena de menús;
- un curso donde el usuario tiene que decidir qué estudiar;
- un quiz infinito.

### Bucle principal

```text
ENTRAR
  ↓
VER SIGUIENTE PASO
  ↓
INICIAR MICROLECCIÓN
  ↓
RESPONDER / HACER
  ↓
FEEDBACK INMEDIATO
  ↓
RECOMPENSA
  ↓
PROGRESO
  ↓
SIGUIENTE ACTIVIDAD
  ↓
REVISIÓN ADAPTATIVA
```

---

# 1. Arquitectura de información

```text
APP
│
├── HOME / APRENDER
│   └── Ruta de aprendizaje
│       ├── Sección
│       │   ├── Unidad
│       │   │   ├── Lección
│       │   │   ├── Práctica
│       │   │   ├── Desafío
│       │   │   └── Evaluación
│       │   └── ...
│       └── ...
│
├── REPASAR
│   ├── Conceptos débiles
│   ├── Repaso programado
│   ├── Repaso rápido
│   └── Historial
│
├── DESAFÍOS
│   ├── Misiones diarias
│   ├── Misiones semanales
│   ├── Logros
│   └── Eventos
│
├── CLASIFICACIÓN
│   ├── Liga
│   ├── Ranking
│   └── Amigos / comunidad
│
├── PERFIL
│   ├── Nivel
│   ├── Estadísticas
│   ├── Racha
│   ├── Logros
│   └── Historial
│
└── TIENDA / RECURSOS
    ├── Moneda virtual
    ├── Personalización
    ├── Boosters
    └── Elementos premium
```

La navegación puede reducirse a 4–5 destinos principales. No intentar meter todas las funciones en la barra inferior.

---

# 2. Design tokens

## 2.1 Filosofía visual

La interfaz debe ser:

- amigable;
- clara;
- táctil;
- expresiva;
- altamente legible;
- orientada a una acción principal;
- visualmente viva sin convertirse en ruido.

### Diferenciador respecto a Duolingo

La plataforma debe tener una identidad propia.

Ejemplos de dirección visual:

- **Tecnología:** dark matte + azul/violeta;
- **Ciencia:** blanco + azul/verde;
- **Finanzas:** azul oscuro + lima;
- **Programación:** grafito + cian;
- **Historia:** crema + rojo oscuro;
- **Música:** oscuro + magenta.

El sistema de diseño debe permitir cambiar el tema sin cambiar la arquitectura.

---

# 3. Tipografía

Usar una familia sans-serif moderna.

Opciones:

```text
Inter
Plus Jakarta Sans
Manrope
Nunito Sans
DM Sans
```

Jerarquía:

```text
Display       32–40px / 700–800
H1            28–32px / 700
H2            22–26px / 700
H3            18–20px / 700
Body          15–17px / 400–500
Small         12–14px / 500
Caption       11–12px / 500
```

Evitar demasiados pesos tipográficos.

---

# 4. Espaciado

Sistema base de 4px:

```text
4   micro
8   pequeño
12  compacto
16  estándar
24  sección
32  grande
48  pantalla
64  hero
```

La interfaz debe respirar.

---

# 5. Bordes y superficies

```text
Radius XS      8px
Radius SM      12px
Radius MD      16px
Radius LG      20px
Radius XL      28px
Pill           999px
```

Usar cards cuando ayuden a agrupar contenido. No envolver absolutamente todo en cards.

La documentación reciente de Duolingo destaca precisamente la búsqueda de consistencia entre pestañas, jerarquía tipográfica y uso intencional del espacio en blanco, evitando contenedores innecesarios.

---

# 6. Componentes fundamentales

## 6.1 Top Bar

Contiene:

```text
[Avatar / curso]     [Racha] [Moneda] [Perfil]
```

Debe permanecer simple.

Estados:

- normal;
- sesión activa;
- nueva recompensa;
- racha en riesgo;
- notificación.

---

## 6.2 Bottom Navigation

Versión recomendada:

```text
┌──────────────────────────────────────────┐
│ Aprender │ Repasar │ Desafíos │ Perfil  │
└──────────────────────────────────────────┘
```

Opcional:

```text
Aprender
Repasar
Desafíos
Ranking
Perfil
```

Regla:

> La navegación debe mostrar las funciones que el usuario visita frecuentemente, no todas las funciones existentes.

---

# 7. PANTALLA 01 — Onboarding

## Objetivo

Descubrir:

- qué quiere aprender;
- nivel;
- objetivo;
- frecuencia;
- tiempo disponible;
- preferencias.

## Estructura

```text
┌──────────────────────────────┐
│             LOGO             │
│                              │
│ ¿Qué quieres aprender?       │
│                              │
│ [ Python ]                   │
│ [ Data ]                     │
│ [ IA ]                       │
│ [ Finanzas ]                 │
│ [ Otro ]                     │
│                              │
│        [ Continuar ]         │
└──────────────────────────────┘
```

## Pantallas posteriores

```text
Objetivo
↓
Nivel
↓
Tiempo diario
↓
Meta
↓
Nombre / avatar
↓
Primera lección
```

No pedir 20 datos antes de permitir aprender.

---

# 8. PANTALLA 02 — Selección de conocimiento

Permite cambiar entre cursos o dominios.

```text
MIS CURSOS

Python
████████░░ 78%

Data Analytics
████░░░░░░ 42%

Inteligencia Artificial
██░░░░░░░░ 18%

[ + Explorar conocimientos ]
```

Cada curso muestra:

- nombre;
- icono;
- progreso;
- nivel;
- última actividad.

---

# 9. PANTALLA 03 — HOME / LEARNING PATH

## Esta es la pantalla principal.

El usuario debe poder responder en menos de 2 segundos:

1. ¿Dónde estoy?
2. ¿Qué debo hacer?
3. ¿Cuánto me falta?

## Estructura

```text
┌──────────────────────────────────────┐
│ Curso             🔥 12    ★ 840     │
├──────────────────────────────────────┤
│                                      │
│ SECCIÓN 3                            │
│ Fundamentos                          │
│                                      │
│             ●                        │
│            ╱                         │
│          ●                           │
│         ╱                            │
│       ●                              │
│      ╱                               │
│    ◉  ← SIGUIENTE                   │
│      ╲                               │
│       🔒                             │
│                                      │
│ [ Volver a mi posición ]             │
└──────────────────────────────────────┘
```

## Ruta

La ruta es vertical y visual.

Cada nodo puede representar:

```text
LECCIÓN
REPASO
DESAFÍO
PROYECTO
EVALUACIÓN
HISTORIA / CASO
```

No todos los nodos tienen que verse iguales.

### Estados del nodo

```text
LOCKED
AVAILABLE
CURRENT
IN_PROGRESS
COMPLETED
MASTERED
REVIEW
CHALLENGE
```

---

# 10. Unidad / sección

Cada sección debe tener:

```text
SECCIÓN 03

"Automatización con Python"

Objetivo:
Crear pequeños scripts capaces de
leer, transformar y guardar datos.

Progreso
██████░░░░ 60%

[ Guía / conceptos ]
```

La sección debe explicar **qué aprenderás**, no solamente decir "Unidad 3".

---

# 11. Nodo de ruta

Al tocar un nodo:

```text
┌─────────────────────────────┐
│        🧠                   │
│                             │
│ FUNCIONES                   │
│                             │
│ Aprende a crear funciones   │
│ reutilizables.              │
│                             │
│ 5 actividades               │
│ ~7 minutos                  │
│                             │
│      [ COMENZAR ]           │
└─────────────────────────────┘
```

No iniciar inmediatamente si el nodo necesita contexto.

---

# 12. PANTALLA 04 — Lesson Intro

Antes de comenzar:

```text
FUNCIONES

Hoy aprenderás:

✓ Crear funciones
✓ Usar parámetros
✓ Retornar valores

5 actividades
~6 minutos

Recompensa:
+40 XP

[ COMENZAR ]
```

Objetivo: reducir incertidumbre.

---

# 13. PANTALLA 05 — Lesson Player

## Regla principal

Una pantalla = una acción cognitiva.

```text
┌────────────────────────────────────┐
│ ←    ███████░░░  70%      ✕        │
│                                    │
│ ¿Qué imprime este código?          │
│                                    │
│ def suma(a, b):                    │
│     return a + b                   │
│                                    │
│ print(suma(2, 3))                  │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 3                              │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ 5                              │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ 6                              │ │
│ └────────────────────────────────┘ │
│                                    │
│              [ COMPROBAR ]         │
└────────────────────────────────────┘
```

---

# 14. Tipos de actividades

El motor debe soportar múltiples tipos.

```text
multiple_choice
single_choice
multi_choice
true_false
fill_blank
ordering
matching
flashcard
typing
code_editor
drag_drop
image_selection
audio
speaking
scenario
simulation
free_text
short_answer
```

## Importante

No convertir todo en opción múltiple.

El tipo de actividad debe depender del objetivo cognitivo.

---

# 15. Feedback inmediato

## Correcto

```text
✓ Correcto

+10 XP

[ CONTINUAR ]
```

Puede incluir:

```text
explicación breve
```

## Incorrecto

```text
✕ Todavía no

La respuesta correcta era:

5

¿Por qué?
La función suma 2 + 3.

[ ENTENDÍ ]
```

Nunca dejar al usuario simplemente con:

> "Incorrecto."

---

# 16. Error como mecanismo de aprendizaje

Para conocimiento técnico:

```text
Respuesta incorrecta
        ↓
Identificar concepto
        ↓
Explicar error
        ↓
Mini ejercicio
        ↓
Intentar nuevamente
```

Ejemplo:

```text
⚠️ Confundiste:

lista ≠ diccionario

Repasemos:

Una lista utiliza posiciones.
Un diccionario utiliza claves.

[ Practicar ]
```

---

# 17. PANTALLA 06 — Lesson Complete

Esta pantalla debe sentirse como una recompensa.

```text
          ✨

       ¡COMPLETADO!

       +40 XP
       +15 monedas

       Precisión
       ████████░░ 80%

       ⚡ Racha: 12 días

[ CONTINUAR ]
```

Animación:

```text
0–150ms     transición
150–500ms   recompensa aparece
500–900ms   progreso aumenta
900–1200ms  celebración
```

No usar animaciones excesivamente largas.

---

# 18. PANTALLA 07 — Daily Goal

El usuario debe tener una meta sencilla.

```text
META DIARIA

██████░░░░

12 / 20 XP

Te faltan 8 XP.

[ CONTINUAR APRENDIENDO ]
```

La meta puede configurarse:

```text
5 min
10 min
15 min
20 min
30 min
```

---

# 19. PANTALLA 08 — Streak

La racha representa continuidad.

```text
🔥 12

DÍAS DE RACHA

L  M  M  J  V  S  D
✓  ✓  ✓  ✓  ✓  ✓  ○

Próximo objetivo:
14 días

[ APRENDER AHORA ]
```

No hacer que la racha sea el único motivo para volver.

---

# 20. PANTALLA 09 — Review / Repasar

Debe existir una zona explícita para recuperación de conocimiento.

```text
REPASAR

Necesita atención

┌──────────────────────────────┐
│ Variables                    │
│ Dominio 62%                  │
│ ██████░░░░                   │
│ [ Repasar ]                  │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Funciones                    │
│ Dominio 74%                  │
│ ███████░░░                   │
│ [ Repasar ]                  │
└──────────────────────────────┘
```

---

# 21. Motor de repetición

Cada concepto debe almacenar:

```ts
ConceptMastery {
  conceptId
  userId

  masteryScore
  attempts
  correctAttempts
  incorrectAttempts

  lastSeenAt
  nextReviewAt

  difficulty
  confidence
}
```

Ejemplo:

```text
Concepto: funciones

Dominio: 71%
Último intento: hoy
Próximo repaso: 2 días
Errores: 3
```

El sistema puede utilizar repetición espaciada para decidir cuándo volver a mostrar conceptos.

---

# 22. PANTALLA 10 — Desafíos / Quests

```text
DESAFÍOS

HOY

□ Completa 2 lecciones
  0 / 2

□ Gana 50 XP
  32 / 50

□ Repasa 1 concepto
  ✓

        2 / 3
```

Cada misión debe:

- tener una acción concreta;
- tener progreso;
- tener recompensa;
- poder completarse en una sesión razonable.

---

# 23. PANTALLA 11 — Ranking / League

Opcional según producto.

```text
LIGA

1. Alex        920 XP
2. María       870 XP
3. Juan        810 XP
...
8. Tú          540 XP
9. Luis        490 XP
```

No mostrar únicamente competencia.

Agregar:

```text
Tu progreso esta semana
```

y permitir desactivar elementos sociales.

---

# 24. PANTALLA 12 — Perfil

```text
┌──────────────────────────────┐
│           AVATAR             │
│         Santiago             │
│                              │
│ NIVEL 12                     │
│ ███████░░░                   │
│                              │
│ 🔥 18 días                   │
│ ⭐ 4.280 XP                  │
│ 🏆 12 logros                 │
│                              │
│ TIEMPO APRENDIENDO           │
│ 24h 18m                      │
│                              │
│ PRECISIÓN                    │
│ 84%                          │
└──────────────────────────────┘
```

---

# 25. PANTALLA 13 — Achievements

```text
LOGROS

🏆 Primer paso
Completa tu primera lección ✓

🔥 Constante
7 días seguidos ✓

🧠 Maestro
Domina 10 conceptos

⚡ Velocidad
Completa una lección en <5 min
```

Los logros deben reforzar conductas de aprendizaje, no solamente uso superficial.

---

# 26. PANTALLA 14 — Shop / Economy

Opcional.

Moneda:

```text
★ 1.240
```

Puede comprar:

```text
Personalización
Temas
Avatares
Efectos
Boosters
Protección de racha
```

No hacer que el usuario tenga que pagar para aprender el contenido básico.

---

# 27. PANTALLA 15 — Guidebook / Knowledge Reference

Cada sección puede tener una guía.

```text
GUÍA

Funciones

01 ¿Qué es una función?
02 Parámetros
03 Return
04 Scope
05 Ejemplos
```

Esto sirve como referencia sin convertir la ruta principal en documentación pesada.

---

# 28. PANTALLA 16 — Search / Explore

Permite encontrar:

```text
Buscar conocimiento...

"listas"

Resultados:

Python
 └── Listas
 └── Métodos de listas
 └── List comprehensions

Data
 └── Listas de datos
```

La búsqueda no debe reemplazar la ruta guiada.

---

# 29. PANTALLA 17 — Notifications

Tipos:

```text
🔥 Tu racha está activa
🧠 Tienes 3 conceptos para repasar
🎯 Nueva misión
🏆 Nuevo logro
📚 Nueva sección disponible
```

Evitar spam.

---

# 30. PANTALLA 18 — Settings

```text
CUENTA
Preferencias
Notificaciones
Privacidad
Idioma

APRENDIZAJE
Meta diaria
Recordatorios
Dificultad
Repetición

ACCESIBILIDAD
Tamaño de texto
Contraste
Animaciones
Sonido

DATOS
Exportar progreso
Eliminar cuenta
```

---

# 31. Estados globales

Todos los componentes deben contemplar:

```text
default
hover
pressed
focused
disabled
loading
success
error
locked
completed
selected
empty
offline
```

---

# 32. Loading

Nunca mostrar una pantalla blanca vacía.

Usar skeleton:

```text
┌─────────────────────┐
│ ███████             │
│                     │
│ █████████████       │
│ ██████████          │
└─────────────────────┘
```

---

# 33. Empty states

Ejemplo:

```text
Aún no tienes conceptos
para repasar.

Completa algunas lecciones
y aparecerán aquí.

[ EMPEZAR ]
```

---

# 34. Error states

```text
No pudimos cargar tu progreso.

[ Reintentar ]
```

Nunca mostrar errores técnicos al usuario final.

---

# 35. Responsive design

## Mobile

Principal dispositivo.

```text
width < 768px
```

Prioridades:

1. contenido;
2. acción;
3. progreso;
4. navegación.

## Tablet

```text
768–1024px
```

Permitir mayor ancho de contenido.

## Desktop

```text
>1024px
```

Layout:

```text
┌────────────┬─────────────────────────────┐
│ SIDEBAR    │ CONTENIDO                   │
│            │                             │
│ Aprender   │ Ruta                        │
│ Repasar    │                             │
│ Desafíos   │                             │
│ Ranking    │                             │
│ Perfil     │                             │
└────────────┴─────────────────────────────┘
```

La experiencia desktop no debe ser simplemente un móvil gigante.

---

# 36. Accesibilidad

Obligatorio:

- navegación por teclado;
- focus visible;
- labels para iconos;
- contraste adecuado;
- tamaño táctil mínimo ~44px;
- no depender únicamente del color;
- opción de reducir animaciones;
- feedback textual además de visual;
- soporte para lectores de pantalla.

---

# 37. Motion Design

La animación debe comunicar:

```text
CAUSA → RESPUESTA → RECOMPENSA
```

Ejemplos:

### Completar

```text
check
↓
scale
↓
confetti
↓
XP
```

### Desbloquear

```text
locked
↓
pulse
↓
unlock
↓
available
```

### Progreso

```text
████░░
   ↓
██████
```

### Regla

Animaciones rápidas:

```text
150–400ms
```

Celebraciones:

```text
500–1200ms
```

Nunca bloquear la interacción innecesariamente.

---

# 38. Sonido

Opcional y desactivable.

Eventos:

```text
correct
incorrect
complete
level_up
achievement
streak
unlock
```

No reproducir sonidos inesperados durante navegación normal.

---

# 39. Gamification Engine

Separar la gamificación del contenido.

```text
Learning Engine
       │
       ├── Lesson completed
       │
       ▼
Gamification Engine
       │
       ├── +XP
       ├── streak update
       ├── quest progress
       ├── achievement check
       └── level check
```

Esto permite cambiar la gamificación sin reescribir el sistema educativo.

---

# 40. Learning Engine

```text
Course
 ↓
Section
 ↓
Unit
 ↓
Concept
 ↓
Activity
 ↓
Attempt
 ↓
Mastery
 ↓
Review schedule
```

Modelo conceptual:

```ts
Course
Section
Unit
Concept
Lesson
Activity
Question
Attempt
Mastery
ReviewSchedule
```

---

# 41. Contenido declarativo

El contenido debe poder almacenarse como JSON/DB.

Ejemplo:

```json
{
  "lessonId": "python-functions-01",
  "title": "Introducción a funciones",
  "estimatedMinutes": 6,
  "concepts": [
    "function",
    "parameter",
    "return"
  ],
  "activities": [
    {
      "type": "multiple_choice",
      "question": "¿Qué devuelve una función?",
      "options": [
        "Un valor",
        "Siempre texto",
        "Nada"
      ],
      "correct": 0
    }
  ],
  "reward": {
    "xp": 40
  }
}
```

Esto permite cambiar el conocimiento sin cambiar el frontend.

---

# 42. AI Engine — opcional

La IA NO debe controlar arbitrariamente todo el currículo.

Usarla para:

```text
Generar ejercicios
Explicar errores
Adaptar dificultad
Crear ejemplos
Responder preguntas
Detectar conceptos débiles
Generar variaciones
```

Arquitectura:

```text
CURRICULUM CONTROLADO
        ↓
CONCEPTOS
        ↓
ACTIVIDADES
        ↓
IA
 ┌──────┼────────┐
 ↓      ↓        ↓
crear  explicar  adaptar
```

La IA debe estar limitada por el currículo.

---

# 43. AI Tutor

Dentro de una actividad:

```text
¿Necesitas ayuda?

[ 💡 Pista ]
[ 🧠 Explicar ]
[ 🤖 Preguntar ]
```

No revelar inmediatamente la respuesta.

Niveles:

```text
Hint 1 → pequeña pista
Hint 2 → concepto relacionado
Hint 3 → procedimiento
Solution → respuesta explicada
```

---

# 44. Personalización

El sistema debe observar:

```text
accuracy
speed
attempts
difficulty
mastery
recent mistakes
review history
session length
```

Y calcular:

```text
NEXT_ACTIVITY
```

Ejemplo:

```text
Usuario:
Funciones       85%
Bucles          91%
Listas          57%
Diccionarios    78%

Siguiente:
→ Repasar listas
→ Nueva lección de diccionarios
```

---

# 45. Ruta adaptativa

La ruta visual puede ser fija mientras las actividades internas son adaptativas.

Esto evita una experiencia caótica.

```text
RUTA
A → B → C → D → E

           ↓
      Adaptive Engine

Usuario A:
actividad fácil

Usuario B:
actividad avanzada

Usuario C:
repaso adicional
```

---

# 46. Diseño de una sesión

Una sesión ideal:

```text
OPEN
 ↓
Daily Goal
 ↓
Current Node
 ↓
Lesson
 ↓
Activity 1
 ↓
Activity 2
 ↓
Activity 3
 ↓
Review
 ↓
Result
 ↓
Reward
 ↓
Next Node
```

Duración objetivo configurable:

```text
5–10 min
```

También debe existir:

```text
Quick Practice
2–3 min
```

---

# 47. Regla de una acción principal

Cada pantalla debe tener una acción primaria.

Correcto:

```text
[ CONTINUAR ]
```

Incorrecto:

```text
[ Continuar ]
[ Saltar ]
[ Repasar ]
[ Ver teoría ]
[ Compartir ]
[ Tienda ]
[ Ranking ]
[ Configurar ]
```

Reducir decisiones.

---

# 48. Jerarquía visual

Cada pantalla debe responder:

```text
1. ¿Qué estoy viendo?
2. ¿Qué debo hacer?
3. ¿Qué resultado obtuve?
4. ¿Qué puedo hacer después?
```

Orden:

```text
CONTEXTO
↓
CONTENIDO
↓
ACCIÓN
↓
FEEDBACK
↓
PROGRESO
```

---

# 49. No copiar la identidad de Duolingo

No utilizar:

- Duo;
- el búho;
- nombres de personajes;
- ilustraciones copiadas;
- textos copiados;
- sonidos copiados;
- branding;
- colores como sustituto de identidad;
- assets de Duolingo.

Sí utilizar como referencia conceptual:

- ruta guiada;
- microlecciones;
- progreso visible;
- repetición;
- feedback;
- recompensas;
- misiones;
- navegación simple;
- actividades variadas.

---

# 50. Arquitectura visual final

```text
                    APP
                     │
        ┌────────────┴────────────┐
        │                         │
   LEARNING UI               MOTIVATION UI
        │                         │
        ├── Home                  ├── XP
        ├── Path                  ├── Streak
        ├── Lesson                ├── Quests
        ├── Review                ├── Achievements
        └── Guide                 └── Ranking
        │
        └────────────┬────────────┘
                     │
              LEARNING ENGINE
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      Curriculum  Assessment  Mastery
          │          │          │
          └──────────┼──────────┘
                     ↓
              ADAPTIVE ENGINE
                     │
                     ↓
              NEXT ACTIVITY
```

---

# 51. Component tree recomendado

```text
App
├── AppShell
│   ├── TopBar
│   ├── BottomNav / Sidebar
│   └── PageContainer
│
├── HomePage
│   ├── CourseHeader
│   ├── DailyGoal
│   ├── LearningPath
│   │   ├── SectionHeader
│   │   ├── PathConnector
│   │   └── PathNode
│   └── ContinueButton
│
├── LessonPage
│   ├── LessonHeader
│   ├── ProgressBar
│   ├── ActivityRenderer
│   ├── FeedbackPanel
│   └── ContinueButton
│
├── LessonResult
│   ├── RewardAnimation
│   ├── XPProgress
│   ├── Accuracy
│   └── NextAction
│
├── ReviewPage
│   ├── WeakConcepts
│   ├── DueReviews
│   └── QuickPractice
│
├── ChallengesPage
│   ├── DailyQuests
│   ├── WeeklyQuests
│   └── Achievements
│
├── LeaderboardPage
│
├── ProfilePage
│   ├── ProfileHeader
│   ├── Stats
│   ├── Streak
│   └── Achievements
│
└── SettingsPage
```

---

# 52. MVP

No intentar construir todo inicialmente.

## V1

Construir solamente:

```text
1. Onboarding
2. Home
3. Learning Path
4. Unit
5. Lesson
6. 4 tipos de ejercicios
7. Feedback
8. Lesson Complete
9. XP
10. Progress
11. Review
12. Profile
```

## V2

```text
13. Streak
14. Daily Goal
15. Quests
16. Achievements
17. Notifications
18. Guidebook
```

## V3

```text
19. Adaptive Engine
20. Spaced Repetition
21. AI Tutor
22. AI-generated exercises
23. Analytics
```

## V4

```text
24. Ranking
25. Friends
26. Events
27. Shop
28. Personalization
29. Multiple courses
```

---

# 53. Criterios de calidad

Antes de considerar una pantalla terminada:

### UX

- [ ] El usuario sabe dónde está.
- [ ] Existe una acción principal clara.
- [ ] No hay decisiones innecesarias.
- [ ] El progreso es visible.
- [ ] El feedback es inmediato.
- [ ] El siguiente paso es obvio.

### Visual

- [ ] Jerarquía tipográfica clara.
- [ ] Espaciado consistente.
- [ ] Estados de interacción completos.
- [ ] No hay exceso de cards.
- [ ] No depende del color para comunicar estados.
- [ ] Animaciones breves y útiles.

### Learning

- [ ] Cada actividad tiene un objetivo.
- [ ] Los errores enseñan.
- [ ] Existe recuperación / repaso.
- [ ] El usuario recibe evidencia de progreso.
- [ ] La dificultad puede adaptarse.

### Engineering

- [ ] Contenido separado de UI.
- [ ] Actividades configurables.
- [ ] Gamificación desacoplada.
- [ ] Progreso persistente.
- [ ] Estados loading/error/empty.
- [ ] Responsive.

---

# 54. Regla final del producto

La experiencia completa debe poder resumirse así:

```text
           QUIERO APRENDER X
                    ↓
              [ EMPEZAR ]
                    ↓
              RUTA GUIADA
                    ↓
             MICRO ACTIVIDAD
                    ↓
             HACER / RESPONDER
                    ↓
              FEEDBACK
                    ↓
             + PROGRESO
                    ↓
             + RECOMPENSA
                    ↓
          ¿QUÉ NECESITO REPASAR?
                    ↓
             ADAPTACIÓN
                    ↓
           SIGUIENTE ACTIVIDAD
```

El producto no es un "curso con gamificación".

Es:

> **un motor de aprendizaje que convierte conocimiento estructurado en una secuencia interactiva, medible y progresiva.**

---

# 55. Referencia funcional

La estructura de esta especificación toma como referencia patrones documentados públicamente por Duolingo:

- La pantalla principal como **ruta guiada**.
- Contenido nuevo y repasos intercalados.
- Práctica integrada dentro de la ruta.
- Secciones y unidades cortas.
- Guías asociadas a las unidades.
- Misiones y objetivos.
- Perfil y progreso.
- Rachas.
- Actividades variadas.
- Repetición espaciada.
- Consistencia entre pestañas y jerarquía visual.

Estas son referencias de producto/UX, no una instrucción para copiar su identidad.

Fuentes oficiales consultadas:

- Duolingo — The Science Behind Duolingo's Home Screen Redesign.
- Duolingo — Core Tabs Redesign.
- Duolingo — The Streak Uses Habit Research.
- Duolingo — Product Highlights.
- Duolingo — New Subjects: Math, Music and Language.

---

# 56. Implementación recomendada

Frontend:

```text
React
TypeScript
Vite / Next.js
Tailwind CSS
Framer Motion
```

Backend:

```text
FastAPI
PostgreSQL
Redis opcional
```

AI:

```text
LLM API
RAG opcional
Embeddings
```

Analytics:

```text
Pandas
PostgreSQL
Metabase / Streamlit opcional
```

Deploy:

```text
Frontend → Vercel / Netlify
Backend → Render / Railway
DB → PostgreSQL managed
```

---

# 57. Nombre conceptual del sistema

No llamar internamente al proyecto:

```text
"Duolingo clone"
```

Usar:

```text
Learning Engine
Adaptive Learning Platform
Gamified Learning System
Knowledge Learning Platform
Interactive Learning Path
```

Porque la arquitectura puede servir para:

```text
Python
Java
Data Analytics
IA
Matemáticas
Ciencia
Finanzas
Inglés
Música
Medio ambiente
Preparación para exámenes
Capacitación empresarial
```

La misma interfaz puede consumir distintos currículos.

---

## END OF DESIGN.md
