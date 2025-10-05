import AuthForm from "@/components/AuthForm"

export const dynamic = 'force-dynamic'

const registrationPage = () => {
  return (
    <AuthForm useAs="register" />
  )
}

export default registrationPage