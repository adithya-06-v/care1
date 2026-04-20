import type { Exercise } from "./exerciseGenerator";

export interface DatasetEntry {
  id: number;
  text: string;
  type: "word" | "sentence";
  difficulty: "easy" | "medium" | "hard";
}

export interface DatasetResult {
  data: Omit<Exercise, "id">[];
  source: string;
  isFallback: boolean;
}

const DIFFICULTY_MAP: Record<DatasetEntry["difficulty"], Exercise["difficulty"]> = {
  easy: "beginner",
  medium: "moderate",
  hard: "severe",
};

const FALLBACK_LANGUAGE = "english";
const FALLBACK_MODE = "beginner";

const datasetCache: Record<string, DatasetEntry[]> = {};

function datasetEntryToExercise(entry: DatasetEntry): Omit<Exercise, "id"> {
  const isWord = entry.type === "word";

  return {
    type: isWord ? "word_repetition" : "sentence_reading",
    title: isWord ? "Word Practice" : "Sentence Reading",
    instruction: isWord
      ? "Say this word clearly and slowly"
      : "Read this sentence clearly",
    content: entry.text,
    difficulty: DIFFICULTY_MAP[entry.difficulty] || "beginner",
    targetGoal: "pronunciation",
  };
}

function isValidDatasetEntry(entry: unknown): entry is DatasetEntry {
  if (typeof entry !== "object" || entry === null) return false;
  const obj = entry as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.text === "string" &&
    (obj.type === "word" || obj.type === "sentence") &&
    (obj.difficulty === "easy" || obj.difficulty === "medium" || obj.difficulty === "hard")
  );
}

async function fetchDataset(lang: string, mode: string): Promise<DatasetEntry[] | null> {
  const cacheKey = `${lang}_${mode}`;

  if (datasetCache[cacheKey]) {
    console.log(`Cache hit: ${lang}/${mode} (${datasetCache[cacheKey].length} items)`);
    return datasetCache[cacheKey];
  }

  try {
    const response = await fetch(`/data/${lang}/${mode}.json`);
    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return null;

    const valid = data.filter(isValidDatasetEntry);
    if (valid.length === 0) return null;

    datasetCache[cacheKey] = valid;
    return valid;
  } catch {
    return null;
  }
}

export async function loadDataset(
  language: string = FALLBACK_LANGUAGE,
  mode: string = FALLBACK_MODE,
): Promise<DatasetResult> {
  const safeLang = language.toLowerCase().trim() || FALLBACK_LANGUAGE;
  const safeMode = mode.toLowerCase().trim() || FALLBACK_MODE;

  // 1. Primary: requested language + requested mode
  const primary = await fetchDataset(safeLang, safeMode);
  if (primary) {
    const source = `${safeLang}/${safeMode}`;
    console.log(`Dataset loaded: ${source} (${primary.length} items)`);
    return { data: primary.map(datasetEntryToExercise), source, isFallback: false };
  }

  // 2. Secondary: english + same mode
  if (safeLang !== FALLBACK_LANGUAGE) {
    console.warn(
      `Dataset not found: ${safeLang}/${safeMode}, falling back to ${FALLBACK_LANGUAGE}/${safeMode}`,
    );
    const secondary = await fetchDataset(FALLBACK_LANGUAGE, safeMode);
    if (secondary) {
      const source = `${FALLBACK_LANGUAGE}/${safeMode}`;
      console.log(`Fallback loaded: ${source} (${secondary.length} items)`);
      return { data: secondary.map(datasetEntryToExercise), source, isFallback: true };
    }
  }

  // 3. Final: english + beginner
  if (safeMode !== FALLBACK_MODE) {
    console.warn(
      `English mode dataset missing, falling back to ${FALLBACK_LANGUAGE}/${FALLBACK_MODE}`,
    );
    const final = await fetchDataset(FALLBACK_LANGUAGE, FALLBACK_MODE);
    if (final) {
      const source = `${FALLBACK_LANGUAGE}/${FALLBACK_MODE}`;
      console.log(`Final fallback loaded: ${source} (${final.length} items)`);
      return { data: final.map(datasetEntryToExercise), source, isFallback: true };
    }
  }

  // 4. All failed
  console.warn("All dataset fallbacks failed, returning empty array");
  return { data: [], source: "none", isFallback: true };
}
