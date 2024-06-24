import React from "react";

const seed = Intl.DateTimeFormat().resolvedOptions();
const timezoneString = new Date()
  .toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "short" })
  .substring(4);
const areaCity = Intl.DateTimeFormat().resolvedOptions().timeZone;

const useStringHelper = () => {
  const isAlpha = (value) => {
    if (value.match(/[^A-Z|^a-z]/g)) {
      return false;
    } else {
      return true;
    }
  };

  const isKana = (value) => {
    value = value === null ? "" : value;
    // eslint-disable-next-line
    if (value.match(/^[ぁ-んァ-ヶー　、。？！]*$/)) {
      //"ー"の後ろの文字は全角スペースです。
      return true;
    } else {
      return false;
    }
  };

  const isHiragana = (value) => {
    value = value === null ? "" : value;
    // eslint-disable-next-line
    if (value.match(/^[ぁ-んー　、。？！]*$/)) {
      //"ー"の後ろの文字は全角スペースです。
      return true;
    } else {
      return false;
    }
  };

  const isKatakana = (value) => {
    value = value === null ? "" : value;
    // eslint-disable-next-line
    if (value.match(/^[ァ-ヶー]*$/)) {
      return true;
    } else {
      return false;
    }
  };

  const divideKanaKanji = (value) => {
    const qty = value.length;
    const attributes = new Map();
    for (let index = 0; index < qty; index++) {
      attributes.set(
        index,
        isHiragana(value.charAt(index)) || isKatakana(value.charAt(index))
      );
    }
    let lastState = null;
    let chunk = "";
    let chunks = [];
    for (let index = 0; index < qty; index++) {
      if (attributes.get(index) === lastState) {
        chunk = `${chunk}${value.charAt(index)}`;
        lastState = attributes.get(index) ?? true; // undefinedはひらがな（文法上）
      } else {
        if (index !== 0) {
          chunks.push(chunk);
        }
        chunk = value.charAt(index);
        lastState = attributes.get(index) ?? true;
      }
    }
    if (chunk.length !== 0) {
      chunks.push(chunk);
    }
    return chunks;
  };

  const dropRuby = (val) => {
    let replaced = val.replace(/《(.*?)》/g, "");
    replaced = replaced.replace(/〓/g, "");
    return replaced;
  };

  const convertRuby = (val) => {
    const boxes = [];
    const splitted = val.split("〓");
    for (const element of splitted) {
      const twoStaged = element.split("》");
      for (const element of twoStaged) {
        boxes.push(element);
      }
    }
    return _tagProcessor(boxes);
  };

  // 漢字の文字数とルビの分割数が同じでない場合はそれぞれひとまとめにしてルビを打つ
  //processed = <>{JsxParser(val)}</>;
  //processed = <>{JsxParser('4<ruby>年年<rt>ねん　ねん</rt></ruby>')}</>;
  const _tagProcessor = (values) => {
    let processed = "";
    for (const value of values) {
      const splitted = value.split("《");
      if (splitted.length === 1) {
        processed += splitted[0];
      } else {
        const kanji = splitted[0];
        const rubyChunk = splitted[1];
        const evened = rubyChunk.replaceAll(" ", "　");
        const rubies = evened.split("　");
        if (kanji.length === rubies.length) {
          const qty = rubies.length;
          for (let index = 0; index < qty; index++) {
            processed += `<ruby>${kanji[index]}<rt class="optional">${rubies[index]}</rtstyle=></ruby>`;
          }
        } else {
          processed += `<ruby>${kanji}<rt class="optional">${rubies.join()}</rt></ruby>`;
        }
      }
    }
    return processed;
  };

  const kataToHira = (value) => {
    if (value) {
      let retVal = "";
      const qty = value.length;
      for (let index = 0; index < qty; index++) {
        let word = value.charAt(index);
        if (word === "ー") {
          // 何もしない
        } else if (isKatakana(word)) {
          word = String.fromCharCode(word.charCodeAt(0) - 0x60);
        }
        retVal += word;
      }
      return retVal;
    } else {
      return "";
    }
  };

  return {
    isAlpha,
    isKana,
    isHiragana,
    isKatakana,
    divideKanaKanji,
    dropRuby,
    convertRuby,
    kataToHira,
  };
};

export default useStringHelper;
