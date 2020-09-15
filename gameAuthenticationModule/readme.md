var sso_base_url = (process.env.SS0_HTTPS_ADDRESS||'https://localhost:3000')
var port = normalizePort(process.env.PORT || '3001');


config SSO_HTTPS_ADDRESS in deployment pls: for example SS0_HTTPS_ADDRESS='https:3000://mysso.com'
and also config PORT number for this service : for example PORT=3001