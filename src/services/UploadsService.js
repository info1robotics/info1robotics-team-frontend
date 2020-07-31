export default {
    getMyUploads: () => {
        return fetch('/uploads/my').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return [];
        });
    },
    getAllUploads: () => {
        return fetch('/uploads/all/').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!"};
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
        return fetch('/uploads/one/', {
            method: 'post',
            body: JSON.stringify({upload: id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!"};
        });
    },
    deleteUpload: (id) => {
        return fetch('/uploads/one/delete', {
            method: 'post',
            body: JSON.stringify({upload: id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!"};
        });
    },
    updateUploadIntegration: (id, integrated) => {
        return fetch('/uploads/one/integration/update', {
            method: 'post',
            body: JSON.stringify({upload: {
                _id: id,
                integrated
            }}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "You are not logged in!"};
        });
    }
}