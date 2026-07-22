export const PORT = Number(process.env.PORT ?? 8000);

const codespaceDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? 'app.github.dev';

export const getApiBaseUrl = () => {
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-8000.${codespaceDomain}`;
  }

  return `http://localhost:${PORT}`;
};
