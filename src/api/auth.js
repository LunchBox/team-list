import { BASE_URL } from "./base";

export async function registerUser(login, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("User registered successfully:", data);
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}

export async function loginUser(login, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Login failed: ${errorData.error || response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Login successful:", data);

    // 假設伺服器返回了一個 token，你可以將它保存到 localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return true;
  } catch (error) {
    console.error("Error logging in:", error);
    return false;
  }
}

export function isUserLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  // 簡單解析 JWT 的 payload 部分（假設 token 是 JWT 格式）
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  // 檢查 token 是否過期
  if (payload.exp && payload.exp < currentTime) {
    console.warn("Token has expired");
    return false;
  }

  // 這裡可以進一步發送請求到伺服器驗證 token
  return true;
}

export async function fetchUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    console.log("Logged in user info:", userInfo);
    // 更新 UI，例如顯示用戶名
    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}
