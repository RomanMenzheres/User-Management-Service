import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  useEffect(() => {
    if (isEditModalOpen && editingUser) {
      form.setFieldsValue({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
      });
    }
  }, [isEditModalOpen, editingUser, form]);

  const fetchUsers = async (page, pageSize) => {
    setLoading(true);
    axios.get('http://localhost:8081/users', {
        params: {
        page: page - 1,
        size: pageSize
    }
    })
    .then((res) => { 
        setUsers(res.data.content);
        setPagination({
            ...pagination,
            current: page,
            total: res.data.totalElements,
          });
        setLoading(false);
    })
    .catch(function (error) {
        console.error("Failed to get record count", error);
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    axios.delete(`http://localhost:8081/users/${userId}`)
    .then(() => { 
        const newTotal = pagination.total - 1; 
      const newPage = pagination.current;

      if (users.length === 1 && pagination.current > 1) {
        fetchUsers(newPage - 1, pagination.pageSize);
      } else {
        fetchUsers(newPage, pagination.pageSize);
      }

      setPagination({
        ...pagination,
        total: newTotal,
      });
    })
    .catch(function (error) {
        console.error("Failed to delete record", error);
    });
  };

  const showAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleAddUser = async (values) => {
      axios.post('http://localhost:8081/users', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      })
      .then((res) => {
        fetchUsers(pagination.current, pagination.pageSize);
        setIsAddModalOpen(false);
        form.resetFields();
      })
      .catch(function (error) {
        console.error("Failed to delete record", error);
        form.setFields([
            {
              name: 'email',
              errors: [error.response.data.error],
            },
          ]);
      });
  };

  const handleEditUser = async (values) => {
      axios.put(`http://localhost:8081/users/${editingUser.id}`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      })
      .then((res) => {
        const updatedUsers = users.map(user =>
            user.id === editingUser.id
              ? res.data
              : user
          );
          setUsers(updatedUsers);
          setIsEditModalOpen(false);
          form.resetFields();
      })
      .catch(function (error) {
        console.error("Failed to update record", error);
        form.setFields([
            {
              name: 'email',
              errors: [error.response.data.error],
            },
          ]);
      });
  };

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
        title: 'Name',
        key: 'name',
        render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, float: 'right' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Create User
        </Button>
      </div>

      <Table loading={loading} 
            dataSource={users}
            pagination={pagination}
            onChange={handleTableChange}
            columns={columns} 
            rowKey="id" 
        />

      <Modal 
        title="CREATE NEW USER" 
        open={isAddModalOpen} 
        onCancel={handleCancel} 
        footer={null}
        style={{ textAlign: 'center' }}
      >
        <Form layout={'vertical'} requiredMark={false} form={form} onFinish={handleAddUser} style={{ maxWidth: '400px', margin: '0 auto'}}>
          <Form.Item 
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input the first name!' },
                { min: 2, message: 'First name must be at least 2 characters long!' },
                { max: 255, message: 'First name cannot be more than 255 characters long!' }]}
          >
            <Input placeholder='First Name'/>
          </Form.Item>
          <Form.Item 
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input the last name!' },
                { min: 2, message: 'First name must be at least 2 characters long!' },
                { max: 255, message: 'First name cannot be more than 255 characters long!' }]}
          >
            <Input placeholder='Last Name'/>
          </Form.Item>
          <Form.Item 
            name="email"
            label="Email" 
            rules={[{ required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input placeholder='Email'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal 
        title="UPDATE USER" 
        open={isEditModalOpen} 
        onCancel={handleCancel} 
        footer={null}
        style={{ textAlign: 'center' }}
      >
        <Form layout={'vertical'} requiredMark={false} form={form} onFinish={handleEditUser} style={{ maxWidth: '400px', margin: '0 auto'}}>
          <Form.Item 
            name="firstName" 
            label="Last Name"
            rules={[{ required: true, message: 'Please input the first name!' },
                { min: 2, message: 'First name must be at least 2 characters long!' },
                { max: 255, message: 'First name cannot be more than 255 characters long!' }]}
            className="form-item"
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input the last name!' },
                { min: 2, message: 'First name must be at least 2 characters long!' },
                { max: 255, message: 'First name cannot be more than 255 characters long!' }]}
            className="form-item"
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please input a valid email!' }]}
            className="form-item"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UserTable;