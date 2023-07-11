import AddBlock from "@/components/AddBlock";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Popconfirm, Row, Table, Tooltip, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
interface IProps {
  idParkingLot: string;
}
const BlockDetails = (props: IProps) => {
  const [data, setData] = useState<Array<Block>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [idBlock, setIdBlock] = useState<string>();

  const columns: ColumnsType<Block> = [
    {
      title: "Block code",
      dataIndex: "code",
      align: "center",
    },
    {
      title: "Number of slots",
      dataIndex: "slot",
      align: "center",
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
                  setIdBlock(id);
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
    fetch(`http://localhost:3001/block/get-list?parking_lot_id=${props.idParkingLot}`, {
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
        console.log(res.data);
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleDelete = (id: any) => {
    fetch(`http://localhost:3001/block/delete/${id}`, {
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
  };

  return (
    <Row gutter={[20, 20]}>
      <Col span={8}>
        <h3 className=" text-xl">Blocks</h3>
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
          <Table<Block>
            bordered
            columns={columns}
            dataSource={data}
            loading={isLoading}
            rowKey={(row) => row.id}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Col>
      <Modal
        title={idBlock ? "Update block" : "Add block"}
        centered
        closable
        visible={isVisible}
        footer={null}
        onCancel={() => setIsVisible(false)}>
        <AddBlock handleClose={handleClose} id={idBlock} />
      </Modal>
    </Row>
  );
};

export default BlockDetails;
