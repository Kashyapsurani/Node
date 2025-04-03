import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button } from "antd";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ Get token from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { password } = values;
      // Send newPassword instead of password
      const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        { token, newPassword: password },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Password reset successful! ✅");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Try again!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Reset Password</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="New Password" name="password" rules={[{ required: true, message: "Enter a new password!" }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
