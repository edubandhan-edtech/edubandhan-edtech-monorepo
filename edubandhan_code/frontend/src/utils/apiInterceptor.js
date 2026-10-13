/**
 * EduBandhan Standard JWT Silent Refresh Interceptor
 * 
 * - Injects 'Authorization: Bearer <access_token>' to all outgoing /api requests.
 * - Intercepts 401 Unauthorized responses.
 * - Silently hits POST /api/auth/refresh (using refresh token cookie or local fallback).
 * - Queues concurrent requests so only ONE refresh call is executed.
 * - Replays the failed request(s) with the new access token transparently.
 * - If refresh fails (token revoked or 7-day expiration), cleanly fires 'edubandhan:session_expired'.
 */

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export function setupFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (resource, config = {}) {
    // Determine request URL string
    let url = typeof resource === 'string' ? resource : (resource ? resource.url : '');
    
    // Only intercept local API endpoints
    const isApiRequest = url.startsWith('/api/') || url.includes('://' + window.location.host + '/api/');
    if (!isApiRequest) {
      return originalFetch.apply(this, arguments);
    }

    // Do NOT intercept auth endpoints that handle login/refresh directly
    const isAuthBypass = url.includes('/api/auth/login') || 
                         url.includes('/api/auth/register') || 
                         url.includes('/api/auth/refresh') ||
                         url.includes('/api/auth/demo-accounts') ||
                         url.includes('/api/auth/forgot-password') ||
                         url.includes('/api/auth/reset-password');

    // Clone headers
    const headers = new Headers(config.headers || {});
    const token = sessionStorage.getItem('edubandhan_token') || localStorage.getItem('edubandhan_token');

    // Inject Bearer access token if not present
    if (token && !headers.has('Authorization') && !isAuthBypass) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    config.headers = headers;

    // Send the original request
    let response;
    try {
      response = await originalFetch(resource, config);
    } catch (networkErr) {
      throw networkErr;
    }

    // If 401 Unauthorized returned on an authenticated route, attempt silent refresh
    if (response.status === 401 && !isAuthBypass) {
      const storedRefreshToken = localStorage.getItem('edubandhan_refresh_token');

      if (isRefreshing) {
        // Another request is already refreshing the token; wait for it
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          if (newToken) {
            const retryHeaders = new Headers(config.headers);
            retryHeaders.set('Authorization', `Bearer ${newToken}`);
            config.headers = retryHeaders;
            return originalFetch(resource, config);
          }
          return response;
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await originalFetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: storedRefreshToken || '' }),
          credentials: 'include' // Attaches HttpOnly cookie
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token expired or invalid');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.access_token;
        const newRefreshToken = refreshData.refresh_token;

        if (newAccessToken) {
          localStorage.setItem('edubandhan_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('edubandhan_refresh_token', newRefreshToken);
          }
          // Reset last activity time so inactivity timer continues seamlessly
          localStorage.setItem('edubandhan_last_activity', Date.now().toString());

          processQueue(null, newAccessToken);

          // Retry the original request with the fresh access token
          const retryHeaders = new Headers(config.headers);
          retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          config.headers = retryHeaders;
          return originalFetch(resource, config);
        } else {
          throw new Error('No access token in refresh response');
        }

      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Refresh token expired or revoked -> clear session & notify App
        localStorage.removeItem('edubandhan_token');
        localStorage.removeItem('edubandhan_refresh_token');
        localStorage.removeItem('edubandhan_user');
        sessionStorage.removeItem('edubandhan_token');
        sessionStorage.removeItem('edubandhan_user');
        window.dispatchEvent(new CustomEvent('edubandhan:session_expired'));
        return response;
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  };
}
