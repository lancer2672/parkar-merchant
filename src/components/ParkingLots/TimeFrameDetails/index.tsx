import AddTimeframe from "@/components/AddTimeframe";
import { parseThousand } from "@/utils/stringHelper";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Popconfirm, Row, Table, Tooltip, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

interface IProps {
  idParkingLot: string;
}

const TimeFrameDetails = (props: IProps) => {
  const [data, setData] = useState<Array<TimeFrame>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [idTime, setIdTime] = useState<string>();

  const columns: ColumnsType<TimeFrame> = [
    {
      title: "Duration (minute)",
      dataIndex: "duration",
      align: "center",
    },
    {
      title: "Cost (VND)",
      dataIndex: "cost",
      align: "center",
      render: (cost: any) => parseThousand(cost),
    },
    {
      title: "",
      dataIndex: "id",
      align: "center",
      width: "10%",
      render: (id: string) => {
        return (
          <div className="flex gap-2.5 justify-start flex-col md:flex-row">
            <Tooltip title="Edit">
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsVisible(true);
                  setIdTime(id);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                okText="Yes"
                cancelText="No"
                title="Are you sure to delete?"
                onConfirm={() => handleDelete(id)}>
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAPI();
  }, [isVisible]);

  const fetchAPI = () => {
    fetch(`http://localhost:3001/time-frame/get-all?parkingLotId=${props.idParkingLot}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((res) => {
        // console.log(res.data?.data);
        setData(res.data?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleDelete = (id: any) => {
    fetch(`http://localhost:3001/time-frame/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((res) => {
        console.log(res.data);
        notification.success({ message: "Success" });
      })
      .catch((error) => {
        console.log(error);
      });
    fetchAPI();
  };

  const handleClose = () => {
    setIsVisible(false);
    setIdTime(undefined);
  };

  return (
    <Row gutter={[20, 20]}>
      <Col span={8}>
        <h3 className=" text-xl">Time frames</h3>
      </Col>
      <Col flex="auto" />
      <Col span={8}>
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            setIsVisible(true);
          }}>
          Add
        </Button>
      </Col>
      <Col span={24}>
        <Card>
          <Table<TimeFrame>
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={data}
            rowKey={(row) => row.id}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Col>
      <Modal
        title={idTime ? "Update time frame" : "Add time frame"}
        centered
        afterClose={() => fetchAPI()}
        closable
        visible={isVisible}
        footer={null}
        onCancel={() => setIsVisible(false)}>
        <AddTimeframe handleClose={handleClose} id={idTime} />
      </Modal>
    </Row>
  );
};

export default TimeFrameDetails;
