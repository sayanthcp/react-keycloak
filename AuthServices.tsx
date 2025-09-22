import axios from "axios";
// import secureLocalStorage from "react-secure-storage";

// const baseURL01 = import.meta.env.VITE_BACKEND_URL_ADMIN;
const baseURL02 = import.meta.env.VITE_API_BASE_URL_CONFIGURATION;

class AuthServices {
  // static async submitLogin(values: any) {
  //   const requestBody = {
  //     userId: 0,
  //     userName: values?.username,
  //     userEmail: "",
  //     userType: 0,
  //     tenentID: 0,
  //     subTenentID: [],
  //     password: values?.password,
  //     token: "",
  //     error: "",
  //     expiresIn: 0,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${baseURL01}/login/Login`,
  //       requestBody
  //     );
  //     if (typeof window !== "undefined") {
  //       // All save to secure storage
  //       secureLocalStorage.setItem("accessToken", response?.data?.token);
  //       secureLocalStorage.setItem("userID", response?.data?.userId);
  //       secureLocalStorage.setItem("userName", response?.data?.userName);
  //       secureLocalStorage.setItem("userEmail", response?.data?.userEmail);
  //       secureLocalStorage.setItem("userType", response?.data?.userType);
  //       secureLocalStorage.setItem("tenentID", response?.data?.tenentID);
  //       secureLocalStorage.setItem("subTenentID", response?.data?.subTenentID);
  //       secureLocalStorage.setItem("expiresIn", response?.data?.expiresIn);
  //     }

  //     return response;
  //   } catch (error: any) {
  //     return error;
  //   }
  // }

  async submitLogin (keyCloakId: any): Promise<any> {
    const requestBody: any = {
      keycloakId: keyCloakId,
    };
    try {
      const response: any = await axios.post(
        `${baseURL02}/login/KeycloakLogin?KeycloakId=${keyCloakId}`,
        requestBody
      );
      return response;
    } catch (error) {
      return error;
    }
    
  }
}

const authServicesInstance = new AuthServices();
export default authServicesInstance;
