if (window.parent === window) {
    window.location.replace('../../../index.html');
} else {
    document.getElementById('loginForm').addEventListener('submit', event => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        window.parent.postMessage({ type: 'LOGIN', username, password }, '*');
    });

    window.addEventListener('message', event => {
        if (event.source === window.parent && event.data && event.data.type === 'LOGIN_ERROR') {
            document.getElementById('loginError').style.display = 'block';
        }
    });
}
