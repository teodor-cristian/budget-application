import axios from 'axios';

export const addCapability = (id_user, capability_id) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/users/update_user_capability', {id_user: id_user,capability_id: capability_id}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat un nou comentariu !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const addExpense = (_id_capabilitate, newexpense) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_expense', {_id_capabilitate: _id_capabilitate, newExpense: {name: newexpense.name, description: newexpense.description, sum: newexpense.sum, category_name: newexpense.category_name}}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat o noua cheltuiala !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const addUserExpense = (_id_capabilitate, newexpense) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_expense_as_user', {_id_capabilitate: _id_capabilitate, newExpense: newexpense}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat o noua cheltuiala (de la user) !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const addCategory  = (_id_capabilitate, newcategory) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_category', {_id_capabilitate: _id_capabilitate, newCategory: {name: newcategory.name, description: newcategory.description, budget: newcategory.budget}}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat o noua categorie !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const addManagerResponse  = (_id_capabilitate, _id_categorie, _id_comment, userName, managerResponse,managerName) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_comment_management_response', {_id_capabilitate: _id_capabilitate,_id_categorie: _id_categorie, _id_comment: _id_comment, userName: userName, managerResponse: {name: managerResponse.name, body: managerResponse.body, grantPermission: managerResponse.grantPermission, date: managerResponse.date,managerName: managerName}}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat un nou manager response!");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const markAllCommentsAsRead  = (_id_capabilitate, _id_categorie) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_mark_comments_as_read', {_id_capabilitate: _id_capabilitate,_id_categorie: _id_categorie}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("Commments are marked as read !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const changeCategoryBudget  = (_id_capabilitate, _id_categorie, new_budget) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/capabilities/post_change_category_budget', {_id_capabilitate: _id_capabilitate,_id_categorie: _id_categorie, new_budget: new_budget}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("The budget has been changed !");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const deleteCapibilityFromUser = (user_full_name, capability_id) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/users/update_user_delete_capability', {user_full_name: user_full_name,capability_id: capability_id}, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("Capabilitatea a fost scoasa de la user!");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}