import { Form, FloatingLabel, Button, Modal } from 'react-bootstrap';

const FeeDisplay = (props: any) => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin khoản phí</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <FloatingLabel controlId="feeName" label="Tên khoản" className="mb-3">
            <Form.Control
              required
              name="feeName"
              type="text"
              placeholder=""
              value={props.feeData?.fee_name}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="feeUnitPrice"
            label="Đơn giá"
            className="mb-3"
          >
            <Form.Control
              required
              name="feeUnitPrice"
              type="text"
              placeholder=""
              value={props.feeData?.unit_price}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel controlId="feeUnit" label="Đơn vị" className="mb-3">
            <Form.Control
              required
              name="feeUnit"
              type="text"
              placeholder=""
              value={props.feeData?.unit}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="totalPrice"
            label="Thành tiền"
            className="mb-3"
          >
            <Form.Control
              required
              name="totalPrice"
              type="text"
              placeholder=""
              value={props.totalPrice}
              readOnly
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FeeDisplay;
