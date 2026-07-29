import AuthLayout from "../../layouts/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import LoginForm from "../../components/auth/LoginForm";

export default function DoctorLogin() {
  return (
    <AuthLayout>

      <AuthHeader
        title="Doctor Login"
        subtitle="Access the MastiskhNet Doctor Portal"
      />

      <LoginForm role="Doctor" />

    </AuthLayout>
  );
}