import RegisterForm from '@/components/LogInPage/RegisterUser';

export default function RegisterPage() {
  return (
    <div className="auth-pattern-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
