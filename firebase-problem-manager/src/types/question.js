/**
 * 問題データ型定義
 * @typedef {Object} Question
 * @property {string} id - ドキュメントID
 * @property {string} kanji - 漢字
 * @property {string[]} readings - 正解の読み方配列
 * @property {number} level - 難易度 (0=零級, 1=一級, 2=二級, 3=三級, 4=四級, 5=五級)
 * @property {string} [explanation] - 説明
 * @property {string} [condition] - 条件
 * @property {string} [source] - 出典
 * @property {number} [createdAt] - 作成日時（タイムスタンプ）
 * @property {number} [updatedAt] - 更新日時（タイムスタンプ）
 */

export const LEVELS = {
  ZERO: 0,    // 零級
  ONE: 1,     // 一級
  TWO: 2,     // 二級
  THREE: 3,   // 三級
  FOUR: 4,    // 四級
  FIVE: 5     // 五級
};

export const LEVEL_NAMES = {
  0: "零級",
  1: "一級",
  2: "二級",
  3: "三級",
  4: "四級",
  5: "五級"
};
