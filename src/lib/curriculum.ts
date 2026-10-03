export type Challenge = {
  id: string;
  order: number;
  dificultad: "facil" | "media" | "dificil";
  titulo: string;
  empresa_patron: string;
  enunciado: string;
  schema_sql: string;
  seed_sql: string;
  solucion_sql: string;
  pista: string;
  default_query: string;
  xp?: number;
  hidden_seed_sql?: string;
  hidden_hint?: string;
};

export const XP_POR_DIFICULTAD = { facil: 10, media: 20, dificil: 30 } as const;

export const challenges: Challenge[] = [
  {
    id: "01-select-where",
    order: 1,
    dificultad: "facil",
    titulo: "Empleados por departamento",
    empresa_patron: "HackerRank / TestGorilla",
    enunciado: "Tabla employees(id, nombre, departamento, salario). Retorna nombre y salario de Ingeniería con salario > 50000, ordenados por salario DESC.",
    schema_sql: "CREATE TABLE employees(id INTEGER PRIMARY KEY, nombre TEXT, departamento TEXT, salario INTEGER);",
    seed_sql: `INSERT INTO employees VALUES (1,'Ana','Ingeniería',72000),(2,'Luis','Ventas',45000),(3,'Marta','Ingeniería',52000),(4,'Pedro','Ingeniería',48000),(5,'Sofia','Ventas',61000);`,
    solucion_sql: "SELECT nombre, salario FROM employees WHERE departamento='Ingeniería' AND salario > 50000 ORDER BY salario DESC;",
    pista: "Usa WHERE con AND y ORDER BY ... DESC.",
    default_query: "SELECT nombre, salario FROM employees\nWHERE departamento = 'Ingeniería';",
  },
  {
    id: "02-order-limit",
    order: 2,
    dificultad: "facil",
    titulo: "Top salarios",
    empresa_patron: "LeetCode 176",
    enunciado: "Retorna los 3 salarios más altos (nombre, salario) de employees.",
    schema_sql: "CREATE TABLE employees(id INTEGER PRIMARY KEY, nombre TEXT, salario INTEGER);",
    seed_sql: `INSERT INTO employees VALUES (1,'Ana',72000),(2,'Luis',45000),(3,'Marta',88000),(4,'Pedro',61000),(5,'Sofia',95000);`,
    solucion_sql: "SELECT nombre, salario FROM employees ORDER BY salario DESC LIMIT 3;",
    pista: "ORDER BY salario DESC + LIMIT 3.",
    default_query: "SELECT nombre, salario FROM employees;",
  },
  {
    id: "03-like-distinct",
    order: 3,
    dificultad: "facil",
    titulo: "Búsqueda de productos",
    empresa_patron: "StrataScratch 10026",
    enunciado: "Tabla products(id, nombre, categoria). Retorna DISTINCT categoria de productos cuyo nombre contiene 'Pro' (case-insensitive con LIKE).",
    schema_sql: "CREATE TABLE products(id INTEGER PRIMARY KEY, nombre TEXT, categoria TEXT);",
    seed_sql: `INSERT INTO products VALUES (1,'iPhone Pro','movil'),(2,'Galaxy','movil'),(3,'MacBook Pro','laptop'),(4,'Teclado','accesorio'),(5,'Monitor Pro','accesorio');`,
    solucion_sql: "SELECT DISTINCT categoria FROM products WHERE nombre LIKE '%Pro%';",
    pista: "LIKE '%Pro%' + DISTINCT.",
    default_query: "SELECT categoria FROM products;",
  },
  {
    id: "04-join-pedidos",
    order: 4,
    dificultad: "facil",
    titulo: "Pedidos + clientes",
    empresa_patron: "DataLemur / HackerRank",
    enunciado: "clientes(id, nombre) y pedidos(id, cliente_id, total). Retorna nombre del cliente y total de pedidos con total > 100.",
    schema_sql: "CREATE TABLE clientes(id INTEGER PRIMARY KEY, nombre TEXT); CREATE TABLE pedidos(id INTEGER PRIMARY KEY, cliente_id INTEGER, total INTEGER);",
    seed_sql: `INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta'); INSERT INTO pedidos VALUES (1,1,250),(2,1,80),(3,2,300),(4,3,50);`,
    solucion_sql: "SELECT c.nombre, p.total FROM clientes c JOIN pedidos p ON p.cliente_id=c.id WHERE p.total > 100;",
    pista: "JOIN ... ON + WHERE.",
    default_query: "SELECT * FROM clientes;\nSELECT * FROM pedidos;",
  },
  {
    id: "05-page-sin-likes",
    order: 5,
    dificultad: "media",
    titulo: "Páginas sin likes",
    empresa_patron: "Facebook / DataLemur",
    enunciado: "pages(page_id) y page_likes(page_id, user_id). Retorna page_id de páginas que no tienen ningún like.",
    schema_sql: "CREATE TABLE pages(page_id INTEGER PRIMARY KEY); CREATE TABLE page_likes(page_id INTEGER, user_id INTEGER);",
    seed_sql: `INSERT INTO pages VALUES (1),(2),(3),(4); INSERT INTO page_likes VALUES (1,101),(2,102),(2,103);`,
    pista: "LEFT JOIN ... WHERE ... IS NULL.",
    solucion_sql: "SELECT p.page_id FROM pages p LEFT JOIN page_likes l ON l.page_id=p.page_id WHERE l.user_id IS NULL;",
    hidden_seed_sql: `INSERT INTO pages VALUES (5),(6); INSERT INTO page_likes VALUES (5,201),(5,202),(6,203);`,
    hidden_hint: "Tu query pasa el ejemplo pero falla con páginas con múltiples likes. Revisa el JOIN.",
    default_query: "SELECT * FROM pages;\nSELECT * FROM page_likes;",
  },
  {
    id: "06-group-having",
    order: 6,
    dificultad: "media",
    titulo: "Ventas por categoría",
    empresa_patron: "Amazon Highest-Grossing",
    enunciado: "ventas(id, categoria, monto). Retorna categoria y SUM(monto) solo para categorías con suma > 1000, ordenadas DESC.",
    schema_sql: "CREATE TABLE ventas(id INTEGER PRIMARY KEY, categoria TEXT, monto INTEGER);",
    seed_sql: `INSERT INTO ventas VALUES (1,'libros',400),(2,'libros',800),(3,'juegos',2000),(4,'juegos',500),(5,'musica',300);`,
    solucion_sql: "SELECT categoria, SUM(monto) AS total FROM ventas GROUP BY categoria HAVING SUM(monto) > 1000 ORDER BY total DESC;",
    pista: "GROUP BY + HAVING + alias.",
    default_query: "SELECT categoria, SUM(monto) FROM ventas GROUP BY categoria;",
  },
  {
    id: "07-segundo-salario",
    order: 7,
    dificultad: "media",
    titulo: "Segundo salario más alto",
    empresa_patron: "FAANG / LeetCode 176",
    enunciado: "Tabla employees(id, salario). Retorna el segundo salario más alto como second_highest. Si no existe, retorna NULL.",
    schema_sql: "CREATE TABLE employees(id INTEGER PRIMARY KEY, salario INTEGER);",
    seed_sql: `INSERT INTO employees VALUES (1,72000),(2,88000),(3,95000);`,
    solucion_sql: "SELECT MAX(salario) AS second_highest FROM employees WHERE salario < (SELECT MAX(salario) FROM employees);",
    pista: "Subquery con MAX anidado.",
    hidden_seed_sql: `DELETE FROM employees; INSERT INTO employees VALUES (1,50000),(2,50000),(3,40000);`,
    hidden_hint: "Falla con salarios empatados. Tu query debe manejar duplicados del máximo.",
    default_query: "SELECT MAX(salario) FROM employees;",
  },
  {
    id: "08-case-when",
    order: 8,
    dificultad: "media",
    titulo: "Clasificación de negocios",
    empresa_patron: "StrataScratch 9726",
    enunciado: "negocios(id, nombre, rating). Clasifica: rating>=4.5 'premium', >=3.5 'regular', else 'bajo'. Retorna nombre y nivel.",
    schema_sql: "CREATE TABLE negocios(id INTEGER PRIMARY KEY, nombre TEXT, rating REAL);",
    seed_sql: `INSERT INTO negocios VALUES (1,'Café A',4.8),(2,'Bar B',3.9),(3,'Tienda C',2.5);`,
    solucion_sql: "SELECT nombre, CASE WHEN rating >= 4.5 THEN 'premium' WHEN rating >= 3.5 THEN 'regular' ELSE 'bajo' END AS nivel FROM negocios;",
    pista: "CASE WHEN ... THEN ... END.",
    default_query: "SELECT nombre, rating FROM negocios;",
  },
  {
    id: "09-histograma-mes",
    order: 9,
    dificultad: "media",
    titulo: "Viewership por mes",
    empresa_patron: "NY Times / DataLemur",
    enunciado: "vistas(id, fecha TEXT 'YYYY-MM-DD', dispositivo TEXT). Retorna mes (YYYY-MM) y conteo, solo 2024, ordenado por mes.",
    schema_sql: "CREATE TABLE vistas(id INTEGER PRIMARY KEY, fecha TEXT, dispositivo TEXT);",
    seed_sql: `INSERT INTO vistas VALUES (1,'2024-01-05','movil'),(2,'2024-01-20','laptop'),(3,'2024-02-02','movil'),(4,'2023-12-31','movil');`,
    solucion_sql: "SELECT substr(fecha,1,7) AS mes, COUNT(*) AS total FROM vistas WHERE fecha LIKE '2024%' GROUP BY mes ORDER BY mes;",
    pista: "substr(fecha,1,7) + LIKE '2024%' + GROUP BY.",
    default_query: "SELECT * FROM vistas;",
  },
  {
    id: "10-cte-retencion",
    order: 10,
    dificultad: "dificil",
    titulo: "Usuarios activos",
    empresa_patron: "Facebook Active Retention",
    enunciado: "eventos(user_id, fecha TEXT). Usuario activo = 2+ eventos en días distintos. Retorna conteo de activos usando CTE.",
    schema_sql: "CREATE TABLE eventos(user_id INTEGER, fecha TEXT);",
    seed_sql: `INSERT INTO eventos VALUES (1,'2024-01-01'),(1,'2024-01-02'),(2,'2024-01-01'),(3,'2024-01-01'),(3,'2024-01-01');`,
    solucion_sql: "WITH dias AS (SELECT user_id, COUNT(DISTINCT fecha) AS d FROM eventos GROUP BY user_id) SELECT COUNT(*) AS activos FROM dias WHERE d >= 2;",
    pista: "CTE + COUNT(DISTINCT fecha).",
    hidden_seed_sql: `INSERT INTO eventos VALUES (4,'2024-01-01'),(4,'2024-01-01'),(4,'2024-01-01'),(5,'2024-01-01'),(5,'2024-01-02'),(5,'2024-01-03');`,
    hidden_hint: "Falla con usuarios con muchos eventos el mismo día. Usa COUNT(DISTINCT fecha).",
    default_query: "SELECT user_id, COUNT(*) FROM eventos GROUP BY user_id;",
  },
  {
    id: "11-top3-depto",
    order: 11,
    dificultad: "dificil",
    titulo: "Top 3 por departamento",
    empresa_patron: "LeetCode 185",
    enunciado: "employees(id, nombre, salario, dept_id), departments(id, nombre). Retorna top 3 salarios por departamento con RANK (nombre_depto, nombre_emp, salario).",
    schema_sql: "CREATE TABLE departments(id INTEGER PRIMARY KEY, nombre TEXT); CREATE TABLE employees(id INTEGER PRIMARY KEY, nombre TEXT, salario INTEGER, dept_id INTEGER);",
    seed_sql: `INSERT INTO departments VALUES (1,'IT'),(2,'Ventas'); INSERT INTO employees VALUES (1,'Ana',90000,1),(2,'Luis',85000,1),(3,'Marta',95000,1),(4,'Pedro',80000,1),(5,'Sofia',70000,2),(6,'Juan',75000,2);`,
    solucion_sql: "SELECT d.nombre AS depto, e.nombre, e.salario FROM (SELECT *, RANK() OVER (PARTITION BY dept_id ORDER BY salario DESC) AS r FROM employees) e JOIN departments d ON d.id=e.dept_id WHERE r <= 3 ORDER BY depto, salario DESC;",
    pista: "RANK() OVER (PARTITION BY ... ORDER BY ...).",
    hidden_seed_sql: `INSERT INTO employees VALUES (7,'Rosa',95000,1),(8,'Tito',60000,2);`,
    hidden_hint: "Falla con empates de salario. Debe usar RANK (con huecos), no ROW_NUMBER.",
    default_query: "SELECT * FROM employees;",
  },
  {
    id: "12-rolling-avg",
    order: 12,
    dificultad: "dificil",
    titulo: "Rolling average tweets",
    empresa_patron: "Twitter / DataLemur",
    enunciado: "tweets(id, user_id, fecha TEXT, cantidad INTEGER). Retorna fecha y promedio móvil de 3 días (AVG con ROWS 2 PRECEDING).",
    schema_sql: "CREATE TABLE tweets(id INTEGER PRIMARY KEY, user_id INTEGER, fecha TEXT, cantidad INTEGER);",
    seed_sql: `INSERT INTO tweets VALUES (1,1,'2024-01-01',10),(2,1,'2024-01-02',20),(3,1,'2024-01-03',30),(4,1,'2024-01-04',40);`,
    solucion_sql: "SELECT fecha, AVG(cantidad) OVER (ORDER BY fecha ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling FROM tweets ORDER BY fecha;",
    pista: "AVG(...) OVER (ORDER BY fecha ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).",
    default_query: "SELECT fecha, cantidad FROM tweets ORDER BY fecha;",
  },
  {
    id: "13-mediana-busquedas",
    order: 13,
    dificultad: "dificil",
    titulo: "Mediana de búsquedas",
    empresa_patron: "Google / DataLemur",
    enunciado: "busquedas(searches INTEGER, num_users INTEGER) resume cuántos usuarios hicieron N búsquedas. Retorna la mediana ponderada como mediana (1 decimal).",
    schema_sql: "CREATE TABLE busquedas(searches INTEGER, num_users INTEGER);",
    seed_sql: `INSERT INTO busquedas VALUES (1,2),(2,2),(3,3),(4,1);`,
    solucion_sql: "WITH expandido AS (SELECT searches FROM busquedas, (WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt LIMIT 1000) SELECT x FROM cnt) WHERE x <= num_users) SELECT ROUND(AVG(searches),1) AS mediana FROM (SELECT searches, ROW_NUMBER() OVER (ORDER BY searches) AS r, COUNT(*) OVER () AS n FROM expandido) WHERE r IN ((n+1)/2, (n+2)/2);",
    pista: "Mediana ponderada: expande por num_users o usa ventana acumulada.",
    hidden_seed_sql: `DELETE FROM busquedas; INSERT INTO busquedas VALUES (5,1),(6,1),(7,1),(8,1);`,
    hidden_hint: "Con conteo par tu mediana falla. Promedia los dos valores centrales.",
    default_query: "SELECT * FROM busquedas;",
  },
  {
    id: "14-crecimiento-yoy",
    order: 14,
    dificultad: "dificil",
    titulo: "Crecimiento año a año",
    empresa_patron: "Wayfair / DataLemur",
    enunciado: "ventas_yoy(id, fecha TEXT, monto INTEGER). Retorna año, total anual y crecimiento % vs año anterior (LAG), ordenado por año.",
    schema_sql: "CREATE TABLE ventas_yoy(id INTEGER PRIMARY KEY, fecha TEXT, monto INTEGER);",
    seed_sql: `INSERT INTO ventas_yoy VALUES (1,'2022-03-01',100),(2,'2022-06-01',200),(3,'2023-02-01',400),(4,'2023-09-01',200),(5,'2024-01-01',900);`,
    solucion_sql: "WITH anual AS (SELECT substr(fecha,1,4) AS anio, SUM(monto) AS total FROM ventas_yoy GROUP BY anio) SELECT anio, total, ROUND(100.0*(total - LAG(total) OVER (ORDER BY anio))/LAG(total) OVER (ORDER BY anio),1) AS yoy FROM anual ORDER BY anio;",
    pista: "Agrega por año con substr, luego LAG(total) OVER (ORDER BY anio).",
    hidden_seed_sql: `INSERT INTO ventas_yoy VALUES (6,'2024-06-01',100);`,
    hidden_hint: "Tu % falla cuando el año previo es chico o el actual cambia. Divide por el LAG, no por el total actual.",
    default_query: "SELECT substr(fecha,1,4) AS anio, SUM(monto) FROM ventas_yoy GROUP BY anio;",
  },
  {
    id: "15-jefes-salario",
    order: 15,
    dificultad: "media",
    titulo: "Empleados que ganan más que su jefe",
    empresa_patron: "LeetCode 181",
    enunciado: "empleados(id, nombre, salario, jefe_id). Retorna nombres de empleados que ganan más que su jefe (self-join).",
    schema_sql: "CREATE TABLE empleados(id INTEGER PRIMARY KEY, nombre TEXT, salario INTEGER, jefe_id INTEGER);",
    seed_sql: `INSERT INTO empleados VALUES (1,'Ana',90000,NULL),(2,'Luis',95000,1),(3,'Marta',80000,1),(4,'Pedro',70000,2);`,
    solucion_sql: "SELECT e.nombre FROM empleados e JOIN empleados j ON j.id=e.jefe_id WHERE e.salario > j.salario;",
    pista: "Self-join: empleados e JOIN empleados j ON j.id = e.jefe_id.",
    hidden_seed_sql: `INSERT INTO empleados VALUES (5,'Rosa',70000,NULL);`,
    hidden_hint: "Falla con el director sin jefe (jefe_id NULL). El INNER JOIN debe excluirlo solo.",
    default_query: "SELECT * FROM empleados;",
  },
  {
    id: "16-rachas-compras",
    order: 16,
    dificultad: "dificil",
    titulo: "Rachas de compra (3 días seguidos)",
    empresa_patron: "Amazon Shopping Sprees",
    enunciado: "compras(user_id, fecha TEXT). Retorna user_id con compras en 3+ días consecutivos distintos.",
    schema_sql: "CREATE TABLE compras(user_id INTEGER, fecha TEXT);",
    seed_sql: `INSERT INTO compras VALUES (1,'2024-01-01'),(1,'2024-01-02'),(1,'2024-01-03'),(2,'2024-01-01'),(2,'2024-01-03'),(2,'2024-01-05');`,
    solucion_sql: "WITH dias AS (SELECT DISTINCT user_id, fecha FROM compras), marca AS (SELECT user_id, fecha, julianday(fecha) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY fecha) AS g FROM dias) SELECT user_id FROM marca GROUP BY user_id, g HAVING COUNT(*) >= 3;",
    pista: "Islas consecutivas: julianday(fecha) - ROW_NUMBER() agrupa rachas.",
    hidden_seed_sql: `INSERT INTO compras VALUES (3,'2024-02-01'),(3,'2024-02-01'),(3,'2024-02-02'),(3,'2024-02-03');`,
    hidden_hint: "Duplicados el mismo día rompen tu conteo. Usa SELECT DISTINCT primero.",
    default_query: "SELECT user_id, fecha FROM compras ORDER BY user_id, fecha;",
  },
];

export function getChallenge(slug: string) {
  return challenges.find((c) => c.id === slug);
}

export function xpFor(c: Pick<Challenge, "dificultad" | "xp">): number {
  return c.xp ?? XP_POR_DIFICULTAD[c.dificultad];
}

export const TIEMPO_POR_DIFICULTAD = { facil: 10, media: 20, dificil: 30 } as const;

export function tiempoFor(c: Pick<Challenge, "dificultad">): number {
  return TIEMPO_POR_DIFICULTAD[c.dificultad];
}
