import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { TextField, Grid } from "@mui/material";
import useStringHelper from "../../../utils/useStringHelper";
import useHiraganaConvert from "../../../utils/useHiraganaConvert/useHiraganaConvert";
import useStateEx from "../../../utils/useStateEx";

/*interface Window {
  alphabet?: string | null | undefined;
  yomigana?: string | null | undefined;
  definited?: string | null | undefined;
}
declare var window: Window;

window.alphabet = '';
window.yomigana = '';
window.definited = '';*/

export const RubyField = ({ id, onConfirmed, inputProps }) => {
  const { convertForward } = useHiraganaConvert();
  const {
    isAlpha,
    divideKanaKanji,
    isKana,
    isHiragana,
    isKatakana,
    kataToHira,
  } = useStringHelper();
  //const [alphabet, setAlphabet] = useState('');
  let alphabet = "";
  const [yomigana, setYomigana, getYomigana] = useStateEx("");
  const [definited, setDefinited] = useState("");
  const [kanjis, setKanjis] = useState([]);
  const [rubies, setRubies] = useState([]);
  const ref = useRef(null);
  //const [combinated, setCombinated] = useState<string[]>([]);

  /*useEffect(() => {
    console.log('alphabet: ', alphabet);
  }, [alphabet]);

  useEffect(() => {
    console.log('yomigana: ', yomigana);
  }, [yomigana]);*/

  useEffect(() => {
    console.log("definited: ", definited);
  }, [definited]);
  /*useEffect(() => {
    console.log('combinated: ', combinated);
  }, [combinated]);*/

  useEffect(() => {
    const inputName = ref.current ? ref.current : ref.current;

    if (inputName) {
      inputName.addEventListener("keyup", _onKeyUp);
      inputName.addEventListener("keydown", _onKeyDown);
      inputName.addEventListener("compositionstart", _onCompositionStart);
      inputName.addEventListener("compositionend", _onCompositionEnd);
    }
    return () => {
      if (inputName) {
        inputName.removeEventListener("keyup", _onKeyUp);
        inputName.removeEventListener("keydown", _onKeyDown);
        inputName.removeEventListener("compositionstart", _onCompositionStart);
        inputName.removeEventListener("compositionend", _onCompositionEnd);
      }
    };
  });

  const _onKeyUp = () => {
    if (ref.current && ref.current.value === "") {
      _reset();
    }
  };

  const _onKeyDown = useCallback((e) => {
    if (!e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === "Process") {
        const code = e.code;
        if (code === "Comma") {
          const fullSpec = `${alphabet},`;
          //window.alphabet = fullSpec;
          //setAlphabet(fullSpec);
          alphabet = fullSpec;
          //window.yomigana = `${window.yomigana}、`;
          setYomigana(`${yomigana}、`);
        } else if (code === "Period") {
          const fullSpec = `${alphabet}.`;
          //window.alphabet = fullSpec;
          //setAlphabet(fullSpec);
          alphabet = fullSpec;
          //window.yomigana = `${window.yomigana}。`;
          setYomigana(`${yomigana}。`);
        } else if (code === "Digit1" && e.shiftKey) {
          const fullSpec = `${alphabet}!`;
          //window.alphabet = fullSpec;
          //setAlphabet(fullSpec);
          alphabet = fullSpec;
          //window.yomigana = `${window.yomigana}！`;
          setYomigana(`${yomigana}！`);
        } else if (code === "Slash" && e.shiftKey) {
          const fullSpec = `${alphabet}?`;
          //window.alphabet = fullSpec;
          //setAlphabet(fullSpec);
          alphabet = fullSpec;
          //window.yomigana = `${window.yomigana}？`;
          setYomigana(`${yomigana}？`);
        } else if (code === "Minus") {
          const fullSpec = `${alphabet}-`;
          //window.alphabet = fullSpec;
          //setAlphabet(fullSpec);
          alphabet = fullSpec;
          //window.yomigana = `${window.yomigana}？`;
          setYomigana(`${yomigana}ー`);
        } else {
          const key = code.split("Key")[1];
          if (key && key.length === 1 && isAlpha(key)) {
            //const fullSpec = `${window.alphabet}${key.toLowerCase()}`;
            const fullSpec = `${alphabet}${key.toLowerCase()}`;
            //window.alphabet = fullSpec;
            //setAlphabet(fullSpec);
            alphabet = fullSpec;
            const converted = convertForward(fullSpec);
            //window.yomigana = converted;
            setYomigana(converted);
          }
        }
      }
    }
    // isComposingフラグはキー入力と同期していないので使えない
    /*if (e.isComposing) {
      console.log("入力中");
    }*/
  }, []);

  const _onCompositionStart = useCallback((e) => {
    console.log("入力開始");
  }, []);

  // 漢字変換確定時
  // 漢字部分とひらがな部分に分けて調整
  const _onCompositionEnd = useCallback(async (e) => {
    console.log("入力終了");
    // yomiganaとTextFieldの値を一文字ずつマッチング（読み仮名主体）
    const textField = ref.current ? ref.current : ref.current;
    if (textField) {
      const textFieldValue = textField.value;
      let target = textFieldValue;
      if (definited !== "") {
        const reg = new RegExp(`^${definited}`);
        target = textFieldValue.split(reg)[1];
      }
      if (target) {
        const yomigana_ = await getYomigana();
        let combinatedWork = "";
        // 漢字とひらがなで分離する
        const chunks = divideKanaKanji(target);
        if (chunks && chunks.length === 1) {
          // ひらがなだけ
          if (isKana(chunks[0])) {
            combinatedWork = chunks[0];
          } else {
            // 漢字だけ
            setKanjis([...kanjis.slice(), chunks[0]]);
            if (yomigana_) {
              setRubies([...rubies.slice(), yomigana_]);
              combinatedWork = `〓${chunks[0]}《${yomigana_}》`;
            } else {
              combinatedWork = chunks[0];
            }
          }
        } else if (chunks && chunks.length === 2) {
          if (isKana(chunks[0])) {
            // 先頭がひらがな
            const pattern = new RegExp(`^${chunks[0]}`);
            const patternRuby = new RegExp(`${kataToHira(chunks[0])}`);
            const results = target.split(pattern);
            setKanjis([...kanjis.slice(), results[1]]);
            const results2 = yomigana_.split(patternRuby);
            setRubies([...rubies.slice(), results2[1]]);
            combinatedWork = `${chunks[0]}〓${chunks[1]}《${results2[1]}》`;
          } else if (isKana(chunks[1])) {
            // 末尾がひらがな
            const pattern = new RegExp(`^${chunks[1]}$`);
            const patternRuby = new RegExp(`${kataToHira(chunks[1])}`);
            const results = target.split(pattern);
            setKanjis([...kanjis.slice(), results[0]]);
            const results2 = yomigana_.split(patternRuby);
            setRubies([...rubies.slice(), results2[0]]);
            combinatedWork = `〓${chunks[0]}《${results2[0]}》${chunks[1]}`;
          }
        } else if (chunks && chunks.length === 3) {
          if (isKana(chunks[0])) {
            // 先頭がひらがな - 先頭のひらがなを除去後末尾のひらがなを除去
            const pattern = new RegExp(`^${chunks[0]}`);
            const patternRuby = new RegExp(`${kataToHira(chunks[0])}`);
            const results = target.split(pattern);
            const results2 = yomigana_.split(patternRuby);
            const pattern3 = new RegExp(`${kataToHira(chunks[2])}$`);
            const patternRuby3 = new RegExp(`${kataToHira(chunks[2])}`);
            const results3 = results[1].split(pattern3);
            setKanjis([...kanjis.slice(), results3[0]]);
            const results4 = results2[1].split(patternRuby3);
            setRubies([...rubies.slice(), results4[0]]);
            combinatedWork = `${chunks[0]}〓${chunks[1]}《${results4[0]}》${chunks[2]}`;
          } else if (!isKana(chunks[0])) {
            // 先頭が漢字
            const pattern = new RegExp(`${kataToHira(chunks[1])}`);
            const patternRuby = new RegExp(`${kataToHira(chunks[1])}`);
            const results = target.split(pattern);
            setKanjis([...kanjis.slice(), ...results]);
            const results2 = yomigana_.split(patternRuby);
            setRubies([...rubies.slice(), ...results2]);
            combinatedWork = `〓${chunks[0]}《${results2[0]}》${chunks[1]}〓${chunks[2]}《${results2[1]}》`;
          }
        } else if (chunks && chunks.length === 4) {
          if (isKana(chunks[0])) {
            // 先頭がひらがな - 先頭のひらがなを除去後末尾のひらがなを除去
            const pattern1 = new RegExp(`^${kataToHira(chunks[0])}`);
            const patternRuby = new RegExp(`${kataToHira(chunks[0])}`);
            const results1 = target.split(pattern1);
            const results2 = yomigana_.split(patternRuby);
            const pattern2 = new RegExp(`${kataToHira(chunks[2])}`);
            const patternRuby2 = new RegExp(`${kataToHira(chunks[2])}`);
            const results3 = results1[1].split(pattern2);
            setKanjis([...kanjis.slice(), ...results3]);
            const results4 = results2[1].split(patternRuby2);
            setRubies([...rubies.slice(), ...results4]);
            combinatedWork = `${chunks[0]}〓${chunks[1]}《${results4[0]}》${chunks[2]}〓${chunks[3]}《${results4[1]}》`;
          } else if (!isKana(chunks[0])) {
            // 先頭が漢字
            const pattern1 = new RegExp(`${kataToHira(chunks[3])}$`);
            const patternRuby = new RegExp(`${kataToHira(chunks[3])}`);
            const results1 = target.split(pattern1);
            const results2 = yomigana_.split(patternRuby);
            const pattern2 = new RegExp(`${kataToHira(chunks[1])}`);
            const patternRuby2 = new RegExp(`${kataToHira(chunks[1])}`);
            const results3 = results1[0].split(pattern2);
            setKanjis([...kanjis.slice(), ...results3]);
            const results4 = results2[0].split(patternRuby2);
            setRubies([...rubies.slice(), ...results4]);
            combinatedWork = `〓${chunks[0]}《${results4[0]}》${chunks[1]}〓${chunks[2]}《${results4[1]}》${chunks[3]}`;
          }
        }
        //setCombinated(combinatedWork);
        //window.definited = `${window.definited}${chunks.join('')}`;
        setDefinited(`${definited}${chunks.join("")}`);
        //setAlphabet('');
        alphabet = "";
        setYomigana("");

        if (onConfirmed) {
          onConfirmed(combinatedWork);
          textField.value = "";
        }
      }
    }
  }, []);

  const _reset = () => {
    //window.alphabet = '';
    //setAlphabet('');
    alphabet = "";
    //window.yomigana = '';
    //setYomigana('');
    setYomigana("");
    //window.definited = '';
    setDefinited("");
    setKanjis([]);
    setRubies([]);
    /*const textField = ref.current
      ? (ref.current as HTMLInputElement)
      : ref.current;
    if (textField) {
      textField.value = '';
    }*/
  };

  return (
    <TextField
      id={id}
      type="text"
      inputRef={ref}
      name="input_ruby"
      inputProps={inputProps}
      fullWidth={true}
      placeholder="入力してください。"
    />
  );
};
