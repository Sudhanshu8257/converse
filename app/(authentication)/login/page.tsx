import AuthForm from "@/components/AuthForm";
import React from "react";

export const dynamic = 'force-dynamic'

const loginPage = () => {
  return <AuthForm useAs="login" />;
};

export default loginPage;
