import LoginForm from '@/components/LogInPage/LogInForm';

export default function LoginPage() {
  return (
    <div className="auth-pattern-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}


