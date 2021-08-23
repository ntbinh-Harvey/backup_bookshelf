import * as auth from 'auth-provider';

const apiURL = process.env.REACT_APP_API_URL;

async function client(
  endpoint,
  {
    data, headers: customHeaders, ...customConfig
  } = {},
) {
  const token = await auth.getToken();
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      // refresh the page for them
      window.location.assign('/authentication');
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: 'Please re-authenticate.' });
    }
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    return Promise.reject(data);
  });
}

export { client };
