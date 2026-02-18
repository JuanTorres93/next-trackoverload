'use client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = 'html5qr-code-full-region';
type ScannerConfig = ConstructorParameters<typeof Html5QrcodeScanner>[1];

type BarcodeScannerProps = {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: unknown) => void;
  qrCodeErrorCallback?: (errorMessage: string, error: unknown) => void;
};

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: BarcodeScannerProps) => {
  const config: ScannerConfig = {
    fps: props.fps ?? 10,
  };
  if (props.qrbox !== undefined) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio !== undefined) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

function BarcodeScanner(props: BarcodeScannerProps) {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose,
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback,
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error('Failed to clear BarcodeScanner. ', error);
      });
    };
  }, [props]);

  return <div id={qrcodeRegionId} />;
}

export default BarcodeScanner;
