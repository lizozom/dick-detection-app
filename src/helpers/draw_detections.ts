

import type { MutableRefObject } from 'react';
import { Detection } from "../types";
  

const colors = [
    "rgb( 255, 69,   0)",
    "rgb( 32, 178, 170)"
  ];

  const class_names = [
    "background",
    "dick", "dick-head"
  ];
  export function drawDetections(canvasRef: MutableRefObject<HTMLCanvasElement>, detections: Array<Detection>) {
    detections.forEach(detection => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const { bbox_h, bbox_w, bbox_x, bbox_y, label, prob } = detection;
        
        if (label == 1) {
            ctx.strokeStyle = colors[0];
            ctx.fillStyle = colors[0];
        }
        else {
            ctx.strokeStyle = colors[1];
            ctx.fillStyle = colors[1];
        }
  
        ctx.strokeRect(bbox_x, bbox_y, bbox_w, bbox_h);
        ctx.lineWidth = 2;
  
        var text = class_names[label] + ": " + parseFloat(String(prob * 100)).toFixed(2) + "%";
  
        ctx.textBaseline = 'top';
        var text_width = ctx.measureText(text).width;
        var text_height = parseInt(ctx.font, 10);
  
        var x = bbox_x;
        var y = bbox_y - text_height;
        if (y < 0)
            y = 0;
        if (x + text_width > canvas.width)
            x = canvas.width - text_width;
  
        //ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(x-1, y-2, text_width+4, text_height+2);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(text, x+1, y-2);
  
      });
}