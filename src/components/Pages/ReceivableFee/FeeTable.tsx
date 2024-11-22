import { Accordion, Button } from 'react-bootstrap';
import { Space, Input } from 'antd';

const { Search } = Input;

const FeeTable = (props: any) => {
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.tableName}</Accordion.Header>
      <Accordion.Body>
        <Space direction="horizontal">
          <Search
            placeholder="input search text"
            allowClear
            style={{ width: 200 }}
          />
          <Button variant="primary">{props.addButtonName}</Button>
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
                      <a href="#" className="stretched-link">
                        {index + 1}
                      </a>
                    </th>
                    {data.map((item: any) => (
                      <td>{item}</td>
                    ))}
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
  );
};

export default FeeTable;
