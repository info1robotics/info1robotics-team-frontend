export default {
    getMyUploads: (user) => {
        return fetch('/user/uploads').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return [];
        });
    },
    newUpload: (uploadForm) => {
        return fetch('/uploads/add', {
            method: 'POST',
            body: uploadForm
        }).then(res => res.json())
        .then(data => data);
    },
    getUpload: (filename) => {
        return fetch('/uploads/one/' + filename).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!", upload: {}};
        });
    }
}