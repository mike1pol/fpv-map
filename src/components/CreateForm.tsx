import React from "react";
import { Form, Input, Button, InputNumber } from "antd";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "${label} обязательно!",
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    number: "${label} is not a valid number!",
  },
};

export type FormValues = {
  name: string;
  lat: number;
  lng: number;
  description: string;
};

export type CreateFormProps = {
  onSubmit: (values: FormValues) => void;
};

export const CreateForm: React.FC<CreateFormProps> = ({ onSubmit }) => {
  const onFinish = (values: FormValues) => {
    onSubmit(values);
  };
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item name={"name"} label="Название" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"lat"}
        label="Latitude"
        rules={[{ type: "number", required: true }]}
      >
        <InputNumber style={{ width: "200px" }} />
      </Form.Item>
      <Form.Item
        name={"lng"}
        label="Longitude"
        rules={[{ type: "number", required: true }]}
      >
        <InputNumber style={{ width: "200px" }} />
      </Form.Item>
      <Form.Item name={"description"} label="Описание">
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
