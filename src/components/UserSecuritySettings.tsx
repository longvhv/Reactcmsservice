import { useState } from 'react';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, X, Save, Eye, EyeOff, Smartphone, Mail, Clock, Globe, UserX, Activity } from 'lucide-react';
import { PageWrapper } from './PageWrapper';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import toast from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface SecuritySession {
  id: number;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

interface UserSecuritySettingsProps {
  onNavigate?: (page: any) => void;
}

export function UserSecuritySettings({ onNavigate }: UserSecuritySettingsProps) {
  const { t } = useLanguage();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordPolicyModal, setShowPasswordPolicyModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState<SecuritySession | null>(null);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Security settings
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    emailVerification: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: '',
    blockSuspiciousLogin: true,
    notifyNewDevice: true,
    enforcePasswordPolicy: true,
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
  });

  // Active sessions
  const sessions: SecuritySession[] = [
    {
      id: 1,
      device: 'Windows Desktop',
      browser: 'Chrome 120.0',
      location: 'Hà Nội, Việt Nam',
      ipAddress: '192.168.1.100',
      lastActive: '5 phút trước',
      isCurrent: true,
    },
    {
      id: 2,
      device: 'iPhone 15 Pro',
      browser: 'Safari 17.2',
      location: 'Hà Nội, Việt Nam',
      ipAddress: '192.168.1.105',
      lastActive: '2 giờ trước',
      isCurrent: false,
    },
    {
      id: 3,
      device: 'MacBook Pro',
      browser: 'Firefox 121.0',
      location: 'TP.HCM, Việt Nam',
      ipAddress: '192.168.2.50',
      lastActive: '1 ngày trước',
      isCurrent: false,
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader
          title={t('users.security.title')}
          description={t('users.security.description')}
        />

        {/* Security Status */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${settings.twoFactorEnabled ? 'bg-green-100' : 'bg-orange-100'} rounded-xl`}>
                <Shield className={`w-6 h-6 ${settings.twoFactorEnabled ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('users.security.twoFactorAuth')}</div>
                <div className={`text-lg font-bold ${settings.twoFactorEnabled ? 'text-green-600' : 'text-orange-600'}`}>
                  {settings.twoFactorEnabled ? t('users.security.enabled') : t('users.security.disabled')}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('users.security.activeSessions')}</div>
                <div className="text-lg font-bold text-foreground">{sessions.length}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('users.security.sessionTimeout')}</div>
                <div className="text-lg font-bold text-foreground">{settings.sessionTimeout} {t('users.security.minutes')}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Two-Factor Authentication */}
        <Card>
          <h3 className="text-foreground mb-4">{t('users.security.twoFactorTitle')}</h3>
          <div className="flex items-start justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <div className="font-medium text-foreground">{t('users.security.authenticatorApp')}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('users.security.authenticatorDesc')}
              </p>
              <p className="text-xs text-muted-foreground">
                {settings.twoFactorEnabled 
                  ? t('users.security.authenticatorConfigured')
                  : t('users.security.authenticatorNotConfigured')
                }
              </p>
            </div>
            <button
              onClick={() => setShow2FAModal(true)}
              className={`px-6 py-3 ${settings.twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-xl transition-colors`}
            >
              {settings.twoFactorEnabled ? t('users.security.disable2FA') : t('users.security.enable2FA')}
            </button>
          </div>
        </Card>

        {/* Password Policy */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">{t('users.security.passwordPolicy')}</h3>
            <button
              onClick={() => setShowPasswordPolicyModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              <Key className="w-4 h-4" />
              <span>{t('users.security.configure')}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <CheckCircle className={`w-5 h-5 ${settings.enforcePasswordPolicy ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{t('users.security.enforcePasswordPolicy')}</div>
                <div className="text-xs text-muted-foreground">{t('users.security.enforcePasswordPolicyDesc')}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <Lock className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{t('users.security.minPasswordLength')}: {settings.minPasswordLength}</div>
                <div className="text-xs text-muted-foreground">{t('users.security.characters')}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <CheckCircle className={`w-5 h-5 ${settings.requireSpecialChars ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{t('users.security.requireSpecialChars')}</div>
                <div className="text-xs text-muted-foreground">!@#$%^&*()</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <CheckCircle className={`w-5 h-5 ${settings.requireNumbers ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{t('users.security.requireNumbers')}</div>
                <div className="text-xs text-muted-foreground">0-9</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>{t('users.security.passwordExpiryDesc')}:</strong> Mật khẩu sẽ hết hạn sau {settings.passwordExpiry} {t('users.security.days')} và người dùng phải đổi mật khẩu mới.
              </div>
            </div>
          </div>
        </Card>

        {/* Login Security */}
        <Card>
          <h3 className="text-foreground mb-4">{t('users.security.loginSecurity')}</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-foreground">{t('users.security.emailVerification')}</div>
                <div className="text-sm text-muted-foreground">{t('users.security.emailVerificationDesc')}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailVerification}
                onChange={(e) => setSettings({ ...settings, emailVerification: e.target.checked })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-foreground">{t('users.security.blockSuspiciousLogin')}</div>
                <div className="text-sm text-muted-foreground">{t('users.security.blockSuspiciousLoginDesc')}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.blockSuspiciousLogin}
                onChange={(e) => setSettings({ ...settings, blockSuspiciousLogin: e.target.checked })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-foreground">{t('users.security.notifyNewDevice')}</div>
                <div className="text-sm text-muted-foreground">{t('users.security.notifyNewDeviceDesc')}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyNewDevice}
                onChange={(e) => setSettings({ ...settings, notifyNewDevice: e.target.checked })}
                className="w-5 h-5"
              />
            </label>

            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-foreground">{t('users.security.sessionTimeoutLabel')}</div>
                  <div className="text-sm text-muted-foreground">{t('users.security.sessionTimeoutDesc')}</div>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground text-right">{settings.sessionTimeout} {t('users.security.minutes')}</div>
            </div>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">{t('users.security.activeSessionsTitle')}</h3>
            <button 
              onClick={() => setShowLogoutAllConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <UserX className="w-4 h-4" />
              <span>{t('users.security.logoutAll')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className={`flex items-center justify-between p-4 rounded-xl ${session.isCurrent ? 'bg-green-50 border border-green-200' : 'bg-muted/30'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div className="font-medium text-foreground">{session.device}</div>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                        {t('users.security.currentSession')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>{session.browser}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span>IP: {session.ipAddress}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button 
                    onClick={() => setSessionToLogout(session)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    {t('users.security.logout')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* IP Whitelist */}
        <Card>
          <h3 className="text-foreground mb-4">{t('users.security.ipWhitelist')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {t('users.security.ipWhitelistDesc')}
              </label>
              <textarea
                placeholder={t('users.security.ipWhitelistPlaceholder')}
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground mt-2">
                Để trống nếu muốn cho phép tất cả IP. Hãy cẩn thận khi sử dụng tính năng này.
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200">
            Hủy
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
            <Save className="w-4 h-4" />
            <span>Lưu cài đặt</span>
          </button>
        </div>

        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-md w-full">
              <div className="p-6 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">{t('users.security.setup2FATitle')}</h2>
                  <button
                    onClick={() => setShow2FAModal(false)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-muted/30 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-muted-foreground">QR Code sẽ hiển thị ở đây</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('users.security.setup2FAStep1Desc')}
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg font-mono text-sm">
                    XXXX XXXX XXXX XXXX
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Hoặc nhập mã thủ công vào ứng dụng
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t('users.security.setup2FAStep2Desc')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('users.security.verificationCodePlaceholder')}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-center font-mono text-lg"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleEnable2FA}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-2xl border border-border/60 max-w-md w-full">
              <div className="p-6 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">{t('users.security.changePasswordTitle')}</h2>
                  <button
                    onClick={() => setShowChangePasswordModal(false)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t('users.security.currentPassword')} *
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t('users.security.newPassword')} *
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                {newPassword && (
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <PasswordStrengthMeter password={newPassword} />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t('users.security.confirmNewPassword')} *
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setNewPassword('');
                  }}
                  className="px-6 py-3 border border-border/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  {t('users.security.changePassword')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          isOpen={!!sessionToLogout}
          onClose={() => setSessionToLogout(null)}
          onConfirm={handleLogoutSession}
          title="Đăng xuất phiên"
          message={`Bạn có chắc chắn muốn đăng xuất phiên trên ${sessionToLogout?.device}?`}
          confirmText="Đăng xuất"
          cancelText="Hủy"
          variant="warning"
        />

        <ConfirmDialog
          isOpen={showLogoutAllConfirm}
          onClose={() => setShowLogoutAllConfirm(false)}
          onConfirm={handleLogoutAll}
          title="Đăng xuất tất cả phiên"
          message="Bạn có chắc chắn muốn đăng xuất tất cả các phiên đăng nhập (trừ phiên hiện tại)? Điều này sẽ yêu cầu người dùng đăng nhập lại trên các thiết bị khác."
          confirmText="Đăng xuất tất cả"
          cancelText="Hủy"
          variant="danger"
        />
      </div>
    </PageWrapper>
  );

  // Handler functions
  function handleEnable2FA() {
    setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled });
    setShow2FAModal(false);
    toast.success(settings.twoFactorEnabled ? 'Đã tắt 2FA!' : 'Đã bật 2FA thành công!');
  }

  function handleChangePassword() {
    setShowChangePasswordModal(false);
    setNewPassword('');
    toast.success('Đổi mật khẩu thành công!');
  }

  function handleLogoutSession() {
    if (!sessionToLogout) return;
    toast.success(`Đã đăng xuất phiên trên ${sessionToLogout.device}`);
    setSessionToLogout(null);
  }

  function handleLogoutAll() {
    toast.success('Đã đăng xuất tất cả các phiên khác!');
    setShowLogoutAllConfirm(false);
  }
}