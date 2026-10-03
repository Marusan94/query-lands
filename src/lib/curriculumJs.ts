export type JsTest = { nombre: string; args: unknown[]; esperado: unknown };
export type JsChallenge = {
  id: string;
  order: number;
  dificultad: "facil" | "media" | "dificil";
  titulo: string;
  empresa_patron: string;
  enunciado: string;
  firma: string;
  default_code: string;
  solucion: string;
  pista: string;
  tests: JsTest[];
  hidden_tests: JsTest[];
};

export const jsChallenges: JsChallenge[] = [
  {
    id: "01-fizzbuzz",
    order: 1,
    dificultad: "facil",
    titulo: "FizzBuzz técnico",
    empresa_patron: "Clásico filtro",
    enunciado: "Implementa fizzbuzz(n): retorna array 1..n donde múltiplos de 3 → 'Fizz', de 5 → 'Buzz', de ambos → 'FizzBuzz'.",
    firma: "function fizzbuzz(n) {",
    default_code: `function fizzbuzz(n) {\n  // tu código\n  return [];\n}`,
    solucion: `function fizzbuzz(n) {\n  return Array.from({length: n}, (_, i) => {\n    const v = i + 1;\n    if (v % 15 === 0) return 'FizzBuzz';\n    if (v % 3 === 0) return 'Fizz';\n    if (v % 5 === 0) return 'Buzz';\n    return v;\n  });\n}`,
    pista: "Recorre 1..n y chequea %15 primero.",
    tests: [
      { nombre: "n=5", args: [5], esperado: [1, 2, "Fizz", 4, "Buzz"] },
      { nombre: "n=15 incluye FizzBuzz", args: [15], esperado: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"] },
    ],
    hidden_tests: [
      { nombre: "n=1", args: [1], esperado: [1] },
      { nombre: "n=30 largo", args: [30], esperado: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz", 16, 17, "Fizz", 19, "Buzz", "Fizz", 22, 23, "Fizz", "Buzz", 26, "Fizz", 28, 29, "FizzBuzz"] },
    ],
  },
  {
    id: "02-palindromo",
    order: 2,
    dificultad: "facil",
    titulo: "Palíndromo robusto",
    empresa_patron: "Filtro / Spotify",
    enunciado: "Implementa esPalindromo(s): true si se lee igual al derecho y al revés, ignorando mayúsculas y no-alfanuméricos.",
    firma: "function esPalindromo(s) {",
    default_code: `function esPalindromo(s) {\n  // tu código\n  return false;\n}`,
    solucion: `function esPalindromo(s) {\n  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return t === [...t].reverse().join('');\n}`,
    pista: "Normaliza con toLowerCase + regex, luego compara con el reverso.",
    tests: [
      { nombre: "'Ana' → true", args: ["Ana"], esperado: true },
      { nombre: "'hola' → false", args: ["hola"], esperado: false },
    ],
    hidden_tests: [
      { nombre: "frase con signos", args: ["A man, a plan, a canal: Panama"], esperado: true },
      { nombre: "vacío → true", args: [""], esperado: true },
    ],
  },
  {
    id: "03-agrupa-edad",
    order: 3,
    dificultad: "media",
    titulo: "Agrupa y promedia",
    empresa_patron: "Amazon / Data",
    enunciado: "Implementa promedioPorDepto(empleados): recibe [{nombre, depto, salario}] y retorna { [depto]: promedio }. Redondea a 1 decimal.",
    firma: "function promedioPorDepto(empleados) {",
    default_code: `function promedioPorDepto(empleados) {\n  // tu código\n  return {};\n}`,
    solucion: `function promedioPorDepto(e) {\n  const acc = {};\n  for (const x of e) { (acc[x.depto] ??= {s:0,n:0}); acc[x.depto].s += x.salario; acc[x.depto].n++; }\n  return Object.fromEntries(Object.entries(acc).map(([k,v]) => [k, Math.round(v.s/v.n*10)/10]));\n}`,
    pista: "Acumula suma y conteo por depto, luego divide.",
    tests: [
      { nombre: "2 deptos", args: [[{ nombre: "a", depto: "it", salario: 100 }, { nombre: "b", depto: "it", salario: 200 }, { nombre: "c", depto: "qa", salario: 300 }]], esperado: { it: 150, qa: 300 } },
    ],
    hidden_tests: [
      { nombre: "vacío → {}", args: [[]], esperado: {} },
      { nombre: "decimales", args: [[{ nombre: "a", depto: "it", salario: 100 }, { nombre: "b", depto: "it", salario: 101 }]], esperado: { it: 100.5 } },
    ],
  },
];

export function getJsChallenge(slug: string) {
  return jsChallenges.find((c) => c.id === slug);
}
