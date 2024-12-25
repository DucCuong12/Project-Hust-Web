import { BrowserQRCodeReader } from '@zxing/library';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import { useState } from 'react';
import UILayout from '../../../utils/UILayout';
import { notification } from '../../../utils/toast_notification';
import FeeDisplay from './FeeDisplay';

const getResidentData = async (id: number) => {
  const req = await window.electronAPI.getResidentData(id);
  if (req.status === 'success') {
    return req.data;
  } else {
    console.log(req.message);
    notification.error(req.message);
    return null;
  }
};

const getRequiredFee = async (id: number) => {
  if (!id) return;
  const req = await window.electronAPI.getRequiredFee(id);
  if (req.status === 'success') {
    return req.data;
  } else {
    console.log(req.message);
    notification.error(req.message);
    return null;
  }
};

const calculateTotalFee = (requiredFee: any, residentData: any) => {
  if (requiredFee && residentData) {
    switch (requiredFee.unit) {
      case 'Người':
        return requiredFee.unit_price * residentData.person_number;
      case 'm2':
        return requiredFee.unit_price * residentData.area;
      default:
        return requiredFee.unit_price;
    }
  } else {
    return null;
  }
};

const FeeSummary = () => {
  const [validated, setValidated] = useState(false);
  const [roomID, setRoomID] = useState<number>();
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [result, setResult] = useState<boolean>(false);
  const [feeData, setFeeData] = useState<any>();
  const [totalPrice, setTotalPrice] = useState<number>();

  const qrReader = async (imageData: any) => {
    const codeReader = new BrowserQRCodeReader();
    let res: any;
    try {
      const result = await codeReader.decodeFromImage(imageData);
      return result.text;
    } catch (err) {
      console.error(err);
      notification.error('Không thể đọc mã QR');
    }
  };

  const handleSubmit = async () => {
    const form = document.querySelector('form') as HTMLElement;
    setValidated(true);
    if (form.checkValidity() === true) {
      if (image) {
        const qrImg = document.getElementById('qr-image') as HTMLInputElement;
        const qrData = await qrReader(qrImg);
        Promise.all([getResidentData(roomID), getRequiredFee(qrData)]).then(
          (values) => {
            const residentData = values[0];
            const requiredFee = values[1];
            setFeeData(requiredFee);
            const totalFee = calculateTotalFee(requiredFee, residentData);
            if (totalFee) {
              setResult(true);
              setTotalPrice(totalFee);
            }
          },
        );
      }
    }
  };

  const handleIDChange = (e: any) => {
    setRoomID(e.target.value);
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setResult(false);
  };

  return (
    <UILayout title="Thu phí">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <FloatingLabel controlId="roomID" label="Số phòng" className="mb-3">
          <Form.Control
            required
            name="roomID"
            type="number"
            placeholder="Nhập số phòng"
            onChange={handleIDChange}
            value={roomID}
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số phòng
          </Form.Control.Feedback>
        </FloatingLabel>
        <Form.Group className="mb-3">
          <Form.Label>Ảnh mã QR</Form.Label>
          <Form.Control
            type="file"
            id="qr-form"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng tải ảnh mã QR
          </Form.Control.Feedback>
        </Form.Group>
        {previewUrl && (
          <div style={{ marginTop: '20px' }}>
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              style={{
                width: '300px',
                height: 'auto',
                border: '1px solid #ccc',
              }}
              id="qr-image"
            />
          </div>
        )}
        <FeeDisplay
          show={result}
          handleClose={handleClose}
          feeData={feeData}
          totalPrice={totalPrice}
        />
        <Button variant="success" onClick={handleSubmit}>
          Thu phí
        </Button>
      </Form>
    </UILayout>
  );
};

export default FeeSummary;
