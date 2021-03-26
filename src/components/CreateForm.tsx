import React from "react";
import { Form, Input, Button, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

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
  video: string[];
};

export type CreateFormProps = {
  onSubmit: (values: FormValues) => void;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

export const CreateForm: React.FC<CreateFormProps> = ({ onSubmit }) => {
  const onFinish = (values: FormValues) => {
    onSubmit(values);
  };
  return (
    <Form
      {...formItemLayoutWithOutLabel}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item
        {...formItemLayout}
        name={"name"}
        label="Название"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name={"lat"}
        label="Latitude"
        rules={[{ type: "number", required: true }]}
      >
        <InputNumber style={{ width: "200px" }} />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name={"lng"}
        label="Longitude"
        rules={[{ type: "number", required: true }]}
      >
        <InputNumber style={{ width: "200px" }} />
      </Form.Item>
      <Form.Item {...formItemLayout} name={"description"} label="Описание">
        <Input.TextArea />
      </Form.Item>
      <Form.List name={"video"}>
        {(fields, { add, remove }, errors) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? "Видео" : ""}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      type: "url",
                      whitespace: true,
                      message: "Тут должна быть ссылка",
                    },
                  ]}
                  noStyle
                >
                  <Input style={{ width: "60%" }} />
                </Form.Item>
                {fields.length > 0 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "40%" }}
                icon={<PlusOutlined />}
              >
                Добавить видео
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
