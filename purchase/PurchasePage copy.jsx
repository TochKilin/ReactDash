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
  const [validate, setValidate] = useState({});
  const [filter, setFilter] = useState({ text_search: null, status: null });

  // supplier + products for purchase items
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
    setState((p) => ({ ...p, open: true }));
    setItems([]); // reset items
  };

  const handleCloseModal = () => {
    setState((p) => ({ ...p, open: false }));
    formRef.resetFields();
    setItems([]);
    setValidate({});
  };

  // Add product to purchase items
  const addItem = (product) => {
    const exists = items.find((i) => i.product_id === product.id);
    if (exists) return message.warning("Product already added");

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

  // Update quantity
  const updateQty = (index, qty) => {
    const data = [...items];
    data[index].qty = qty;
    setItems(data);
  };

  const updatePrice = (index, price) => {
    const data = [...items];
    data[index].price = price;
    setItems(data);
  };

  const onFinish = async (item) => {
    if (items.length === 0)
      return message.error("Please add at least 1 product");

    const total_amount = items.reduce((t, i) => t + i.qty * i.price, 0);

    const payload = {
      supplier_id: item.supplier_id,
      // purchase_date: item.purchase_date,
      purchase_date: item.purchase_date.format("YYYY-MM-DD HH:mm:ss"), // <-- format here
      status: item.status,
      total_amount,
      items,
    };

    setState((p) => ({ ...p, loading: true }));
    const res = await request("purchases", "post", payload);

    if (res && !res.errors) {
      message.success("Purchase saved");
      handleCloseModal();
      getList();
    } else {
      setState((p) => ({ ...p, loading: false }));
      setValidate(res.errors);
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="main-page-header">
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
          <Button onClick={() => setFilter({ text_search: null })}>
            Reset
          </Button>
        </Space>

        <Button type="primary" onClick={handleOpenModal}>
          New Purchase
        </Button>

        {/* MODAL */}
        <Modal
          title="New Purchase"
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
          width={900}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name="supplier_id"
              label="Supplier"
              {...validate.supplier_id}
              rules={[{ required: true, message: "Select supplier" }]}
            >
              <Select
                placeholder="Select Supplier"
                options={suppliers.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="purchase_date"
              label="Purchase Date"
              rules={[{ required: true, message: "Select date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
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

            {/* PRODUCT TABLE */}
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
                {
                  title: "Total",
                  render: (r) => <b>{r.qty * r.price}</b>,
                },
              ]}
            />

            <div style={{ textAlign: "right", marginTop: 20 }}>
              <Space>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save Purchase
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
            { key: "date", title: "Date", dataIndex: "purchase_date" },
            { key: "amount", title: "Total", dataIndex: "total_amount" },
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
          ]}
        />
      </div>
    </MainPage>
  );
}

export default PurchasePage;
