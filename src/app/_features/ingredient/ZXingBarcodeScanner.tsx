import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from '@zxing/library';
import { useEffect, useMemo, useRef, useState } from 'react';

function ZXingBarcodeScanner() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const videoSourceRef = useRef<HTMLDivElement>(null);

  const hints = new Map();
  const formats = [
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_39,
  ];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const reader = useMemo(() => new BrowserMultiFormatReader(), []);

  useEffect(() => {
    async function setupScanner() {
      const videoInputDevices = await reader.listVideoInputDevices();
      console.log(videoInputDevices);

      setSelectedDeviceId(videoInputDevices[0].deviceId);

      // TODO: Handle more than one video input device and allow user to select which one to use
    }

    setupScanner();
  }, [reader]);

  function startScanner() {
    reader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        console.log(result.getText());
        setScannerResult(result.getText());
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
        setScannerError(err.message);
      }
    });

    console.log('Scanner started with device ID:', selectedDeviceId);
  }

  return (
    <div>
      <div ref={videoSourceRef}>Change video source</div>
      Scanner
      {scannerResult && <div>Result: {scannerResult}</div>}
      {scannerError && <div>Error: {scannerError}</div>}
      <button onClick={startScanner}>Start</button>
      <div>
        <video
          id="video"
          width="300"
          height="200"
          style={{ border: '1px solid gray' }}
        ></video>
      </div>
    </div>
  );
}

export default ZXingBarcodeScanner;
