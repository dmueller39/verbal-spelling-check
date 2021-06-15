// @flow
import type { VerbalGame } from "./types";
import englishWords from "./words";
import shuffle from "./common/shuffle";

function mangle(word: string, index: number): string {
  const letter1 = word[index];
  const letter2 = word[index + 1];
  return word.slice(0, index) + letter2 + letter1 + word.slice(index + 2);
}

function misspell(word: string): string {
  const index = Math.floor(Math.random() * (word.length - 1));
  const result = mangle(word, index);
  if (result == word) {
    if (index == 0) {
      return mangle(word, 1);
    }
    return mangle(word, index - 1);
  }
  return result;
}

function getRandomIndexes(length: number): Array<boolean> {
  let random = [];
  for (let index = 0; index < length; index++) {
    random[index] = index < length / 2;
  }
  return shuffle(random);
}

export function getMangledWordGamePlan(
  words: Array<string>,
  length: number
): VerbalGame {
  let incorrect = getRandomIndexes(length);

  const turns = shuffle(words)
    .slice(0, length)
    .map((word, index) => {
      return {
        incorrect: incorrect[index],
        text: incorrect[index] ? misspell(word) : word,
        explanation: word,
      };
    });
  return {
    turns: turns,
  };
}

function getRandomIndex(max: number, validator: (number) => boolean): number {
  let i = 0;
  while (i < 10) {
    const candidate = Math.floor(Math.random() * max);
    if (validator(candidate)) {
      return candidate;
    }
    i++;
  }
  // arbitrarily, if we can't find a match after 10, then the data is probably wrong
  throw new Error("invalid data");
}

export function getSwappedWordsGamePlan(
  pairSets: Array<Array<[string, string]>>,
  length: number
): VerbalGame {
  // need to get the actual length
  const setsToPick = shuffle([...pairSets]);

  // whole groups should be randomly selected until we have more than the desired length
  const pickedSets: Array<Array<[string, string]>> = [];
  let currentLength = 0;
  let currentSetIndex = 0;
  while (currentLength < length && currentSetIndex < setsToPick.length) {
    pickedSets.push(setsToPick[currentSetIndex]);
    currentLength += setsToPick[currentSetIndex].length;
    currentSetIndex++;
  }

  const incorrect = getRandomIndexes(currentLength);
  let currentIndex = 0;

  const turns: Array<{ incorrect: boolean, text: string }> = [];

  pickedSets.forEach((pickedSet, pickedSetIndex) => {
    pickedSet.forEach((pair) => {
      if (incorrect[currentIndex]) {
        // words can only be swapped within a group
        const otherIndex = getRandomIndex(pickedSet.length, (index) => {
          // the swap can't be the same word (words can be equal within a group)
          return (
            pickedSet[index][1] != pair[1] && pickedSet[index][0] != pair[0]
          );
        });
        const mismatchedPair = [pair[0], pickedSet[otherIndex][1]];
        turns.push({
          text: mismatchedPair.join(" - "),
          incorrect: true,
          explanation:
            pair.join(" - ") + "\n" + pickedSet[otherIndex].join(" - "),
        });
      } else {
        turns.push({
          text: pair.join(" - "),
          incorrect: false,
          explanation: pair.join(" - "),
        });
      }
      currentIndex++;
    });
  });

  // put all pairs into an array, shuffle, and return
  return {
    turns: shuffle(turns),
  };
}

export function getEnglishGamePlan(): VerbalGame {
  return getMangledWordGamePlan(
    englishWords.filter((word) => word.length > 5),
    30
  );
}
