import { jsChallenges, type JsChallenge } from "./curriculumJs";
import type { ProgressMap } from "./progress";

export function siguienteJs(p: ProgressMap): JsChallenge | null {
  return jsChallenges.find((c) => !p[`js-${c.id}`]) ?? null;
}
