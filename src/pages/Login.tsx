// src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login as apiLogin } from '../services/api';
import { useAuthStore, type AuthState } from '../store/authStore';

// Validasyon şeması
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta zorunludur')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state: AuthState) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await apiLogin(data.email, data.password);

      // Zustand auth state
      setAuth(response.token, response.role);

      // LocalStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ email: data.email, role: response.role }),
      );

      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Giriş hatası:', error);
      alert('Giriş başarısız! Email ve şifreyi kontrol edin (şifre: 123456).');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Yönetim Paneli</h2>
          <p className="text-gray-500 text-sm">Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="admin@crudfab.com"
              className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition
                ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="******"
              className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition
                ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Kontrol Ediliyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
          <p className="font-semibold mb-1">💡 Demo Bilgisi:</p>
          <p>E-posta: istediğin adres</p>
          <p>
            Şifre: <b>123456</b>
          </p>
        </div>
      </div>
    </div>
  );
}
