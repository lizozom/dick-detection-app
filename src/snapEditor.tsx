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

import './snapEditor.scss';
import { TFLite } from './hooks/useTFLite';
import { useRenderingPipeline } from './hooks';
import { SourcePlayback } from './helpers';
import { BackgroundConfig } from './helpers/pipelineHelpers';

export interface SnapEditorProps {
    tflite: TFLite;
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>();
  const [filterEl, setFilterEl] = useState<ReactNode | null>(null);
  const [currentFilter, setCurrentFilter] = useState<OverlayItem | null>(null);
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>();
  const {
    canvasRef,
  } = useRenderingPipeline(
    sourcePlayback,
    props.tflite,
    {
      detections: props.detections,
      backgroundConfig,
    }
  );

  useEffect(() => {
    const inputImage = new Image();
    inputImage.width = props.screenSize.width;
    inputImage.height = props.screenSize.height;
    inputImage.onload = () => {
      setSourcePlayback({
        htmlElement: inputImage,
      ...props.screenSize
      })
    }
    inputImage.src = props.snap;
  }, [])

  useEffect(() => {
    setBackgroundConfig(undefined);
    const el = currentFilter?.render(props.detections, (conf: BackgroundConfig) => setBackgroundConfig(conf)) || null;
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
  
  const backgroundStyle: React.CSSProperties = {}
  if (backgroundConfig?.type === 'image' && backgroundConfig.url) {
    backgroundStyle.backgroundImage = `url(${backgroundConfig.url})`;
  }

  return (
    <div className="snap-editor">

      <div className="content" ref={contentRef} >
        <Header extraButton={downloadButton} extraClass="floating" />
        <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} style={backgroundStyle}/>
        {filterEl}
      </div>

      <div className="download-button" />
      <div className="app-control">
        <Carousel items={carouselItems} onClick={onCarouselClick} />
      </div>
    </div>
  );
}
