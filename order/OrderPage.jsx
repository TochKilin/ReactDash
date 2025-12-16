import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Select, message } from "antd";
import { request } from "../../utill/request";
import dayjs from "dayjs";

const { Option } = Select;

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // Fetch Orders
  const loadOrders = async () => {
    setLoading(true);
    const res = await request("orders", "get");
    setLoading(false);
    if (res && !res.errors) {
      setOrders(res || []);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Cancel Order
  const handleCancelOrder = async (id) => {
    const res = await request(`orders/${id}/cancel`, "put");
    if (res && !res.errors) {
      message.success("Order cancelled!");
      loadOrders();
    } else {
      message.error("Failed to cancel order!");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Invoice",
      dataIndex: "invoice_no",
      key: "invoice_no",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (text) => `$${text}`,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text) => `$${text}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `$${text}`,
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "5px",
            border: `1px solid ${status === 1 ? "green" : "red"}`,
            color: status === 1 ? "green" : "red",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {status === 1 ? "Paid" : "Cancelled"}
        </span>
      ),
    },

    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="danger"
          disabled={record.status === 0}
          onClick={() => handleCancelOrder(record.id)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  // Filter orders by search
  const filteredOrders = orders.filter((o) =>
    o.invoice_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* Create Order Modal */}
    </div>
  );
}

export default OrderPage;
