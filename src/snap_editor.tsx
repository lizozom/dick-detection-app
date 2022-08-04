import * as React from 'react';
import {
  ReactNode, useRef, useState, useEffect,
} from 'react';
import ReactGA from 'react-ga4';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import type { ScreenSize } from './types';
import { Header, Carousel, CarouselItem } from './components';
import { items, OverlayItem } from './filters';
import { Detection } from './helpers';

// @ts-ignore
import RetrySrc from '../public/retry-icon.svg';

import './snap_editor.scss';

export interface SnapEditorProps {
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [filterEl, setFilterEl] = useState<ReactNode | null>(null);
  const [currentFilter, setCurrentFilter] = useState<OverlayItem | null>(null);

  useEffect(() => {
    const el = currentFilter?.render(props.detections) || null;
    setFilterEl(el);
  }, [currentFilter]);

  const carouselItems: CarouselItem[] = [
    {
      id: 'retake',
      src: RetrySrc,
      onClick: () => {
        ReactGA.event({
          category: 'user',
          action: 'retake_snap',
        });
        props.onClear();
      },
    },
    ...items.map((item) => ({
      id: item.id,
      src: item.src,
      onClick: () => {
        ReactGA.event({
          category: 'user',
          action: 'apply_filter',
          label: item?.id || 'none',
        });
        setCurrentFilter(item);
      },
    })),
  ];

  const renderOnCanvas = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0);
  };

  const onCarouselClick = (item: CarouselItem) => {
    item.onClick(item);
  };

  const onDownloadClick = () => {
    if (!contentRef.current) return;

    ReactGA.event({
      category: 'user',
      action: 'download',
      label: currentFilter?.id || 'none',
    });

    html2canvas(contentRef.current).then((canvas) => {
      const image = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.download = `duckpuc-${new Date().getTime()}.png`;
      link.href = image;
      link.click();
    }).catch((e) => {
      ReactGA.event({
        category: 'user',
        action: 'download_error',
      });
    });
  };

  const downloadButton = <Button variant="contained" aria-label="download" onClick={onDownloadClick}> Download </Button>;
  return (
    <div className="snap-editor">
      <img className="loader" ref={imgRef} alt="tmp" src={props.snap} width={props.screenSize.width} height={props.screenSize.height} onLoad={renderOnCanvas} />

      <div className="content" ref={contentRef}>
        <Header extraButton={downloadButton} />
        <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} />
        {filterEl}
      </div>

      <div className="download-button" />
      <div className="app-control">
        <Carousel items={carouselItems} onClick={onCarouselClick} />
      </div>
    </div>
  );
}
