import { BrowserQRCodeReader } from '@zxing/library';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import { useState } from 'react';
import UILayout from '../../../utils/UILayout';
import { notification } from '../../../utils/toast_notification';
import FeeDisplay from './FeeDisplay';

// Utility function for API requests
const fetchData = async (apiMethod: Function, id: number, errorMessage: string) => {
  try {
    const req = await apiMethod(id);
    if (req.status === 'success') {
      return req.data;
    } else {
      console.log(req.message);
      notification.error(req.message);
      return null;
    }
  } catch (error) {
    console.error(errorMessage, error);
    notification.error(errorMessage);
    return null;
  }
};

// Calculation function
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
  }
  return null;
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
    try {
      const result = await codeReader.decodeFromImage(imageData);
      return result.text;
    } catch (err) {
      console.error(err);
      notification.error('Không thể đọc mã QR');
      return null;
    }
  };

  const handleSubmit = async () => {
    const form = document.querySelector('form') as HTMLElement;
    setValidated(true);
    if (form.checkValidity() === true && image) {
      const qrImg = document.getElementById('qr-image') as HTMLInputElement;
      const qrData = await qrReader(qrImg);
      if (qrData) {
        Promise.all([
          fetchData(window.electronAPI.getResidentData, roomID, 'Lỗi khi lấy dữ liệu cư dân'),
          fetchData(window.electronAPI.getRequiredFee, qrData, 'Lỗi khi lấy phí cần thiết'),
        ]).then(([residentData, requiredFee]) => {
          setFeeData(requiredFee);
          const totalFee = calculateTotalFee(requiredFee, residentData);
          if (totalFee !== null) {
            setResult(true);
            setTotalPrice(totalFee);
          }
        });
      }
    }
  };

  const handleInputChange = (setter: Function) => (e: any) => {
    setter(e.target.value);
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => setResult(false);

  return (
    <UILayout title="Thu phí">
      <Form noValidate validated={validated} onSubmit={(e) => e.preventDefault()}>
        <FloatingLabel controlId="roomID" label="Số phòng" className="mb-3">
          <Form.Control
            required
            name="roomID"
            type="number"
            placeholder="Nhập số phòng"
            onChange={handleInputChange(setRoomID)}
            value={roomID}
          />
          <Form.Control.Feedback type="invalid">Vui lòng nhập số phòng</Form.Control.Feedback>
        </FloatingLabel>
        <Form.Group className="mb-3">
          <Form.Label>Mã QR</Form.Label>
          <Form.Control
            type="file"
            id="qr-form"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Form.Control.Feedback type="invalid">Tải mã QR tại đây</Form.Control.Feedback>
        </Form.Group>
        {previewUrl && (
          <div style={{ marginTop: '25px' }}>
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
