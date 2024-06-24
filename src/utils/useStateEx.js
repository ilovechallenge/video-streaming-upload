import { useState } from "react";

function useStateEx(initialState) {
  const [state, setState] = useState(initialState);
  const getLatestState = () => {
    return new Promise((resolve, reject) => {
      setState((s) => {
        resolve(s);
        return s;
      });
    });
  };

  return [state, setState, getLatestState];
}

export default useStateEx;
