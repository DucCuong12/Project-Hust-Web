import { Space, Input } from 'antd';
import { Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/esm/Accordion';

const { Search } = Input;

const CompulsoryFee = () => {
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>Khoản thu bắt buộc</Accordion.Header>
      <Accordion.Body>
        <Space direction="horizontal">
          <Search
            placeholder="input search text"
            allowClear
            style={{ width: 200 }}
          />
          <Button variant="primary">Tạo khoản bắt buộc mới</Button>
        </Space>
        <table className="table table-hover">
          <tbody>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tr style={{ transform: 'rotate(0)' }}>
              <th scope="row">
                <a href="#" className="stretched-link">
                  1
                </a>
              </th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default CompulsoryFee;
