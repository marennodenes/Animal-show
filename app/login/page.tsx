import LoginForm from '@/components/LogInPage/LogInForm';

export default function LoginPage() {
  return (
    <div className="auth-pattern-bg flex min-h-screen items-center justify-center px-4">
      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </div>
  );
}

