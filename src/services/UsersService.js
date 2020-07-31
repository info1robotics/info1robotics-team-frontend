export default {
    login: user => {
        return fetch('/users/login', {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return { isAuthenticated: false, user: { username: "", role: "" }, message: { msgBody: "Could not log in. Please check the login data.", success: false}}
        });
    },
    addNewUser: user => {
        return fetch('/users/register', {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => data);
    },
    activateUser: user => {
        return fetch('/users/activate', {
            method: 'post',
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => data);
    },
    logout: () => {
        return fetch('/users/logout')
        .then(res => res.json())
        .then(data => data);
    },
    isAuthenticated: () => {
        return fetch('/users/authenticated')
        .then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return { isAuthenticated: false, user: { username: "", role: "" }};
        })
    },
    getAllUsers: () => {
        return fetch('/users/all')
        .then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return { success: false, message: "You are not logged in!"};
        });
    },
    updateUsers: (users) => {
        return fetch('/users/multiple/update', {
            method: 'post',
            body: JSON.stringify({users}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => data);
    },
    inviteNewUser: (user) => {
        return fetch('/users/invite', {
            method: 'post',
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => data);
    }
    
}