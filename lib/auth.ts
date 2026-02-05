/**
 * Authentication functions for login and register
 * @author marennod
 */

/** Login credentials */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Login result */
export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    username: string;
    name?: string;
  };
}

/**
 * Validates username format
 * @param username - Username to validate
 * @returns True if valid (min 3 chars, letters/numbers/underscore only)
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}

/**
 * Validates password format
 * @param password - Password to validate
 * @returns True if valid (min 6 chars)
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Authenticates user with username and password
 * @param credentials - Login credentials
 * @returns Promise with login result
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const { username, password } = credentials;

  // Validate input on the client-side first
  if (!validateUsername(username)) {
    return {
      success: false,
      error: 'Ugyldig brukernavn (minimum 3 tegn, kun bokstaver, tall og _)',
    };
  }

  if (!validatePassword(password)) {
    return {
      success: false,
      error: 'Passord må være minst 6 tegn',
    };
  }

  try {
    // call API-endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Innlogging feilet',
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Kunne ikke koble til serveren',
    };
  }
}
