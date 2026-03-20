import { Check, X, Shield } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength = passedChecks === 0 ? 0 : passedChecks <= 2 ? 1 : passedChecks <= 4 ? 2 : 3;

  const getStrengthLabel = () => {
    if (strength === 0) return { text: 'Chưa nhập', color: 'text-gray-400' };
    if (strength === 1) return { text: 'Yếu', color: 'text-red-500' };
    if (strength === 2) return { text: 'Trung bình', color: 'text-orange-500' };
    return { text: 'Mạnh', color: 'text-green-500' };
  };

  const getStrengthBarColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const strengthLabel = getStrengthLabel();

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Độ mạnh mật khẩu:</span>
            <span className={`font-semibold ${strengthLabel.color}`}>
              {strengthLabel.text}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full transition-all ${
                  level <= strength ? getStrengthBarColor() : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Requirements checklist */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Yêu cầu mật khẩu:</p>
        <div className="space-y-1.5">
          <PasswordRequirement
            met={checks.length}
            text="Tối thiểu 8 ký tự"
          />
          <PasswordRequirement
            met={checks.uppercase}
            text="Ít nhất 1 chữ hoa (A-Z)"
          />
          <PasswordRequirement
            met={checks.lowercase}
            text="Ít nhất 1 chữ thường (a-z)"
          />
          <PasswordRequirement
            met={checks.number}
            text="Ít nhất 1 chữ số (0-9)"
          />
          <PasswordRequirement
            met={checks.special}
            text="Ít nhất 1 ký tự đặc biệt (!@#$%...)"
          />
        </div>
      </div>
    </div>
  );
}

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={met ? 'text-green-700' : 'text-gray-500'}>{text}</span>
    </div>
  );
}
