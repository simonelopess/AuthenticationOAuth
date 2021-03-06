import axios from "axios";

// Receber código via string
// Recuperar access token no github
// Recuperar infos do user no github
// Verificar se o usuário existe no DB
//   ---- SIM = gera token
//   ---- NAO = cria no db, gera um token

// Retornar o token com infos do user

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
    avatar_url: string,
    login: string, 
    name: string
}

class AuthenticateUserService {
  async execute(code: string) {
    // acesso no git para recuperar o token
    const url = "https://github.com/login/oauth/access_token";
    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

      const response = await axios.get<IUserResponse>("https://api.github.com/user", {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      });

    return response.data;
  }
}

export { AuthenticateUserService };
