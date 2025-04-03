import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";

const Register = () => {
    const onFinish = async (values) => {
        console.log("Form submitted:", values);
        try {
            const { name, email, password } = values;

            if (!name || !email || !password) {
                console.log("All fields are required!");
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                { name, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            console.log("Registration successful:", response.data);
            alert("Registration successful! 🎉");

        } catch (error) {
            if (error.response) {
                console.error("Response error:", error.response.data);
                alert(`Error: ${error.response.data.message}`);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Server is not responding. Check if it's running.");
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Form validation failed:", errorInfo);
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2>Register</h2>
            <Form
                name="register"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email!" },
                        { type: "email", message: "Enter a valid email!" }
                    ]}
                >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Register
                </Button>
            </Form.Item>
        </Form>
        </div >
    );
};

export default Register;