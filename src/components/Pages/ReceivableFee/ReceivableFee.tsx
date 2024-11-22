import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import UILayout from '../../../../utils/UILayout';
import FeeTable from './FeeTable';

// const navigate = useNavigate();

const fetchData = async (data: any) => {
  // do something
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
};

const ReceivableFee = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData([])
      .then((data: any) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UILayout title="Khoản thu">
      <Accordion alwaysOpen>
        <FeeTable
          eventKey="0"
          tableName="Khoản thu bắt buộc"
          addButtonName="Tạo khoản bắt buộc mới"
          rowData={data}
          loading={loading}
          theadTitle={['STT', 'Tên khoản thu', 'Mô tả', 'Số tiền', 'Hành động']}
        />
        <FeeTable
          eventKey="1"
          tableName="Khoản đóng góp"
          addButtonName="Tạo khoản đóng góp mới"
          rowData={data}
          loading={loading}
          theadTitle={[
            'STT',
            'Tên khoản đóng góp',
            'Tổng số tiền đã đóng góp',
            'Hành động',
          ]}
        />
      </Accordion>
    </UILayout>
  );
};

export default ReceivableFee;
