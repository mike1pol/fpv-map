import React, { useContext, useState } from "react";
import { Form, Input, Button, InputNumber, FormInstance, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { UserContext } from "../userContext";
import { ModalMap } from "./ModalMap";

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
  is_active: boolean;
  links: string[];
};

export type CreateFormProps = {
  form: FormInstance;
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
const formStorageKey = "create_form";

export const CreateForm: React.FC<CreateFormProps> = ({ onSubmit, form }) => {
  const user = useContext(UserContext);
  const [mapModalVisible, setMapModalVisible] = useState<boolean>(false);
  const formStorage = localStorage.getItem(formStorageKey);
  const defaultValues = {
    name: "",
    description: "",
    lat: null,
    lng: null,
    is_active: false,
    links: [],
  };
  const formInitValues: FormValues | undefined = formStorage
    ? JSON.parse(formStorage)
    : defaultValues;
  const onChange = () => {
    const values = form.getFieldsValue();
    localStorage.setItem(formStorageKey, JSON.stringify(values));
  };
  const onFinish = (values: FormValues) => {
    onSubmit(values);
  };
  return (
    <>
      <ModalMap
        visible={mapModalVisible}
        onClose={(lat, lng) => {
          form.setFieldsValue({ lat, lng });
          setMapModalVisible(false);
        }}
      />
      <Form
        form={form}
        {...formItemLayoutWithOutLabel}
        name="nest-messages"
        onFinish={onFinish}
        onChange={onChange}
        initialValues={formInitValues}
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
        <Form.Item {...formItemLayout} label="Координаты">
          <Input.Group>
            <Form.Item
              {...formItemLayout}
              name={"lat"}
              label="Широта"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber style={{ width: "200px" }} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name={"lng"}
              label="Долгота"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber style={{ width: "200px" }} />
            </Form.Item>
          </Input.Group>
          <Button onClick={() => setMapModalVisible(true)}>
            Выбрать на карте
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayout} name={"description"} label="Описание">
          <Input.TextArea />
        </Form.Item>
        {user && (user.isAdmin || user.isModer) && (
          <Form.Item
            {...formItemLayout}
            name={"is_active"}
            valuePropName={"checked"}
            label="Включен?"
          >
            <Switch />
          </Form.Item>
        )}
        <Form.List name={"links"}>
          {(fields, { add, remove }) => (
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
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button
            style={{ marginRight: "12px" }}
            type="primary"
            htmlType="submit"
          >
            Отправить
          </Button>
          <Button
            type="ghost"
            onClick={() => {
              localStorage.removeItem(formStorageKey);
              form.setFieldsValue(defaultValues);
            }}
          >
            Очистить
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
