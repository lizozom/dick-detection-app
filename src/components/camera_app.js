import { useEffect, useState, useRef } from 'react';
import './camera_app.css';

const STEP_TAKE_PHOTO = 'take-photo';
const STEP_EDIT_PHOTO = 'edit-photo';

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

console.log(vw, vh);

/**
 * TODO: return stream from back camera if available
 * @returns a video stream or undefined if unavailable
 */
function useCameraStream() {
    const [stream, setStream] = useState(false);

    useEffect(() => {
        var mediaConfig = { video: {
            height: { ideal: vh },
        }, audio: false };
        // Put video listeners into place
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(mediaConfig).then(function (s) {
                setStream(s);
            }).catch(e => {
                console.error('No camera permissions')
            });
        }
    }, []);

    return stream;
}

function getStreamSize(stream) {
    if (!stream) return {};
    return stream.getVideoTracks()[0].getSettings();
}

/**
 * 
 * @param video A video element to fetch a frame from 
 * @returns A png image of the current frame
 */
function captureVideo(video) {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(video, 0, 0);
    return canvas.toDataURL('image/png');
}

function CameraPermissions() {
    const videoRef = useRef();
    const canvasRef = useRef();
    const stream = useCameraStream();
    const [step, setStep] = useState(STEP_TAKE_PHOTO);
    const [photo, setPhoto] = useState(null);
    const [videoSize, setVideoSize] = useState(); 
    const activeSize = {width: vw, height: vh*0.8}; 

    useEffect(() => {
        if (stream) {
            const { aspectRatio } = getStreamSize(stream);
            const height = activeSize.height;
            const width = height * aspectRatio;
            setVideoSize({width, height});
        }
    }, [stream])

    /**
     * Play the stream on a video element
     */
    useEffect(() => {
        if (step === STEP_TAKE_PHOTO && stream) {
            const video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }
    }, [step, stream])

    /** 
     * Render photo on a canvas element
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && photo && stream) {
            var image = new Image();
            image.onload = () => {
                var context = canvas.getContext('2d');

                const { aspectRatio } = getStreamSize(stream);
                const canvasHeight = activeSize.height;
                const canvasWidth = Math.min(activeSize.width, canvasHeight * aspectRatio);
                const widthOnImage = canvasWidth * image.height/canvasHeight;
                const wOffset = Math.max((image.width - widthOnImage) / 2, 0);

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                

                context.drawImage(image, 
                    wOffset, 
                    0, 
                    image.width - 2*wOffset, 
                    image.height, 
                    0, 
                    0, 
                    canvasWidth, 
                    canvasHeight, 
                );
            }
            image.src = photo;

        }
    }, [canvasRef, photo, stream, activeSize]);

    /**
     * Click handler for the snap button
     */
    const takePic = () => {
        const framePng = captureVideo(videoRef.current);
        setPhoto(framePng);
        setStep(STEP_EDIT_PHOTO);
    }

    if (step === STEP_TAKE_PHOTO) {
        return (
            <div className="app-page">
                <div className='ask-permissions'>
                    {!stream && (
                        <div className='privacy-comment'>
                            <p>Before we proceed, we need permissions to access your camera.</p>
                            <p>We don't store your photos or any private information.</p>
                        </div>)}
                </div> 

                <div className={`take-pic ${stream ? '' : 'no-perms'}`}>
                    <div className="media-container">
                        <video ref={videoRef} className="camera-input" width="auto" height={activeSize.height}/>
                    </div>
                    <div className='control-bar'>
                        <button className='snap-btn' onClick={() => {
                            takePic();
                        }}>
                            <svg>
                                <circle cx="4.5vh" cy="4.5vh" r="3.5vh" stroke="white" strokeWidth="0.5vh" fill="black" />
                            </svg>
                        </button>
                    </div>
                </div>                
            </div>
        );
    } else if (step === STEP_EDIT_PHOTO) {
        return (<div className="app-page">
            <div className="media-container">
                <canvas className='edit-photo' ref={canvasRef} height={activeSize.height}/>
            </div>
            
            <div className='control-bar'>
                <button className='retake-btn' onClick={() => {
                    setPhoto(null);
                    setStep(STEP_TAKE_PHOTO);
                }}>
                    Retake
                </button>
            </div>
        </div>);

    }
}

export default CameraPermissions;
