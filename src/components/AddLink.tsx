import React from "react";

import { Button, Form, Input, Modal } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export type AddLinkProps = {
  onSubmit: (link: string[]) => void;
  onCancel: () => void;
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

export const AddLink: React.FC<AddLinkProps> = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
    // onSubmit("");
  };
  const onFinish = (values: { links: string[] }) => {
    onSubmit(values.links);
  };
  return (
    <Modal title="Basic Modal" visible onOk={handleOk} onCancel={onCancel}>
      <Form form={form} onFinish={onFinish}>
        <Form.List name={"links"}>
          {(fields, { add, remove }, errors) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "Видео/Фото" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        type: "url",
                        required: true,
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
                  Добавить видео/фото
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
