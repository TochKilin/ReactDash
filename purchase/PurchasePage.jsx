import React, { useEffect, useState } from "react";
import {
  Space,
  Input,
  Button,
  Table,
  message,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Tag,
} from "antd";
import dayjs from "dayjs";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../utill/request";

function PurchasePage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  const [filter, setFilter] = useState({ text_search: null, status: null });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadSuppliers();
    loadProducts();
    getList();
  }, []);

  const loadSuppliers = async () => {
    const res = await request("suppliers", "get");
    if (res && !res.errors) setSuppliers(res.list);
  };

  const loadProducts = async () => {
    const res = await request("products", "get");
    if (res && !res.errors) setProducts(res.list);
  };

  const getList = async (params = {}) => {
    const query = new URLSearchParams({
      page: 1,
      text_search: params.text_search || filter.text_search || "",
      status: params.status || filter.status || "",
    }).toString();
    setState((p) => ({ ...p, loading: true }));
    const res = await request(`purchases?${query}`, "get");
    if (res && !res.errors) {
      setState((p) => ({
        ...p,
        list: res.list,
        total: res.total,
        loading: false,
      }));
    } else {
      setState((p) => ({ ...p, loading: false }));
      if (res.errors?.message) message.error(res.errors.message);
    }
  };

  const handleOpenModal = () => {
    formRef.resetFields();
    setItems([]);
    setState((p) => ({ ...p, open: true }));
  };

  const handleCloseModal = () => {
    formRef.resetFields();
    setItems([]);
    setState((p) => ({ ...p, open: false }));
  };

  const addItem = (product) => {
    if (items.find((i) => i.product_id === product.id))
      return message.warning("Product already added");
    setItems([
      ...items,
      {
        product_id: product.id,
        name: product.product_name,
        qty: 1,
        price: product.price,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateQty = (index, qty) => {
    const newItems = [...items];
    newItems[index].qty = qty;
    setItems(newItems);
  };

  const updatePrice = (index, price) => {
    const newItems = [...items];
    newItems[index].price = price;
    setItems(newItems);
  };

  const handleEdit = (record) => {
    formRef.setFieldsValue({
      supplier_id: record.supplier_id,
      purchase_date: record.purchase_date ? dayjs(record.purchase_date) : null,
      status: record.status,
      id: record.id,
    });

    setItems(
      record.items?.map((i) => ({
        product_id: i.product_id,
        name: i.product?.product_name || "",
        qty: i.quantity,
        price: i.unit_price,
      })) || []
    );

    setState((p) => ({ ...p, open: true }));
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Purchase",
      content: "Are you sure you want to delete this purchase?",
      onOk: async () => {
        setState((p) => ({ ...p, loading: true }));
        const res = await request(`purchases/${record.id}`, "delete");
        if (res && !res.errors) {
          message.success("Deleted successfully");
          getList();
        } else {
          setState((p) => ({ ...p, loading: false }));
        }
      },
    });
  };

  const onFinish = async (values) => {
    if (items.length === 0)
      return message.error("Please add at least 1 product");
    const total_amount = items.reduce((sum, i) => sum + i.qty * i.price, 0);

    const payload = {
      supplier_id: values.supplier_id,
      purchase_date: values.purchase_date
        ? dayjs(values.purchase_date).format("YYYY-MM-DD HH:mm:ss")
        : null,
      status: values.status ?? 1,
      total_amount,
      items,
    };

    const isEdit = !!values.id;
    const url = isEdit ? `purchases/${values.id}` : "purchases";
    const method = isEdit ? "put" : "post";

    setState((p) => ({ ...p, loading: true }));
    const res = await request(url, method, payload);
    if (res && !res.errors) {
      message.success(isEdit ? "Purchase updated" : "Purchase saved");
      handleCloseModal();
      getList();
    } else {
      setState((p) => ({ ...p, loading: false }));
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="main-page-header" style={{ marginBottom: 20 }}>
        <Space>
          <div>Purchase {state.total}</div>
          <Input.Search
            value={filter.text_search}
            onChange={(e) =>
              setFilter((p) => ({ ...p, text_search: e.target.value }))
            }
            allowClear
            placeholder="Search"
          />
          <Button onClick={() => getList(filter)}>Filter</Button>
          <Button
            onClick={() => {
              setFilter({ text_search: null });
              getList({});
            }}
          >
            Reset
          </Button>
        </Space>
        <Button type="primary" onClick={handleOpenModal}>
          New Purchase
        </Button>
      </div>

      <Modal
        title={formRef.getFieldValue("id") ? "Edit Purchase" : "New Purchase"}
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            name="supplier_id"
            label="Supplier"
            rules={[{ required: true, message: "Select supplier" }]}
          >
            <Select
              placeholder="Select Supplier"
              options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            />
          </Form.Item>

          <Form.Item
            name="purchase_date"
            label="Purchase Date"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: 1, label: "Active" },
                { value: 0, label: "Inactive" },
              ]}
            />
          </Form.Item>

          <hr />
          <h3>Add Products</h3>
          <Table
            dataSource={products}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Product", dataIndex: "product_name" },
              { title: "Price", dataIndex: "price" },
              {
                title: "Action",
                render: (product) => (
                  <Button onClick={() => addItem(product)}>Add</Button>
                ),
              },
            ]}
          />

          <h3>Purchase Items</h3>
          <Table
            dataSource={items}
            pagination={false}
            rowKey={(r, i) => i}
            columns={[
              { title: "Product", dataIndex: "name" },
              {
                title: "Qty",
                render: (r, _, i) => (
                  <InputNumber
                    min={1}
                    value={r.qty}
                    onChange={(v) => updateQty(i, v)}
                  />
                ),
              },
              {
                title: "Price",
                render: (r, _, i) => (
                  <InputNumber
                    min={0}
                    value={r.price}
                    onChange={(v) => updatePrice(i, v)}
                  />
                ),
              },
              { title: "Total", render: (r) => r.qty * r.price },
              {
                title: "Action",
                render: (_, __, i) => (
                  <Button danger onClick={() => removeItem(i)}>
                    Remove
                  </Button>
                ),
              },
            ]}
          />

          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {formRef.getFieldValue("id")
                  ? "Update Purchase"
                  : "Save Purchase"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <Table
        rowKey="id"
        dataSource={state.list}
        columns={[
          {
            key: "supplier",
            title: "Supplier",
            dataIndex: ["supplier", "name"],
          },
          {
            key: "product",
            title: "Product",
            render: (_, record) =>
              record.items && record.items.length > 0
                ? record.items.map((i) => i.product.product_name).join(", ")
                : "No product",
          },

          {
            key: "quantity",
            title: "Quantity",
            render: (_, record) => (
              <div className="font-bold text-red-500">
                {record.items && record.items.length > 0
                  ? record.items.map((i) => i.quantity).join(", ")
                  : "No products"}
              </div>
            ),
          },

          { key: "date", title: "Date", dataIndex: "purchase_date" },
          {
            key: "amount",
            title: "Total",
            dataIndex: "total_amount",
            render: (text) => (
              <span style={{ color: "green", fontWeight: "bold" }}>
                ${text.toLocaleString()}
              </span>
            ),
          },

          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (v) =>
              v === 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              ),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (_, record) => (
              <Space>
                <Button type="primary" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(record)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default PurchasePage;
