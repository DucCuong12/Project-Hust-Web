import React, {useState, useEffect} from 'react';
import { Modal, Form, Button, FloatingLabel } from 'react-bootstrap';

const FeeDashboard = (properties: any) => {
    const [qrText, setQrText] = useState("");

    useEffect(() => {
       if(properties.qrText) {
           setQrText(properties.qrText)
       }
    },[properties.qrText])

    return (
    <Modal backdrop="static" show={true} onHide={properties.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin phí</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <FloatingLabel controlId="feeName" label="Tên khoản phí" className="mb-3">
            <Form.Control name="feeName" type="text" value={}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="feeUnitPrice" label="Số tiền nộp" className="mb-3"
          >
            <Form.Control name="feeUnitPrice" type="text" value={"200.000 VND"}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={properties.handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default FeeDashboard;