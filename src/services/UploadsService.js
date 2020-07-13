export default {
    getMyUploads: () => {
        return fetch('/user/uploads').then(res => { // TODO: ENDPOINT RENAME TO '/uploads/my'
            if(res.status !== 401) return res.json().then(data => data);
            else return [];
        });
    },
    getAllUploads: () => {
        return fetch('/uploads/all/').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!", upload: {}};
        });
    },
    newUpload: (uploadForm) => {
        return fetch('/uploads/add', {
            method: 'POST',
            body: uploadForm
        }).then(res => res.json())
        .then(data => data);
    },
    getUpload: (id) => {
        return fetch('/uploads/one/' + id).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!", upload: {}};
        });
    }
}