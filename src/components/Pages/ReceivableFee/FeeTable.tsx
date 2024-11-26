import { Accordion, Button, Modal } from 'react-bootstrap';
import { Space, Input } from 'antd';
import { useState } from 'react';
import FeeForm from './FeeForm';
import { Fee } from '../../../interface/interface';

const { Search } = Input;

const FeeTable = (props: any) => {
  const [addShow, setAddShow] = useState(false);
  const handleAddFormClose = () => setAddShow(false);
  const handleAddFormShow = () => setAddShow(true);

  const [editShow, setEditShow] = useState(false);
  const handleEditFormClose = () => setEditShow(false);
  const [targetData, setTargetData] = useState({});

  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = (index: number) => {
    setDeleteShow(true);
    setTargetData(props.rowData[index]);
  };

  const handleEditFormShow = (index: number) => {
    setEditShow(true);
    setTargetData(props.rowData[index]);
  };

  return (
    <>
      <Accordion.Item eventKey={props.eventKey}>
        <Accordion.Header>{props.tableName}</Accordion.Header>
        <Accordion.Body>
          <Space direction="horizontal">
            <Search
              placeholder="Tìm kiếm theo tên khoản..."
              allowClear
              size="large"
              style={{ width: 300, height: 52, fontSize: 18 }}
            />
            <Button variant="primary" onClick={handleAddFormShow}>
              {props.addDataName}
            </Button>
          </Space>
          <table className="table table-hover">
            <thead>
              <tr>
                {props.theadTitle.map((title: string) => (
                  <th scope="col">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!props.loading ? (
                props.rowData.length == 0 ? (
                  <tr>
                    <td
                      colSpan={props.theadTitle.length}
                      style={{ textAlign: 'center' }}
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  props.rowData.map((data: any, index: number) => (
                    <tr style={{ transform: 'rotate(0)' }}>
                      <th scope="row">
                        {/* <a href="#" className="stretched-link">
                          {index + 1}
                        </a> */}
                        {index + 1}
                      </th>
                      {Object.values(data).map(
                        (item: any, index: number) =>
                          index != 0 && <td>{item}</td>,
                      )}
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => {
                            handleEditFormShow(index);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            handleDeleteShow(index);
                          }}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={props.theadTitle.length}
                    style={{ textAlign: 'center' }}
                  >
                    Đang tải dữ liệu, vui lòng đợi...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Accordion.Body>
      </Accordion.Item>
      <FeeForm
        show={addShow}
        handleClose={handleAddFormClose}
        title={props.addDataName}
        onSubmit={(data: Fee) => {
          props.onSubmit(data, 'add');
          handleAddFormClose();
        }}
        submitText="Thêm"
        triggerReload={props.triggerReload}
      />
      <FeeForm
        show={editShow}
        handleClose={handleEditFormClose}
        title={props.editDataName}
        onSubmit={(data: Fee) => {
          props.onSubmit(data, 'edit', targetData.fee_id);
          handleEditFormClose();
        }}
        data={targetData}
        submitText="Sửa"
        triggerReload={props.triggerReload}
      />
      <Modal show={deleteShow} backdrop="static">
        <Modal.Header>
          <Modal.Title>Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có muốn xóa khoản thu này không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Đóng
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await props.onSubmit({}, 'delete', targetData.fee_id);
              handleDeleteClose();
              setTimeout(() => {
                props.triggerReload();
              }, 500);
            }}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FeeTable;