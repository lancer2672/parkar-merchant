import { Button, Col, Form, Input, Row, notification } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

interface IProps {
  id: string | undefined;
  handleClose: Function;
}

const AddBlock = (props: IProps) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    form.resetFields();
    if (props.id) {
      fetch(`http://localhost:3001/block/get-one/${props.id}`, {
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
          const tmp = res.data;
          form.setFieldsValue({
            code: tmp.code,
            slot: tmp.slot,
            description: tmp.description,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.id]);

  const handleSubmit = () => {
    let { code, slot, description } = form.getFieldsValue();

    if (props.id) {
      fetch(`http://localhost:3001/block/update/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          slot: parseInt(slot),
          description,
          parking_lot_id: id,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then((res) => {
          console.log(res.data);
          notification.success({ message: "success" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(`http://localhost:3001/block/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          slot: parseInt(slot),
          description,
          parking_lot_id: id,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then((res) => {
          console.log(res.data);
          notification.success({ message: "success" });
        })
        .catch((error) => {
          console.log(error);
        });
      form.resetFields();
      props.handleClose();
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[20, 0]}>
          <Col span={12}>
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: "Please input code block!" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Number of slot"
              name="slot"
              rules={[{ required: true, message: "Please input slot!" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Description" name="description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" size="large" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBlock;
