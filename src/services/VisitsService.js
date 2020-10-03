export default {
    getAllVisits: () => {
        return fetch('/visits/all').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Request did not succeed!"};
        });
    },
    getInProgressVisits: () => {
        return fetch('/visits/all/inprogress').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Request did not succeed!"};
        });
    },
    getMyVisit: () => {
        return fetch('/visits/my').then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Request did not succeed!"};
        });
    },
    checkin: () => {
        return fetch('/visits/checkin', {
            method: 'POST'
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Request did not succeed!"};
        });
    },
    checkout: () => {
        return fetch('/visits/checkout', {
            method: 'POST'
        }).then(res => {
            if(res.status !== 401) return res.json().then(data => data);
            else return {success: false, message: "Request did not succeed!"};
        });
    }
}