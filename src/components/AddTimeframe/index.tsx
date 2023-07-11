import { Button, Form, Input, InputNumber, notification } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface IProps {
  id: string | undefined;
  handleClose: Function;
}

const AddTimeframe = (props: IProps) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    form.resetFields();
    console.log(props.id);
    if (props.id) {
      fetch(`http://localhost:3001/time-frame/get-one/${props.id}`, {
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
          console.log(res.data.cost);
          const tmp = res.data;
          form.setFieldsValue({
            duration: tmp.duration,
            cost: tmp.cost,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.id]);

  const handleSubmit = () => {
    let { duration, cost } = form.getFieldsValue();

    if (props.id) {
      fetch(`http://localhost:3001/time-frame/update/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: parseInt(duration),
          cost: parseFloat(cost),
          parkingLotId: id,
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
      fetch(`http://localhost:3001/time-frame/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: parseInt(duration),
          cost: parseFloat(cost),
          parkingLotId: id,
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
    }
    form.resetFields();
    props.handleClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Duration"
        name="duration"
        rules={[{ required: true, message: "Please input duration!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Cost"
        name="cost"
        rules={[{ required: true, message: "Please input cost!" }]}>
        <InputNumber
          min={0}
          className="!w-full"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" size="large" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTimeframe;
