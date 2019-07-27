import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-1e652.firebaseio.com/'
});

export default instance;