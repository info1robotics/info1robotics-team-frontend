export const latestReviews = (reviews) => {
    const uniqueAuthorReviews = {};
    
    for(const review of reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))) {
        uniqueAuthorReviews[review.author.username] = review;
    }
    return Object.values(uniqueAuthorReviews).reverse();
};


export const outdatedReviews = (reviews) => {
    const authorsReviews = {};
    

    for(const review of reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))) {
        if(!authorsReviews[review.author.username])
            authorsReviews[review.author.username] = [];
        
        authorsReviews[review.author.username].push(review);
    }
    
    const res = [];
    for(const reviewsList of Object.values(authorsReviews)) {
        for(let i = 0; i < reviewsList.length - 1; i++) {
            res.push(reviewsList[i]);
        }
        
    }

    return res.reverse();
};