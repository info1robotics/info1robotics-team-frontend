export default {
    getMyUploads: (user) => {
        return fetch('/user/uploads').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return [];
        })
    }
}