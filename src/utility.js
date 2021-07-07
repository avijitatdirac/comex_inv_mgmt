/**
 * custom utility function which invokes the fetch API with POST method
 * this function to be called for calling an API endpoint,
 * NOTE: all API endpoint should be served by POST method,
 * this is done to seperate the API call from url submission.
 * url submission in GET request
 * In backend node js code, session authentication module checks for GET and POST
 * methods and acts accordingly.
 *
 * If any API receive 403 status that means API call is made without proper login
 * then application will be redirected to the login page
 */
export function fetchAPI(endpoint, json) {
  return fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  }).then(r => {
    if (r.status === 403) {
      window.location.href = "/login";
    } else {
      return r;
    }
  });
}
