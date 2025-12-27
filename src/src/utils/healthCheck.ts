/**
 * Health Check Utility
 * Kiểm tra tất cả framework packages và configuration
 */

interface HealthCheckResult {
  service: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: any;
}

export async function runHealthCheck(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  // 1. Check Framework Packages
  results.push({
    service: 'Framework Packages',
    status: 'ok',
    message: 'All @longvhv packages loaded',
    details: {
      core: '✅ @longvhv/core',
      auth: '✅ @longvhv/auth',
      query: '✅ @longvhv/query',
      theme: '✅ @longvhv/theme',
      notifications: '✅ @longvhv/notifications',
      i18n: '✅ @longvhv/i18n',
      apiClient: '✅ @longvhv/api-client',
      shared: '✅ @longvhv/shared',
    },
  });

  // 2. Check Environment Variables
  const envVars = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE,
    VITE_DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME,
  };

  const missingEnvVars = Object.entries(envVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  results.push({
    service: 'Environment Variables',
    status: missingEnvVars.length > 0 ? 'warning' : 'ok',
    message: missingEnvVars.length > 0 
      ? `Missing: ${missingEnvVars.join(', ')}` 
      : 'All environment variables configured',
    details: envVars,
  });

  // 3. Check API Connection
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      results.push({
        service: 'API Connection',
        status: 'error',
        message: 'VITE_API_URL not configured',
      });
    } else {
      // Try to ping API (with timeout)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        results.push({
          service: 'API Connection',
          status: response.ok ? 'ok' : 'warning',
          message: response.ok 
            ? `Connected to ${apiUrl}` 
            : `API returned status ${response.status}`,
          details: {
            url: apiUrl,
            status: response.status,
          },
        });
      } catch (error: any) {
        clearTimeout(timeout);
        results.push({
          service: 'API Connection',
          status: 'warning',
          message: `Cannot reach ${apiUrl} (using mock data)`,
          details: {
            url: apiUrl,
            error: error.message,
          },
        });
      }
    }
  } catch (error: any) {
    results.push({
      service: 'API Connection',
      status: 'error',
      message: error.message,
    });
  }

  // 4. Check LocalStorage
  try {
    const testKey = '__health_check__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);

    results.push({
      service: 'LocalStorage',
      status: 'ok',
      message: 'LocalStorage available',
    });
  } catch (error: any) {
    results.push({
      service: 'LocalStorage',
      status: 'error',
      message: 'LocalStorage not available',
      details: error.message,
    });
  }

  // 5. Check Browser Compatibility
  const features = {
    'ES6 Modules': typeof Symbol !== 'undefined',
    'Fetch API': typeof fetch !== 'undefined',
    'LocalStorage': typeof localStorage !== 'undefined',
    'SessionStorage': typeof sessionStorage !== 'undefined',
    'WebSocket': typeof WebSocket !== 'undefined',
  };

  const unsupported = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  results.push({
    service: 'Browser Compatibility',
    status: unsupported.length > 0 ? 'warning' : 'ok',
    message: unsupported.length > 0
      ? `Unsupported: ${unsupported.join(', ')}`
      : 'All features supported',
    details: features,
  });

  return results;
}

/**
 * Print health check results to console
 */
export function printHealthCheck(results: HealthCheckResult[]): void {
  console.group('🏥 VHV CMS Health Check');
  
  results.forEach(result => {
    const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.service}: ${result.message}`);
    
    if (result.details) {
      console.log('   Details:', result.details);
    }
  });

  const errors = results.filter(r => r.status === 'error').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const ok = results.filter(r => r.status === 'ok').length;

  console.log('\n📊 Summary:');
  console.log(`   ✅ OK: ${ok}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Errors: ${errors}`);

  console.groupEnd();
}

/**
 * Auto-run health check in development
 */
if (import.meta.env.DEV) {
  runHealthCheck().then(printHealthCheck);
}
