import {Button } from '@mui/material';
import React, { useState, useRef } from 'react';


const SignatureCanvas = ({ getValues, setValue, trigger }) => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const startDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        setDrawing(true);
    };

    const endDrawing = () => {
        setDrawing(false);
    };

    const draw = (e) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


    const saveSignature = () => {
        const canvas = canvasRef.current;
        const signatureData = canvas.toDataURL('image/png');
        setValue("signatureImage", signatureData);
    };

    return (
        <div>
            <canvas style={{ border: "1px solid #000" }} ref={canvasRef} width={400} height={200} onMouseDown={startDrawing} onMouseUp={endDrawing} onMouseMove={draw} />
            <div>
                <Button type='button'variant="contained"  onClick={()=>{clearCanvas()}}>Reset</Button>
                <Button type='button'variant="contained" onClick={()=>{ saveSignature()}}>Save Signature</Button>
            </div>
        </div>
    );
};

export default SignatureCanvas;
