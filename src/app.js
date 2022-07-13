import React, { useCallback, useEffect, useState } from 'react';
import Yolo from '../Sample.js';
import YoloWASM from '../Sample.wasm';

export function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [yoloCore, setYolo] = useState(undefined);

  useEffect(() => {
    const yolo = Yolo({
        locateFile: () => {
            return YoloWASM;
        },
    });
    
    yolo.then((core) => {
        setYolo(core);
    });
  }, [])

  const onClick = (e) => {
    setCount(count + 1);
    console.log(yoloCore.detect_yolo(1, 2));
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={onClick}>
        Click me
      </button>
    </div>
  );
}