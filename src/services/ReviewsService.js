export default {
    getUploadReviews: (id) => {
        return fetch(`/uploads/one/reviews`, {
            method: 'post',
            body: JSON.stringify({upload: id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Could not !", exists: false, review: {}}; 
        });
    },
    getUserReview: (id) => {
        return fetch(`/uploads/one/reviews/userReview`, {
            method: 'post',
            body: JSON.stringify({upload: id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Could not !", exists: false, review: {}}; 
        });
    },
    newReview: review => {
        return fetch(`/uploads/one/reviews/add`, {
            method: 'post',
            body: JSON.stringify({upload: review.upload._id, review}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => data);
    },
};