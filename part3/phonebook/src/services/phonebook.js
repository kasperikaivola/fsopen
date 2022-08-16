import axios from 'axios'
const baseUrl = 'http://radiant-garden-13683.herokuapp.com/api/persons'

const getAll = () => {return axios.get(baseUrl)}

const create = newObject => {return axios.post(baseUrl, newObject).then(response => response.data)}

const update = (id, newObject) => {return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)}

const deletePerson = (id) => {return axios.delete(`${baseUrl}/${id}`).then(response => response.data)}

const phonebook = {getAll,create,update, deletePerson}

export default phonebook