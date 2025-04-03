import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        console.log("Form submitted:", values);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/forgot-password",
                { email: values.email },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            console.log("Email sent:", response.data);
            message.success("Password reset link sent to your email!");

        } catch (error) {
            if (error.response) {
                console.error("Response error:", error.response.data);
                message.error(`Error: ${error.response.data.message}`);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                message.error("Server is not responding. Check if it's running.");
            } else {
                console.error("Axios error:", error.message);
            }
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2>Forgot Password</h2>
            <Form
                name="forgot-password"
                layout="vertical"
                onFinish={onFinish}
            >
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

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Send Reset Link
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPassword;
