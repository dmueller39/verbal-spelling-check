// @flow

export type VerbalGame = {
  turns: Array<{ text: string, incorrect: boolean, explanation: string }>,
};

export type VerbalGameResult = {
  mistakes: number,
  length: number,
};
