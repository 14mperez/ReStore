import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

// Creating function to simulate loading delay
const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

// Creating interface to be able to output message in console
interface ResponseData {
    data: {
        errors: any;
        title: string;
        status: number;
    };
    status: number;
}

// Using axios/toastify to catch errors and outputting notifications to user
axios.interceptors.response.use(async response => {
    // Using function created above to simulate loading on the server
    await sleep();
    return response
}, (error: AxiosError) =>{
    const {data, status} = <ResponseData>error.response;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = []; // Not needed but created for typescript errors
                for (const key in data.errors) {
                    if (data.errors[key]) { 
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            history.push({
                pathname: '/server-error',
                state: {error: data}
            }); // Pushing new states into history
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/Unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;