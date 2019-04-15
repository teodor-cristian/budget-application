import axios from 'axios';

export const addComment = (newComment) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_comment', newComment, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat un nou comentariu !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}