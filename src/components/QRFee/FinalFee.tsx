import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { Form, Button } from 'react-bootstrap';
import FeeDashboard from './FeeDashboard';
import UILayout from '../../../utils/UILayout';

const FinalFee = () => {
  const [qrText, setQrText] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [fileError, setFileError] = useState(false);
  const fileInputRef = useRef(null);
  const [closed, setClosed] = useState<boolean>(false);

  const handleFileChange = async (event: any) => {
    setError('');
    setQrText('');
    setFileError(false);
    setShowResult(false);


    const file = event.target.files[0];
    if (!file) {
      setFileError(true);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const imageData = e.target.result;

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imageDataCanvas = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageDataCanvas.data, imageDataCanvas.width, imageDataCanvas.height);

          if (code) {
            setQrText(code.data);
          } else {
            setError('Không thể giải mã mã QR. Vui lòng đảm bảo đã chọn mã QR hợp lệ.');
          }
        };

        img.onerror = () => {
          setError('Không thể tải ảnh.');
        };

        img.src = imageData;
      };
      reader.onerror = () => {
        setError("Không thể đọc file đã chọn.");
      };

      reader.readAsDataURL(file);
    }
    catch (err: any) {
      setError(`Lỗi xử lý file: ${err.message}`);
    }
  };

  const handleClose = () => {
    setClosed(true);
  }


  const handleSubmit = () => {
    if (!qrText) {
      setError('Vui lòng tải ảnh mã QR trước khi thu phí.');
      return;
    }
    setShowResult(true);
  };


  return (
    <UILayout title="Phí bắt buộc">
    <Form noValidate>
      <Form.Group className="mb-3">
        <Form.Label>Ảnh mã QR</Form.Label>
        <Form.Control
          type="file"
          id="qr-form"
          accept="image/*"
          onChange={handleFileChange}
          isInvalid={fileError}
        />
        <Form.Control.Feedback type="invalid">
          Vui lòng tải ảnh mã QR
        </Form.Control.Feedback>
      </Form.Group>

      {error && <div className="error-message text-danger">{error}</div>}
      <Button variant="success" onClick={handleSubmit}>
        Thu phí
      </Button>
        {showResult && <FeeDashboard show={closed} handleClose={handleClose} />}


    </Form>
    </UILayout>
  );
};

export default FinalFee;